const MIGRATION_MAP: Record<string, string> = {
  lipevida_onboarding: "levvia_onboarding",
  lipevida_onboarded: "levvia_onboarded",
  lipevida_checklist: "levvia_checklist",
  lipevida_challenge_start: "levvia_challenge_start",
  lipevida_challenge_progress: "levvia_challenge_progress",
  lipevida_welcome_dismissed: "levvia_welcome_dismissed",
  lipevida_meal_plan: "levvia_meal_plan",
};

export function migrateLegacyStorage(): void {
  if (localStorage.getItem("levvia_migrated") === "true") return;

  for (const [oldKey, newKey] of Object.entries(MIGRATION_MAP)) {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, oldValue);
    }
    if (oldValue !== null) {
      localStorage.removeItem(oldKey);
    }
  }

  localStorage.setItem("levvia_migrated", "true");
}
