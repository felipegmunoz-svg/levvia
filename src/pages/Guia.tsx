import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Dna,
  ShieldCheck,
  Salad,
  Activity,
  Syringe,
  Brain,
  CalendarHeart,
  Wrench,
  Wallet,
  Music,
  Star,
  FileText,
  Table2,
  CheckSquare,
  Cog,
  Zap,
  Check,
} from "lucide-react";

const VISITED_KEY = "levvia_guia_visited";

function getVisitedSections(): Set<string> {
  try {
    const stored = localStorage.getItem(VISITED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

/** Map chapter_number to a Lucide icon */
const chapterIcons: Record<number, React.ReactNode> = {
  1: <Search className="w-5 h-5" />,
  2: <Dna className="w-5 h-5" />,
  3: <ShieldCheck className="w-5 h-5" />,
  4: <Salad className="w-5 h-5" />,
  5: <Activity className="w-5 h-5" />,
  6: <Syringe className="w-5 h-5" />,
  7: <Brain className="w-5 h-5" />,
  8: <CalendarHeart className="w-5 h-5" />,
  9: <Wrench className="w-5 h-5" />,
  10: <Wallet className="w-5 h-5" />,
  11: <Music className="w-5 h-5" />,
  12: <Star className="w-5 h-5" />,
};

const contentTypeIcons: Record<string, React.ReactNode> = {
  table: <Table2 className="w-3.5 h-3.5" />,
  checklist: <CheckSquare className="w-3.5 h-3.5" />,
  tool: <Cog className="w-3.5 h-3.5" />,
  protocol: <Zap className="w-3.5 h-3.5" />,
  text: <FileText className="w-3.5 h-3.5" />,
};

export default function Guia() {
  const [searchParams] = useSearchParams();
  const openChapter = searchParams.get("cap");
  const lastSection = searchParams.get("from");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(
    openChapter ? Number(openChapter) : null
  );
  const [visited, setVisited] = useState<Set<string>>(getVisitedSections);
  const navigate = useNavigate();

  useEffect(() => {
    if (openChapter) {
      setExpandedChapter(Number(openChapter));
    }
  }, [openChapter]);

  // Refresh visited list when page loads (in case user just came back)
  useEffect(() => {
    setVisited(getVisitedSections());
  }, [openChapter, lastSection]);

  const markVisited = (sectionId: string) => {
    const updated = new Set(visited);
    updated.add(sectionId);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...updated]));
    setVisited(updated);
  };

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

  const sectionsByChapter =
    sections?.reduce(
      (acc, section) => {
        const key = section.chapter_number;
        if (!acc[key]) acc[key] = [];
        acc[key].push(section);
        return acc;
      },
      {} as Record<number, typeof sections>
    ) || {};

  const toggleChapter = (num: number) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  const handleSectionClick = (chapterNum: number, sectionId: string) => {
    markVisited(sectionId);
    navigate(`/guia/${chapterNum}/${sectionId}`);
  };

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-levvia-bg/95 backdrop-blur-sm border-b border-levvia-border px-4 py-4">
        <h1 className="text-xl font-heading font-bold text-levvia-fg">
          Guia Levvia
        </h1>
        <p className="text-sm text-levvia-muted mt-0.5">
          Seu guia completo sobre Lipedema
        </p>
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
          const chapterSections =
            sectionsByChapter[chapter.chapter_number] || [];
          const visitedCount = chapterSections.filter((s) =>
            visited.has(s.id)
          ).length;
          const totalCount = chapterSections.length;

          return (
            <div
              key={chapter.id}
              className="levvia-card !p-0 overflow-hidden"
            >
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.chapter_number)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-levvia-primary/5 transition-colors min-h-[56px]"
              >
                <div className="w-9 h-9 rounded-lg bg-levvia-primary/10 text-levvia-primary flex items-center justify-center shrink-0">
                  {chapterIcons[chapter.chapter_number] || (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-levvia-primary font-medium">
                      Capítulo {chapter.chapter_number}
                    </p>
                    {visitedCount > 0 && (
                      <span className="text-[10px] text-levvia-muted">
                        {visitedCount}/{totalCount}
                      </span>
                    )}
                  </div>
                  <p className="font-heading font-semibold text-levvia-fg text-sm truncate">
                    {chapter.title}
                  </p>
                </div>
                <span className="text-levvia-muted shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </span>
              </button>

              {/* Sections list */}
              {isExpanded && chapterSections.length > 0 && (
                <div className="border-t border-levvia-border animate-fade-in">
                  {chapterSections.map((section) => {
                    const isVisited = visited.has(section.id);
                    const isLastVisited = lastSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() =>
                          handleSectionClick(
                            chapter.chapter_number,
                            section.id
                          )
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-levvia-border last:border-b-0 min-h-[44px] ${
                          isLastVisited
                            ? "bg-levvia-primary/8 border-l-2 !border-l-levvia-primary"
                            : isVisited
                              ? "bg-levvia-primary/3"
                              : "hover:bg-levvia-primary/5"
                        }`}
                      >
                        <span
                          className={`shrink-0 ${
                            isVisited
                              ? "text-levvia-primary"
                              : "text-levvia-muted"
                          }`}
                        >
                          {isVisited ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            contentTypeIcons[section.content_type || "text"]
                          )}
                        </span>
                        <span
                          className={`text-sm flex-1 min-w-0 truncate ${
                            isVisited
                              ? "text-levvia-fg"
                              : "text-levvia-fg/70"
                          }`}
                        >
                          {section.section_title}
                        </span>
                        {isLastVisited && (
                          <span className="text-[10px] text-levvia-primary font-medium shrink-0">
                            último
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 ${
                            isVisited
                              ? "text-levvia-primary/50"
                              : "text-levvia-muted"
                          }`}
                        />
                      </button>
                    );
                  })}
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
