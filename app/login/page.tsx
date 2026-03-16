import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div className="card" style={{ maxWidth: "360px", padding: "1.5rem" }}>…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
