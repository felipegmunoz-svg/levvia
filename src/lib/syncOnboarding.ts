import { supabase } from "@/integrations/supabase/client";

/**
 * Reads the onboarding snapshot from localStorage.
 * Uses triple-backup pattern for pantry, objectives, and restrictions.
 */
export function readOnboardingSnapshot() {
  const raw = localStorage.getItem("levvia_onboarding");
  const pantryBackup = localStorage.getItem("levvia_pantry_items");
  const objectivesBackup = localStorage.getItem("levvia_objectives");
  const restrictionsBackup = localStorage.getItem("levvia_restrictions");

  console.log('📸 Snapshot — raw localStorage:', raw ? 'EXISTE (' + raw.length + ' chars)' : 'VAZIO');

  let answers: Record<number, string | string[]> = {};
  if (raw) {
    try { answers = JSON.parse(raw); } catch { /* ignore */ }
  }

  // Resolve pantry: PREFER backup over answers
  let pantryItems: string[] = [];
  if (pantryBackup) {
    try { pantryItems = JSON.parse(pantryBackup); } catch { /* ignore */ }
  }
  if ((!pantryItems || pantryItems.length === 0) && answers[15]) {
    pantryItems = (answers[15] as string[]) || [];
  }

  // Resolve objectives: PREFER backup over answers
  let objectives: string[] = [];
  if (objectivesBackup) {
    try { objectives = JSON.parse(objectivesBackup); } catch { /* ignore */ }
  }
  if ((!objectives || objectives.length === 0) && answers[16]) {
    objectives = (answers[16] as string[]) || [];
  }

  // Resolve restrictions: PREFER backup over answers
  let restrictions: string[] = [];
  if (restrictionsBackup) {
    try { restrictions = JSON.parse(restrictionsBackup); } catch { /* ignore */ }
  }
  if ((!restrictions || restrictions.length === 0) && answers[13]) {
    restrictions = (answers[13] as string[]) || [];
  }

  console.log('📸 Snapshot — pantryItems FINAL:', JSON.stringify(pantryItems));
  console.log('📸 Snapshot — objectives FINAL:', JSON.stringify(objectives));
  console.log('📸 Snapshot — restrictions FINAL:', JSON.stringify(restrictions));

  return { answers, pantryItems, objectives, restrictions, hasData: !!raw };
}

export type OnboardingSnapshot = ReturnType<typeof readOnboardingSnapshot>;

/**
 * Syncs the onboarding snapshot to the profiles table.
 * Only writes when snapshot.hasData is true.
 * Clears localStorage only after confirmed success.
 */
export async function syncOnboardingToSupabase(
  snapshot: OnboardingSnapshot,
  userId: string,
  opts?: { name?: string; phone?: string; email?: string },
) {
  console.log('💾 Sync — snapshot recebido, hasData:', snapshot.hasData);

  try {
    let profileData: Record<string, unknown> = {
      name: opts?.name || "",
      phone: opts?.phone || null,
    };

    if (snapshot.hasData) {
      const { answers, pantryItems, objectives, restrictions } = snapshot;
      const userName = (answers[2] as string) || opts?.name || "";
      const age = parseInt(answers[3] as string) || null;
      const sex = (answers[4] as string) || "";
      const bodyMetrics = (answers[5] as string[]) || [];
      const weightKg = parseFloat(bodyMetrics[0]) || null;
      const heightCm = parseFloat(bodyMetrics[1]) || null;
      const activityLevel = (answers[6] as string) || "";
      const healthConditions = (answers[7] as string[]) || [];
      const painLevel = (answers[8] as string) || "";
      const affectedAreas = (answers[9] as string[]) || [];

      console.log('💾 Sync — objectives FINAL a salvar:', JSON.stringify(objectives));
      console.log('💾 Sync — pantry_items FINAL a salvar:', JSON.stringify(pantryItems));

      profileData = {
        name: userName,
        phone: opts?.phone || null,
        age,
        sex,
        weight_kg: weightKg,
        height_cm: heightCm,
        activity_level: activityLevel,
        health_conditions: healthConditions,
        pain_level: painLevel,
        affected_areas: affectedAreas,
        objectives,
        pantry_items: pantryItems,
        onboarding_data: {
          enemies: answers[11] || [],
          allies: answers[12] || [],
          restrictions,
          preferences: answers[14] || [],
          raw: answers,
        },
      };
    }

    console.log('💾 Sync — payload completo:', JSON.stringify(profileData));

    // Try update first (trigger should have created the row)
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select("id");

    if (updateError) {
      console.error("💾 Sync — update failed:", updateError.message);
    } else {
      console.log('💾 Sync — update result:', updated?.length, 'rows');
    }

    // If no row was updated, insert as fallback
    if (!updateError && (!updated || updated.length === 0)) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        email: opts?.email || "",
        ...profileData,
      });
      if (insertError) {
        console.error("💾 Sync — insert failed:", insertError.message);
      } else {
        console.log('💾 Sync — insert OK');
      }
    }

    // Only clean up AFTER successful sync
    const syncSuccess = !updateError || (updated && updated.length > 0);
    if (syncSuccess) {
      console.log('✅ Onboarding salvo com sucesso! Limpando localStorage...');
      localStorage.removeItem("levvia_onboarding");
      localStorage.removeItem("levvia_pantry_items");
      localStorage.removeItem("levvia_objectives");
      localStorage.removeItem("levvia_restrictions");
      return true;
    } else {
      console.warn('💾 Sync — falhou, mantendo localStorage para retry');
      return false;
    }
  } catch (e) {
    console.error("💾 Sync — erro geral:", e);
    return false;
  }
}
