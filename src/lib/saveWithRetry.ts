import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveWithRetryOptions {
  table?: string;
  userId: string;
  data: Record<string, any>;
  retries?: number;
  onRetry?: () => void;
}

export async function saveWithRetry({
  table = "profiles",
  userId,
  data,
  retries = 3,
  onRetry,
}: SaveWithRetryOptions): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await (supabase
        .from(table as any)
        .update(data as any) as any)
        .eq("id", userId);

      if (!error) {
        console.log("✅ Progresso salvo com sucesso");
        return true;
      }

      console.warn(`⚠️ Tentativa ${i + 1}/${retries} falhou:`, error.message);
    } catch (err) {
      console.error(`❌ Erro na tentativa ${i + 1}:`, err);
    }

    if (i < retries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  toast.error("Não conseguimos salvar seu progresso. Tente novamente.", {
    duration: 5000,
    action: onRetry
      ? { label: "Tentar novamente", onClick: onRetry }
      : undefined,
  });

  return false;
}
