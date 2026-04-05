import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export default function GuiaSection() {
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-levvia-bg/95 backdrop-blur-sm border-b border-levvia-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/guia")}
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
          <button onClick={() => navigate("/guia")} className="hover:text-levvia-primary transition-colors">
            Guia
          </button>
          <span>›</span>
          <button onClick={() => navigate("/guia")} className="hover:text-levvia-primary transition-colors">
            {chapter?.chapter_number === 0 ? "Introdução" : `Cap ${chapterId}`}
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
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-levvia-primary/10 text-levvia-primary"
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
        <div className="space-y-4 text-levvia-fg/90 leading-relaxed text-base font-body">
          {section?.content &&
            section.content
              .split(/\n\s*\n/)
              .map((block) => block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
        </div>

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
