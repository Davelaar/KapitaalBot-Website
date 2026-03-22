import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { parseLocaleParam } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  return buildPageMetadata({
    locale,
    title: `${t(locale, "login.title")} — KapitaalBot`,
    description: t(locale, "login.intro"),
    path: "/login",
  });
}

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div className="card" style={{ maxWidth: "360px", padding: "1.5rem" }}>…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
