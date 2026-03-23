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

  console.log('📸 Snapshot — raw localStorage:', raw ? `EXISTE (${raw.length} chars)` : 'VAZIO');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      console.log('📸 Snapshot — keys:', Object.keys(parsed));
      console.log('📸 Snapshot — campos críticos:', {
        name: parsed[2] || 'AUSENTE',
        age: parsed[3] || 'AUSENTE',
        pantry: Array.isArray(parsed[15]) ? `${parsed[15].length} items` : 'AUSENTE',
        objectives: parsed[16] || 'AUSENTE',
        restrictions: parsed[13] || 'AUSENTE',
      });
    } catch { /* ignore */ }
  }
  console.log('📸 Snapshot — backups:', {
    pantry: pantryBackup ? `EXISTE (${pantryBackup.length} chars)` : 'VAZIO',
    objectives: objectivesBackup ? `EXISTE (${objectivesBackup.length} chars)` : 'VAZIO',
    restrictions: restrictionsBackup ? `EXISTE (${restrictionsBackup.length} chars)` : 'VAZIO',
  });

  let answers: Record<number, string | string[] | Record<string, string | number>> = {};
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

      // Heat map (id 9) is now a Record<string, number> from HeatMapInteractive
      const heatMapRaw = answers[9] as any;
      let heatMapDay1: Record<string, unknown> = {};
      let affectedAreas: string[] = [];

      const heatMapLabels: Record<string, string> = {
        panturrilha_esq: "Panturrilhas",
        panturrilha_dir: "Panturrilhas",
        coxa_esq: "Coxas",
        coxa_dir: "Coxas",
        quadril_esq: "Quadris",
        quadril_dir: "Quadris",
        abdomen: "Abdômen/Barriga",
        braco_esq: "Braços",
        braco_dir: "Braços",
      };

      if (heatMapRaw && typeof heatMapRaw === "object" && !Array.isArray(heatMapRaw)) {
        heatMapDay1 = heatMapRaw;
        const labelsSet = new Set<string>();
        for (const [key, val] of Object.entries(heatMapRaw)) {
          if (typeof val === "number" && val > 0 && heatMapLabels[key]) {
            labelsSet.add(heatMapLabels[key]);
          }
        }
        affectedAreas = Array.from(labelsSet);
      } else if (Array.isArray(heatMapRaw)) {
        // Legacy fallback: old text-based multi-select
        affectedAreas = heatMapRaw;
      }

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
        heat_map_day1: heatMapDay1,
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

    let syncSuccess = false;

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
      if (updated && updated.length > 0) {
        syncSuccess = true;
      }
    }

    // If no row was updated, insert as fallback
    if (!syncSuccess) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        email: opts?.email || "",
        ...profileData,
      });
      if (insertError) {
        console.error("💾 Sync — insert failed:", insertError.message);
      } else {
        console.log('💾 Sync — insert OK');
        syncSuccess = true;
      }
    }

    // Only clean up AFTER confirmed successful sync
    if (syncSuccess) {
      localStorage.setItem("levvia_onboarded", "true");
      console.log('🎯 Flag levvia_onboarded setada como true');
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
