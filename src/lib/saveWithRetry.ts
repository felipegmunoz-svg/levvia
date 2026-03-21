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
  console.log(`💾 saveWithRetry — table: ${table}, userId: ${userId}, payload:`, JSON.stringify(data));

  for (let i = 0; i < retries; i++) {
    try {
      const { data: returned, error } = await (supabase
        .from(table as any)
        .update(data as any) as any)
        .eq("id", userId)
        .select()
        .maybeSingle();

      if (!error && returned) {
        console.log("✅ Dados salvos e verificados:", JSON.stringify(returned));
        return true;
      }

      if (!error && !returned) {
        console.warn(`⚠️ Tentativa ${i + 1}/${retries}: update sem erro mas 0 rows afetadas`);
      } else if (error) {
        console.warn(`⚠️ Tentativa ${i + 1}/${retries} falhou:`, error.message);
      }
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
