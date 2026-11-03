import type { Metadata } from "next";
import { ConfirmButton } from "@/components/confirm-button";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Confirm", robots: { index: false } };

export default async function ConfirmPage({ searchParams }: PageProps<"/confirm">) {
  const q = await searchParams;
  const token = typeof q.token === "string" ? q.token : "";
  const status = q.type === "status";
  return (
    <>
      <PageIntro kicker={status ? "Change my status" : "Membership"} title={status ? "Confirm your change" : "Confirm your email"} />
      <section className="shell pb-8">
        <ConfirmButton token={token} endpoint={status ? "/api/status-confirm" : "/api/confirm"}
          label={status ? "Confirm the change" : "Confirm my email"}
          doneText={status ? "Your preferences have been updated. We have emailed you a receipt." : "Your email is confirmed and your membership is complete. Welcome to the network."} />
      </section>
    </>
  );
}
