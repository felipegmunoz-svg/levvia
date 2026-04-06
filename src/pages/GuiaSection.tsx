import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

/** Parse table-like content into rows and columns */
function parseTable(content: string) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // Try to detect column count from first few lines
  // Tables in the ebook have patterns like: Header1 \n Value1 \n Header2 \n Value2
  // Or: Característica \n Lipedema \n Linfedema \n Obesidade

  // Check if first line looks like a title (not a column header)
  let startIdx = 0;
  let title = "";
  if (lines[0].length > 40 || !lines[1]) {
    title = lines[0];
    startIdx = 1;
  }

  // Detect number of columns by looking for repeating patterns
  const remainingLines = lines.slice(startIdx);

  // For the known tables, detect by content
  const isThreeColTable = remainingLines.some((l) => l === "Lipedema") &&
                          remainingLines.some((l) => l === "Linfedema");
  const isTwoColTable = remainingLines.some((l) => l.includes("Drenagem Linfática")) &&
                        remainingLines.some((l) => l.includes("Modeladora"));

  if (isThreeColTable) {
    // 4-column table: Característica, Lipedema, Linfedema, Obesidade
    return parseFixedColumnTable(remainingLines, 4, title);
  } else if (isTwoColTable) {
    // 3-column table: Característica, DLM, Massagem
    return parseFixedColumnTable(remainingLines, 3, title);
  }

  return null;
}

function parseFixedColumnTable(lines: string[], numCols: number, title: string) {
  // Group lines into rows of numCols
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";

  for (const line of lines) {
    // Heuristic: if the line is a known header or very short and matches pattern
    const isNewCell = currentCell.length > 0 && (
      line.length < 50 ||
      /^[A-ZÁÉÍÓÚ]/.test(line)
    );

    if (currentCell && isNewCell) {
      currentRow.push(currentCell.trim());
      currentCell = line;

      if (currentRow.length === numCols) {
        rows.push(currentRow);
        currentRow = [];
      }
    } else {
      currentCell = currentCell ? currentCell + " " + line : line;
    }
  }

  // Push remaining
  if (currentCell) currentRow.push(currentCell.trim());
  if (currentRow.length > 0) rows.push(currentRow);

  return { title, rows, numCols };
}

function TableRenderer({ content }: { content: string }) {
  const table = parseTable(content);

  if (!table || table.rows.length < 2) {
    // Fallback: render as formatted text blocks
    const blocks = content.split("\n\n").filter(Boolean);
    return (
      <div className="space-y-3">
        {blocks.map((block, i) => {
          const lines = block.split("\n").filter((l) => l.trim());
          if (lines.length === 1) {
            return <p key={i} className="font-semibold text-levvia-fg">{lines[0]}</p>;
          }
          return (
            <div key={i} className="levvia-card !p-3 space-y-1">
              {lines.map((line, j) => (
                <p key={j} className={j === 0 ? "font-semibold text-levvia-fg text-sm" : "text-levvia-fg/70 text-sm"}>
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  const [header, ...bodyRows] = table.rows;

  return (
    <div>
      {table.title && (
        <p className="font-heading font-bold text-levvia-fg mb-3">{table.title}</p>
      )}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-levvia-primary/10">
              {header.map((cell, i) => (
                <th key={i} className="text-left px-3 py-2.5 font-semibold text-levvia-fg border border-levvia-border text-xs">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-levvia-bg"}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-2.5 border border-levvia-border text-xs text-levvia-fg/80 ${j === 0 ? "font-medium" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GuiaSection() {
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();

  const goBackToGuia = () => navigate(`/guia?cap=${chapterId}&from=${sectionId}`);

  const { data: section } = useQuery({
    queryKey: ["ebook-section", sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebook_sections")
        .select("*")
        .eq("id", sectionId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!sectionId,
  });

  const { data: chapter } = useQuery({
    queryKey: ["ebook-chapter", chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebook_chapters")
        .select("*")
        .eq("chapter_number", Number(chapterId))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  const { data: siblings } = useQuery({
    queryKey: ["ebook-siblings", chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebook_sections")
        .select("id, section_title, sort_order")
        .eq("chapter_number", Number(chapterId))
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  const currentIdx = siblings?.findIndex((s) => s.id === sectionId) ?? -1;
  const prev = currentIdx > 0 ? siblings?.[currentIdx - 1] : null;
  const next = currentIdx >= 0 && siblings && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  const isTable = section?.content_type === "table";

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a2540]/95 backdrop-blur-sm border-b border-levvia-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goBackToGuia}
            className="p-1.5 rounded-lg hover:bg-levvia-primary/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-levvia-fg" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-heading font-semibold text-levvia-fg truncate">
              {chapter?.title || "Guia"}
            </p>
          </div>
        </div>
      </div>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-levvia-muted mb-4 flex-wrap">
          <button onClick={goBackToGuia} className="hover:text-levvia-primary transition-colors">
            Guia
          </button>
          <span>›</span>
          <button onClick={goBackToGuia} className="hover:text-levvia-primary transition-colors">
            Cap {chapterId}
          </button>
          <span>›</span>
          <span className="text-levvia-fg font-medium truncate max-w-[200px]">
            {section?.section_title}
          </span>
        </div>

        {/* Tags */}
        {section?.tags && section.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(section.tags as string[]).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#4fd1c5]/12 text-[#4fd1c5]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-heading font-bold text-levvia-fg mb-2">
          {section?.section_title}
        </h2>
        {section?.subsection_title && (
          <p className="text-base text-levvia-muted mb-6">{section.subsection_title}</p>
        )}

        {/* Content */}
        {section?.content && (
          isTable ? (
            <TableRenderer content={section.content} />
          ) : (
            <div className="space-y-4 text-levvia-fg/90 leading-relaxed text-base font-body">
              {section.content
                .split(/\n\s*\n/)
                .map((block) => block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          )
        )}

        {/* Prev/Next */}
        <div className="flex items-center justify-between mt-8 gap-3">
          {prev ? (
            <button
              onClick={() => navigate(`/guia/${chapterId}/${prev.id}`)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-levvia-border hover:border-levvia-primary/30 transition-colors text-sm flex-1 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 text-levvia-muted" />
              <span className="truncate text-levvia-fg">{prev.section_title}</span>
            </button>
          ) : <div />}
          {next ? (
            <button
              onClick={() => navigate(`/guia/${chapterId}/${next.id}`)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-levvia-border hover:border-levvia-primary/30 transition-colors text-sm flex-1 text-right min-h-[44px]"
            >
              <span className="truncate text-levvia-fg">{next.section_title}</span>
              <ChevronRight className="w-4 h-4 shrink-0 text-levvia-muted" />
            </button>
          ) : <div />}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
