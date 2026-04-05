import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";

const STOP_WORDS = new Set([
  "que", "como", "para", "com", "por", "uma", "uns", "umas", "dos", "das",
  "nos", "nas", "aos", "pela", "pelo", "pelas", "pelos", "num", "numa",
  "este", "esta", "esse", "essa", "isso", "isto", "aqui", "ali",
  "meu", "minha", "meus", "minhas", "seu", "sua", "seus", "suas",
  "nosso", "nossa", "nossos", "nossas", "dele", "dela", "deles", "delas",
  "qual", "quais", "quem", "onde", "quando", "porque", "porquê",
  "fazer", "faz", "fez", "pode", "posso", "devo", "tem", "tenho", "havia",
  "ser", "são", "foi", "era", "será", "está", "estar", "estou",
  "ter", "teve", "tinha", "sobre", "entre", "mais", "menos", "muito",
  "bem", "mal", "sim", "não", "também", "ainda", "apenas", "mesmo",
  "ela", "ele", "eles", "elas", "você", "vocês", "gente",
  "todo", "toda", "todos", "todas", "cada", "outro", "outra",
  "depois", "antes", "agora", "sempre", "nunca", "já",
  "preciso", "quero", "gostaria", "significa", "quer", "dizer",
  "corpo", "dia", "vez", "coisa", "forma", "tipo", "lado",
]);

interface TodaySearchOverlayProps {
  onClose: () => void;
}

export default function TodaySearchOverlay({ onClose }: TodaySearchOverlayProps) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: results } = useQuery({
    queryKey: ["home-search", search],
    queryFn: async () => {
      if (!search || search.length < 3) return [];
      const words = search
        .toLowerCase()
        .replace(/[?!.,;:()""'']/g, "")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
      if (words.length === 0) return [];

      const filters = words.flatMap((word) => [
        `content.ilike.%${word}%`,
        `section_title.ilike.%${word}%`,
      ]);

      const { data, error } = await supabase
        .from("ebook_sections")
        .select("id, chapter_number, section_title, content, tags, keywords")
        .or(filters.join(","))
        .limit(30);
      if (error) throw error;
      if (!data) return [];

      const scored = data.map((item) => {
        let score = 0;
        const title = item.section_title?.toLowerCase() || "";
        const content = item.content?.toLowerCase() || "";
        const tags = (item.tags as string[])?.map((t) => t.toLowerCase()) || [];
        const keywords = (item.keywords as string[])?.map((k) => k.toLowerCase()) || [];

        for (const word of words) {
          if (title.includes(word)) score += 10;
          if (tags.some((t) => t.includes(word))) score += 8;
          if (keywords.some((k) => k.includes(word))) score += 8;
          if (content.slice(0, 200).includes(word)) score += 5;
          if (content.includes(word)) score += 1;
        }
        return { ...item, score };
      });

      return scored.sort((a, b) => b.score - a.score).slice(0, 5);
    },
    enabled: search.length >= 3,
  });

  const getSnippet = (text: string) => {
    const words = search
      .toLowerCase()
      .replace(/[?!.,;:]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
    for (const word of words) {
      const idx = text.toLowerCase().indexOf(word);
      if (idx !== -1) {
        const sentenceStart = text.lastIndexOf(".", Math.max(0, idx - 40));
        const start = sentenceStart > 0 ? sentenceStart + 2 : Math.max(0, idx - 30);
        const end = Math.min(text.length, start + 140);
        const prefix = start > 0 ? "..." : "";
        const suffix = end < text.length ? "..." : "";
        return prefix + text.slice(start, end).trim() + suffix;
      }
    }
    return text.slice(0, 120) + "...";
  };

  const handleSelect = (chapterNumber: number, sectionId: string) => {
    onClose();
    navigate(`/guia/${chapterNumber}/${sectionId}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-background min-h-screen">
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="O que você precisa saber?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="px-4 py-3 space-y-2 max-h-[80vh] overflow-y-auto">
          {search.length >= 3 && results && results.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                {results.length} resultado{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.chapter_number, result.id)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.06] border border-white/10 hover:border-secondary/30 transition-all"
                >
                  <p className="text-[10px] text-secondary font-medium">
                    Capítulo {result.chapter_number}
                  </p>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {result.section_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {getSnippet(result.content)}
                  </p>
                </button>
              ))}
            </>
          )}

          {search.length >= 3 && results && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum resultado encontrado
            </p>
          )}

          {search.length < 3 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Digite 3 ou mais letras para buscar no Guia
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
