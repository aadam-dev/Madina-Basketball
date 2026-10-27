/** Ghana numbers: 024 000 0000 or +233 24 000 0000. Stored as +233… */
export function normalizeGhanaPhone(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  if (!compact) return null;

  let local = compact;
  if (local.startsWith("+233")) local = local.slice(4);
  else if (local.startsWith("233") && local.length === 12) local = local.slice(3);
  else if (local.startsWith("0")) local = local.slice(1);

  if (!/^[235]\d{8}$/.test(local)) return null;
  return `+233${local}`;
}

export function formatGhanaPhone(stored: string): string {
  if (!stored.startsWith("+233") || stored.length !== 13) return stored;
  const local = stored.slice(4);
  return `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export function ageFromDob(isoDate: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const dob = new Date(Date.UTC(year, month - 1, day));
  if (
    dob.getUTCFullYear() !== year ||
    dob.getUTCMonth() !== month - 1 ||
    dob.getUTCDate() !== day
  ) {
    return null;
  }
  let age = today.getUTCFullYear() - year;
  const monthDelta = today.getUTCMonth() + 1 - month;
  if (monthDelta < 0 || (monthDelta === 0 && today.getUTCDate() < day)) age -= 1;
  return age;
}

export function todayIso(today = new Date()): string {
  return today.toISOString().slice(0, 10);
}

export function isWithinNextDay(isoDate: string, today = new Date()): boolean {
  const start = new Date(`${todayIso(today)}T00:00:00Z`);
  const target = new Date(`${isoDate}T00:00:00Z`);
  const diff = target.getTime() - start.getTime();
  return diff >= 0 && diff < 48 * 60 * 60 * 1000;
}
