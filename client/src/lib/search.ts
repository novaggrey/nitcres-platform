export function matchesSyntheticSearch(query: string, values: unknown[]): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return false;

  return values.some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery));
}
