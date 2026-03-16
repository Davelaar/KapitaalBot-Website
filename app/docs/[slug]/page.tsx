import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocViewer from "@/components/DocViewer";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

const DOC_META: Record<string, { label: string }> = {
  ENGINE_SSOT: { label: "Engine SSOT" },
  DOC_INDEX: { label: "Document index" },
};

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const label = DOC_META[slug]?.label ?? slug;
  return {
    title: `${label} — Documentatie`,
    description: `Documentatie: ${label}. KapitaalBot-engine.`,
  };
}

export default async function DocSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = getDocSlugs();
  if (!slugs.includes(slug)) notFound();

  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/docs" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Documentatie
        </Link>
      </nav>
      <DocViewer content={content} />
    </main>
  );
}
