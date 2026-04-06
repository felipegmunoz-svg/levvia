import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Send, Clock, Book, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

interface DiaryEntry {
  id: string;
  content: string;
  created_at: string;
}

const Diary = () => {
  const navTo = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const loadEntries = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from("diary_entries")
        .select("id, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setEntries(data);
    } catch {
      // silently fail — entries are a bonus, not critical
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user?.id]);

  const handleSave = async () => {
    if (!text.trim() || !user?.id || saving) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .insert({ user_id: user.id, content: text.trim() })
        .select("id, content, created_at")
        .single();
      if (!error && data) {
        setEntries((prev) => [data, ...prev]);
        setText("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 text-center">
        <img src={logoFull} alt="Levvia" className="h-8 mx-auto mb-4" />
        <div className="flex items-center justify-center gap-2 mb-1">
          <PenLine size={18} className="text-primary" strokeWidth={1.5} />
          <h1 className="text-2xl font-heading font-semibold text-levvia-fg">
            Meu Espaço de Leveza
          </h1>
        </div>
        <p className="text-sm text-levvia-muted font-body mt-2 leading-relaxed max-w-xs mx-auto">
          Este é o seu espaço. Como você está se sentindo agora?
        </p>

        {/* Sub-tabs */}
        <div className="flex gap-2 mt-4 justify-center">
          <button
            onClick={() => navTo("/journey")}
            className="px-4 py-2 rounded-lg text-xs font-medium text-levvia-muted hover:bg-levvia-primary/5 transition-colors flex items-center gap-1.5"
          >
            <Book className="w-3.5 h-3.5" />
            Jornada
          </button>
          <button
            onClick={() => navTo("/progress")}
            className="px-4 py-2 rounded-lg text-xs font-medium text-levvia-muted hover:bg-levvia-primary/5 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Progresso
          </button>
          <button className="px-4 py-2 rounded-lg text-xs font-medium bg-levvia-primary/10 text-levvia-primary">
            Diário
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 mb-6">
        <div className="levvia-card p-4 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Sinta-se à vontade para escrever aqui..."
            rows={5}
            className="w-full bg-transparent text-sm text-levvia-fg font-body placeholder:text-levvia-muted/60 resize-none outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-levvia-muted font-body">
              {text.length > 0 ? `${text.length} caracteres` : ""}
            </span>
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium font-body transition-all ${
                text.trim() && !saving
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-levvia-muted cursor-not-allowed"
              }`}
            >
              {saved ? (
                "Registrado ✓"
              ) : saving ? (
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <>
                  <Send size={12} strokeWidth={1.5} />
                  Registrar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Past Entries */}
      {!loadingEntries && entries.length > 0 && (
        <div className="px-6">
          <h2 className="text-xs uppercase tracking-widest text-levvia-muted font-body mb-3">
            Registros anteriores
          </h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="levvia-card p-4">
                <p className="text-sm text-levvia-fg font-body leading-relaxed">
                  {entry.content}
                </p>
                <p className="text-[11px] text-levvia-muted font-body mt-2 flex items-center gap-1">
                  <Clock size={11} strokeWidth={1.5} />
                  {formatDate(entry.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loadingEntries && entries.length === 0 && (
        <div className="px-6">
          <div className="levvia-card p-6 text-center">
            <PenLine size={24} className="text-levvia-muted mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-levvia-muted font-body">
              Seu primeiro registro aparecerá aqui. Escreva o que você sentiu hoje.
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Diary;
