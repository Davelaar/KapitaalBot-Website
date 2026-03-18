import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import { getCmsData, getProductionNotes } from "@/lib/read-cms";
import CmsAdminEditor from "@/components/CmsAdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const tier = await getSessionTier();
  if (tier < 3) return <TierGate kind="tier3" />;

  const cms = getCmsData();
  const notices = cms?.notices ?? [];
  const compliance_override = cms?.compliance_override ?? null;
  const production_notes = getProductionNotes();

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Admin
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Admin — CMS-light</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Bewerk homepage-notices, compliance-override en production notes (Git-managed). Opslaan doet commit/push.
      </p>
      <CmsAdminEditor
        initialNotices={notices}
        initialComplianceOverride={compliance_override}
        initialProductionNotes={production_notes}
      />
    </main>
  );
}

