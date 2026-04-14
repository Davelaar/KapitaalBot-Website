/**
 * GitHub-style heading ids (aligned with engine doc TOCs and github-slugger).
 */
export function slugifyHeadingPlainText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
