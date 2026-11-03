"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form className="panel grid gap-5 p-6" onSubmit={async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      setBusy(true); setError(null);
      const err = await postJson("/api/admin/login", { email: String(fd.get("email") ?? "").trim(), password: String(fd.get("password") ?? "") }).catch(() => "Could not reach the server.");
      setBusy(false);
      if (err) setError(err); else { router.replace("/admin-panel"); router.refresh(); }
    }}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="username" required /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {error && <p role="alert" className="field-error">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
