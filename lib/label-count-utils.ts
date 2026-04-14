import type { LabelCount } from "@/lib/snapshots";

export function sortedLabelCounts(items: LabelCount[] | null | undefined): LabelCount[] {
  if (!items?.length) return [];
  return [...items].sort((a, b) => b.count - a.count);
}
