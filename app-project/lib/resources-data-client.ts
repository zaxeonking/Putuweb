/**
 * Client-safe helpers for the Learning Materials & Resources module.
 * Mirrors the date math in lib/resources-data.ts but has no "server-only"
 * import so it can be used from client components.
 */
export function getAssignmentDaysUntilDue(dateIso: string, referenceDate = new Date()): number {
  const due = new Date(`${dateIso}T23:59:59`);
  const ref = new Date(referenceDate.toDateString());
  return Math.ceil((due.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}
