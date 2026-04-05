import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Guia() {
  const [searchParams] = useSearchParams();
  const openChapter = searchParams.get("cap");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(
    openChapter ? Number(openChapter) : null
  );
  const navigate = useNavigate();

  // Keep accordion open when returning from a section
  useEffect(() => {
    if (openChapter) {
      setExpandedChapter(Number(openChapter));
    }
  }, [openChapter]);

  const { data: chapters, isLoading: loadingChapters } = useQuery({
    queryKey: ["ebook-chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebook_chapters")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: sections } = useQuery({
    queryKey: ["ebook-sections-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebook_sections")
        .select("id, chapter_number, section_title, content_type, sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const sectionsByChapter = sections?.reduce((acc, section) => {
    const key = section.chapter_number;
    if (!acc[key]) acc[key] = [];
    acc[key].push(section);
    return acc;
  }, {} as Record<number, typeof sections>) || {};

  const contentTypeIcon = (type: string | null) => {
    switch (type) {
      case "table": return "📊";
      case "checklist": return "✅";
      case "tool": return "🔧";
      case "protocol": return "⚡";
      default: return "📝";
    }
  };

  const toggleChapter = (num: number) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-levvia-bg/95 backdrop-blur-sm border-b border-levvia-border px-4 py-4">
        <h1 className="text-xl font-heading font-bold text-levvia-fg">Guia Levvia</h1>
        <p className="text-sm text-levvia-muted mt-0.5">Seu guia completo sobre Lipedema</p>
      </div>

      {/* Chapters */}
      <main className="px-4 py-4 max-w-lg mx-auto space-y-2">
        {loadingChapters && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="levvia-card animate-pulse h-16" />
            ))}
          </div>
        )}

        {chapters?.map((chapter) => {
          const isExpanded = expandedChapter === chapter.chapter_number;
          const chapterSections = sectionsByChapter[chapter.chapter_number] || [];

          return (
            <div key={chapter.id} className="levvia-card !p-0 overflow-hidden">
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.chapter_number)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-levvia-primary/5 transition-colors min-h-[56px]"
              >
                <span className="text-2xl shrink-0">{chapter.icon || "📖"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-levvia-primary font-medium">
                    {chapter.chapter_number === 0 ? "Introdução" : `Capítulo ${chapter.chapter_number}`}
                  </p>
                  <p className="font-heading font-semibold text-levvia-fg text-sm truncate">
                    {chapter.title}
                  </p>
                </div>
                <span className="text-levvia-muted shrink-0">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </span>
              </button>

              {/* Sections list */}
              {isExpanded && chapterSections.length > 0 && (
                <div className="border-t border-levvia-border animate-fade-in">
                  {chapterSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => navigate(`/guia/${chapter.chapter_number}/${section.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-levvia-primary/5 transition-colors border-b border-levvia-border last:border-b-0 min-h-[44px]"
                    >
                      <span className="text-sm">{contentTypeIcon(section.content_type)}</span>
                      <span className="text-sm text-levvia-fg/80 flex-1 min-w-0 truncate">
                        {section.section_title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-levvia-muted shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
