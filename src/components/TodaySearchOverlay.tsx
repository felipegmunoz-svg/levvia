import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { touchpointConfig } from "@/data/touchpointConfig";

interface TodaySearchOverlayProps {
  onClose: () => void;
}

const TodaySearchOverlay = ({ onClose }: TodaySearchOverlayProps) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const matches: { day: number; name: string; type: string; description: string }[] = [];

    for (const [dayStr, config] of Object.entries(touchpointConfig)) {
      const day = Number(dayStr);
      const touchpoints = (config as any).touchpoints ?? [];
      for (const tp of touchpoints) {
        const name = tp.name ?? "";
        const desc = tp.description ?? "";
        if (name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
          matches.push({ day, name, type: tp.type, description: desc });
        }
      }
    }

    return matches.slice(0, 20);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <Search className="w-5 h-5 text-white/50" />
        <input
          autoFocus
          type="text"
          placeholder="Buscar exercícios, receitas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
        />
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {query.length >= 2 && results.length === 0 && (
          <p className="text-white/40 text-sm text-center mt-8">Nenhum resultado encontrado.</p>
        )}
        {results.map((r, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium text-emerald-400 uppercase">{r.type}</span>
              <span className="text-[10px] text-white/30">Dia {r.day}</span>
            </div>
            <p className="text-sm text-white font-medium">{r.name}</p>
            <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySearchOverlay;
