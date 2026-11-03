import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PartnerForm } from "@/components/partner-form";

export const metadata: Metadata = { title: "Partners & Sponsors" };

export default function PartnersPage() {
  return (
    <>
      <PageIntro kicker="Partners & Sponsors" title="Partner with us"
        text="If you are interested to partner with and/or sponsor the network, please enter your details below and we will get back to you." />
      <section className="shell max-w-3xl pb-8 lg:mx-auto" style={{ maxWidth: 820 }}>
        <PartnerForm />
      </section>
    </>
  );
}
