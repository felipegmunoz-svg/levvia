import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface SectionItem {
  chapter_number: number;
  section_title: string;
  content: string;
  [key: string]: unknown;
}

const UpdateGuia = () => {
  const [status, setStatus] = useState<string>("");
  const [results, setResults] = useState<{ success: number; fail: number; errors: string[] }>({ success: 0, fail: 0, errors: [] });
  const [running, setRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRunning(true);
    setResults({ success: 0, fail: 0, errors: [] });

    const text = await file.text();
    const items: SectionItem[] = JSON.parse(text);

    setStatus(`Processando ${items.length} seções...`);

    let success = 0;
    let fail = 0;
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { error, count } = await supabase
        .from("ebook_sections")
        .update({ content: item.content })
        .eq("section_title", item.section_title)
        .eq("chapter_number", item.chapter_number);

      if (error) {
        fail++;
        errors.push(`[${item.chapter_number}] ${item.section_title}: ${error.message}`);
      } else {
        success++;
      }

      if ((i + 1) % 10 === 0 || i === items.length - 1) {
        setResults({ success, fail, errors: [...errors] });
        setStatus(`${i + 1}/${items.length} processados...`);
      }
    }

    setStatus(`Concluído! ${success} atualizados, ${fail} falhas.`);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-background p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Atualizar Conteúdo do Guia</h1>
      <p className="text-muted-foreground">
        Faça upload do JSON corrigido. Cada item deve ter <code>chapter_number</code>, <code>section_title</code> e <code>content</code>.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleUpload}
        disabled={running}
        className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-secondary file:text-secondary-foreground"
      />

      {status && <p className="text-sm font-medium text-foreground">{status}</p>}

      {results.success > 0 && (
        <p className="text-sm text-green-400">✅ {results.success} atualizados com sucesso</p>
      )}
      {results.fail > 0 && (
        <div className="space-y-1">
          <p className="text-sm text-red-400">❌ {results.fail} falhas</p>
          {results.errors.map((err, i) => (
            <p key={i} className="text-xs text-red-300">{err}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateGuia;
