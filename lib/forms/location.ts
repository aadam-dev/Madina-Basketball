/** Prefer the free-text place people typed over the coarse area bucket. */
export function displayArea(area: string | null | undefined, areaOther: string | null | undefined): string {
  const detail = areaOther?.trim();
  if (detail) return detail;
  return area?.trim() || "—";
}
