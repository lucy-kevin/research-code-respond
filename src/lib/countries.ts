import type { Fellow } from "@/data/fellows";

/** Country roll-up derived from a fellows list. */
export function countriesOf(fellows: Fellow[]) {
  const counts = new Map<string, { name: string; code: string; fellows: number }>();
  for (const f of fellows) {
    if (!f.code) continue;
    const entry = counts.get(f.code) ?? { name: f.country, code: f.code, fellows: 0 };
    entry.fellows += 1;
    counts.set(f.code, entry);
  }
  return [...counts.values()].sort((a, b) => b.fellows - a.fellows);
}
