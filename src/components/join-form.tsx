"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { joinSchema, optionalConsentKeys, statusSchema } from "@/lib/validation";
import { Check_, Field, Honeypot, LimitedText, SubmitRow, Success, useApiSubmit } from "./fields";

export const optionalConsents = [
  "I agree to receive event invitations, informational, educational knowledge and similar.",
  "I agree my details can be shared with Oxford University’s alumni office.",
  "I agree to share my data with vetted and curated third parties.",
  "I agree to be added to alumni communication groups, for example the WhatsApp alumni groups (for which I will first be informed about and be able to opt out of).",
  "I am open to act as a volunteer, support and/or sponsor the network.",
];
const requiredConsents = [
  { name: "consentData", label: "I agree that my details will be saved, used and processed by the Oxford Entrepreneurs Alumni Network and/or its operational partners and made available, in aggregate/hiding your specific details, for confidential statistical/research purposes." },
  { name: "consentEmails", label: "I agree to receive necessary emails about operational and important alumni matters and the alumni newsletter." },
];

const noConsents = { events: false, shareOxford: false, shareThirdParties: false, commGroups: false, volunteer: false };

export function JoinForm() {
  const form = useForm<z.input<typeof joinSchema>, unknown, z.output<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      firstName: "", surname: "", telephone: "", email: "", address: "", college: "", year: "", alumniNumber: "", details: "",
      consentData: false as unknown as true, consentEmails: false as unknown as true, optional: noConsents, website: "",
    },
  });
  const { done, serverError, onValid, reset } = useApiSubmit<typeof joinSchema>("/api/join");
  if (done)
    return <Success title="Thank you for joining" again="Submit another" onReset={() => { form.reset(); reset(); }}
      text="We have sent you an email. Click the link in it to confirm your address and complete your membership. Check your spam folder if it does not arrive." />;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="panel grid gap-8 p-6 sm:p-9">
        <div>
          <h2 className="h2">To join, please fill in the form below</h2>
          <p className="mt-2 text-sm text-muted">Note: you will receive an email to confirm, so your email address must be entered accurately. Fields marked * are required.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" name="firstName" required />
          <Field label="Surname" name="surname" required />
          <Field label="Telephone" name="telephone" type="tel" required />
          <Field label="Email" name="email" type="email" required />
          <div className="sm:col-span-2"><Field label="Address, City, Postcode, Country" name="address" /></div>
          <Field label="College" name="college" required />
          <Field label="Year of matriculation (joining)" name="year" required />
          <Field label="Alumni number (optional)" name="alumniNumber" />
        </div>
        <LimitedText label="Any other details you would like to add (optional)" name="details" />
        <fieldset className="grid gap-3">
          <legend className="legend mb-3">I would like to be involved in the alumni network as follows:</legend>
          {requiredConsents.map((c) => <Check_ key={c.name} name={c.name} label={c.label} required />)}
          {optionalConsents.map((l, i) => <Check_ key={i} name={`optional.${optionalConsentKeys[i]}`} label={l} />)}
        </fieldset>
        <Honeypot />
        <SubmitRow error={serverError} />
      </form>
    </FormProvider>
  );
}

export function StatusForm() {
  const form = useForm<z.input<typeof statusSchema>, unknown, z.output<typeof statusSchema>>({
    resolver: zodResolver(statusSchema),
    defaultValues: { email: "", optional: noConsents, website: "" },
  });
  const { done, serverError, onValid, reset } = useApiSubmit<typeof statusSchema>("/api/status-request");
  if (done)
    return <Success title="Request received" again="Make another change" onReset={() => { form.reset(); reset(); }}
      text="If that email address is registered with us, we have sent a message with the new details and a link to confirm the change. Otherwise nothing changes." />;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="panel grid gap-6 p-6 sm:p-9">
        <div>
          <h2 className="h2">Change my status</h2>
          <p className="mt-2 text-sm text-muted">Enter your email and select the new information you would like to opt in to or opt out of.</p>
        </div>
        <Field label="Email" name="email" type="email" required />
        <fieldset className="grid gap-3">
          {optionalConsents.map((l, i) => <Check_ key={i} name={`optional.${optionalConsentKeys[i]}`} label={l} />)}
        </fieldset>
        <Honeypot />
        <SubmitRow error={serverError} />
      </form>
    </FormProvider>
  );
}
