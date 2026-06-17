import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
