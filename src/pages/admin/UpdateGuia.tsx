import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SectionItem {
  chapter_number: number;
  section_title: string;
  content: string;
}

const UpdateGuia = () => {
  const [results, setResults] = useState<{ success: number; fail: number; errors: string[] }>({ success: 0, fail: 0, errors: [] });
  const [running, setRunning] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRunning(true);
    setResults({ success: 0, fail: 0, errors: [] });

    const text = await file.text();
    const items: SectionItem[] = JSON.parse(text);
    let success = 0;
    let fail = 0;
    const errors: string[] = [];

    for (const item of items) {
      const { error } = await supabase
        .from("ebook_sections")
        .update({ content: item.content })
        .eq("section_title", item.section_title)
        .eq("chapter_number", item.chapter_number);

      if (error) {
        fail++;
        errors.push(`${item.section_title}: ${error.message}`);
      } else {
        success++;
      }
      setResults({ success, fail, errors: [...errors] });
    }
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Atualizar Guia (JSON)</h1>
      <Input type="file" accept=".json" onChange={handleFile} disabled={running} />
      {(results.success > 0 || results.fail > 0) && (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">✅ {results.success} atualizados</p>
          {results.fail > 0 && <p className="text-red-600 font-medium">❌ {results.fail} falhas</p>}
          {results.errors.map((err, i) => <p key={i} className="text-sm text-red-500">{err}</p>)}
        </div>
      )}
      {running && <p className="text-muted-foreground">Processando...</p>}
    </div>
  );
};

export default UpdateGuia;
