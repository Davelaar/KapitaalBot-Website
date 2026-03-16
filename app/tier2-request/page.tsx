import Link from "next/link";
import { Tier2RequestForm } from "@/components/Tier2RequestForm";

export default function Tier2RequestPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← System
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Access
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.75rem", maxWidth: "50ch" }}>
        Voor private inquiry of research dialogue: uitgebreidere observability (execution, latency, strategy activity).
        Toegang wordt handmatig toegekend.
      </p>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.8125rem", maxWidth: "50ch" }}>
        Geen performance claims worden gemaakt. Dit formulier is zelfselecterend.
      </p>
      <Tier2RequestForm />
    </main>
  );
}
