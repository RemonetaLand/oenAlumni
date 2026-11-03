import type { Metadata } from "next";
import { JoinForm, StatusForm } from "@/components/join-form";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Join Us" };

export default function JoinPage() {
  return (
    <>
      <PageIntro kicker="Membership" title="Join Us" text="Become part of a global community of Oxford alumni who share an interest in enterprise and leadership." />
      <section className="shell grid gap-8 pb-8">
        <JoinForm />
        <StatusForm />
      </section>
    </>
  );
}
