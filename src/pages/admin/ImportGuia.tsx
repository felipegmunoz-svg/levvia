import { useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface ImportResult {
  success: number;
  errors: number;
  messages: string[];
}

const ImportGuia = () => {
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [sosFile, setSosFile] = useState<File | null>(null);
  const [ebookProgress, setEbookProgress] = useState(0);
  const [sosProgress, setSosProgress] = useState(0);
  const [ebookResult, setEbookResult] = useState<ImportResult | null>(null);
  const [sosResult, setSosResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const ebookRef = useRef<HTMLInputElement>(null);
  const sosRef = useRef<HTMLInputElement>(null);

  const importEbookSections = async () => {
    if (!ebookFile) return;
    setImporting(true);
    setEbookResult(null);
    setEbookProgress(0);

    try {
      const text = await ebookFile.text();
      const sections: any[] = JSON.parse(text);

      // Lookup chapter_ids
      const { data: chapters } = await supabase
        .from("ebook_chapters")
        .select("id, chapter_number");

      const chapterMap = new Map(
        (chapters || []).map((c) => [c.chapter_number, c.id])
      );

      let success = 0;
      let errors = 0;
      const messages: string[] = [];

      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const chapter_id = chapterMap.get(s.chapter_number) || null;

        const { error } = await supabase.from("ebook_sections").insert({
          chapter_id,
          chapter_number: s.chapter_number,
          section_title: s.section_title,
          subsection_title: s.subsection_title || null,
          content: s.content,
          content_type: s.content_type || "text",
          tags: s.tags || [],
          situation: s.situation || [],
          keywords: s.keywords || [],
          sort_order: s.sort_order ?? i,
          is_active: s.is_active ?? true,
        });

        if (error) {
          errors++;
          messages.push(`Erro seção "${s.section_title}": ${error.message}`);
        } else {
          success++;
        }

        setEbookProgress(Math.round(((i + 1) / sections.length) * 100));
      }

      setEbookResult({ success, errors, messages });
    } catch (e: any) {
      setEbookResult({ success: 0, errors: 1, messages: [e.message] });
    }
    setImporting(false);
  };

  const importSosProtocols = async () => {
    if (!sosFile) return;
    setImporting(true);
    setSosResult(null);
    setSosProgress(0);

    try {
      const text = await sosFile.text();
      const protocols: any[] = JSON.parse(text);

      let success = 0;
      let errors = 0;
      const messages: string[] = [];

      for (let i = 0; i < protocols.length; i++) {
        const p = protocols[i];

        const { error } = await supabase.from("sos_protocols").insert({
          situation: p.situation,
          title: p.title,
          description: p.description || null,
          icon: p.icon || null,
          exercise_sequence: p.exercise_sequence || [],
          total_time_minutes: p.total_time_minutes || null,
          sort_order: p.sort_order ?? i,
          is_active: p.is_active ?? true,
        });

        if (error) {
          errors++;
          messages.push(`Erro protocolo "${p.title}": ${error.message}`);
        } else {
          success++;
        }

        setSosProgress(Math.round(((i + 1) / protocols.length) * 100));
      }

      setSosResult({ success, errors, messages });
    } catch (e: any) {
      setSosResult({ success: 0, errors: 1, messages: [e.message] });
    }
    setImporting(false);
  };

  const ResultCard = ({ result }: { result: ImportResult }) => (
    <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-white/10 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle size={16} className="text-green-400" />
        <span>{result.success} importados com sucesso</span>
      </div>
      {result.errors > 0 && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle size={16} />
          <span>{result.errors} erros</span>
        </div>
      )}
      {result.messages.length > 0 && (
        <div className="text-xs text-muted-foreground max-h-32 overflow-auto space-y-1">
          {result.messages.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Importar Guia</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Importe seções do ebook e protocolos SOS via arquivos JSON.
          </p>
        </div>

        {/* Ebook Sections */}
        <section className="p-6 rounded-xl border border-white/10 bg-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">📖 Seções do Ebook</h2>
          <p className="text-sm text-muted-foreground">
            JSON array com campos: chapter_number, section_title, content, content_type, tags, situation, keywords
          </p>
          <input
            ref={ebookRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => ebookRef.current?.click()}
            >
              <Upload size={16} className="mr-2" />
              {ebookFile ? ebookFile.name : "Selecionar JSON"}
            </Button>
            <Button
              size="sm"
              disabled={!ebookFile || importing}
              onClick={importEbookSections}
            >
              Importar Seções
            </Button>
          </div>
          {ebookProgress > 0 && ebookProgress < 100 && (
            <Progress value={ebookProgress} className="h-2" />
          )}
          {ebookResult && <ResultCard result={ebookResult} />}
        </section>

        {/* SOS Protocols */}
        <section className="p-6 rounded-xl border border-white/10 bg-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">🆘 Protocolos SOS</h2>
          <p className="text-sm text-muted-foreground">
            JSON array com campos: situation, title, description, icon, exercise_sequence, total_time_minutes
          </p>
          <input
            ref={sosRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => setSosFile(e.target.files?.[0] || null)}
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sosRef.current?.click()}
            >
              <Upload size={16} className="mr-2" />
              {sosFile ? sosFile.name : "Selecionar JSON"}
            </Button>
            <Button
              size="sm"
              disabled={!sosFile || importing}
              onClick={importSosProtocols}
            >
              Importar Protocolos
            </Button>
          </div>
          {sosProgress > 0 && sosProgress < 100 && (
            <Progress value={sosProgress} className="h-2" />
          )}
          {sosResult && <ResultCard result={sosResult} />}
        </section>
      </div>
    </AdminLayout>
  );
};

export default ImportGuia;
