const STORAGE_KEY = "viewed-materials";
const MAX_HISTORY = 10;

export function getViewedMaterialIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markMaterialViewed(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getViewedMaterialIds().filter((existing) => existing !== id);
    const next = [id, ...current].slice(0, MAX_HISTORY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("viewed-materials-changed"));
  } catch {
    // localStorage unavailable — recommendations simply won't personalize this session
  }
}
