// Shared so the roster and the create action label a family identically.
export function familyLabel(guestNames: string[], familyId: number): string {
  if (guestNames.length === 0) return `Empty family · #${familyId}`;
  return guestNames.join(", ");
}
