"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/client";
import { Success } from "./fields";

/** An explicit click (not an auto-run link) so email scanners that open links cannot confirm for the member. */
export function ConfirmButton({ token, endpoint, label, doneText }: { token: string; endpoint: string; label: string; doneText: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  if (!token) return <p className="panel p-8">This link is not valid. Please use the link from your email.</p>;
  if (state === "done") return <Success title="Done" text={doneText} again="Back" onReset={() => router.push("/")} />;
  return (
    <div className="panel grid gap-4 p-8">
      {error && <p role="alert" className="field-error">{error}</p>}
      <button className="btn w-fit" disabled={state === "sending"} onClick={async () => {
        setState("sending"); setError(null);
        const err = await postJson(endpoint, { token }).catch(() => "Could not reach the server. Please try again.");
        if (err) { setError(err); setState("idle"); } else setState("done");
      }}>{state === "sending" ? "Confirming…" : label}</button>
    </div>
  );
}
