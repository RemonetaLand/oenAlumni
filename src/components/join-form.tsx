"use client";
import { Check_, Field, LimitedText, Success, useRequiredForm } from "./fields";

export const optionalConsents = [
  "I agree to receive event invitations, informational, educational knowledge and similar.",
  "I agree my details can be shared with Oxford University’s alumni office.",
  "I agree to share my data with vetted and curated third parties.",
  "I agree to be added to alumni communication groups, for example the WhatsApp alumni groups (for which I will first be informed about and be able to opt out of).",
  "I am open to act as a volunteer, support and/or sponsor the network.",
];
const requiredConsents = [
  "I agree that my details will be saved, used and processed by the Oxford Entrepreneurs Alumni Network and/or its operational partners and made available, in aggregate/hiding your specific details, for confidential statistical/research purposes.",
  "I agree to receive necessary emails about operational and important alumni matters and the alumni newsletter.",
];

export function JoinForm() {
  const { errors, done, submit, reset } = useRequiredForm();
  if (done)
    return <Success title="Thank you for joining" again="Submit another" onReset={reset}
      text="Demo only: nothing was saved and no email was sent. In the live version you will receive an email to confirm your address." />;
  return (
    <form onSubmit={submit} noValidate className="panel grid gap-8 p-6 sm:p-9">
      <div>
        <h2 className="h2">To join, please fill in the form below</h2>
        <p className="mt-2 text-sm text-muted">Note: you will receive an email to confirm, so your email address must be entered accurately. Fields marked * are required.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" name="firstName" required errors={errors} />
        <Field label="Surname" name="surname" required errors={errors} />
        <Field label="Telephone" name="telephone" type="tel" required errors={errors} />
        <Field label="Email" name="email" type="email" required errors={errors} />
        <div className="sm:col-span-2"><Field label="Address, City, Postcode, Country" name="address" errors={errors} /></div>
        <Field label="College" name="college" required errors={errors} />
        <Field label="Year of matriculation (joining)" name="year" required errors={errors} />
        <Field label="Alumni number (optional)" name="alumniNumber" errors={errors} />
      </div>
      <LimitedText label="Any other details you would like to add (optional)" name="details" />
      <fieldset className="grid gap-3">
        <legend className="legend mb-3">I would like to be involved in the alumni network as follows:</legend>
        {requiredConsents.map((l, i) => <Check_ key={i} name={`consent-${i}`} label={l} required errors={errors} />)}
        {optionalConsents.map((l, i) => <Check_ key={i} name={`opt-${i}`} label={l} />)}
      </fieldset>
      <button className="btn w-fit" type="submit">Submit</button>
    </form>
  );
}

export function StatusForm() {
  const { errors, done, submit, reset } = useRequiredForm();
  if (done)
    return <Success title="Request received" again="Make another change" onReset={reset}
      text="Demo only. In the live version, if the email matches our records we send the updated details; otherwise nothing changes and no error is shown." />;
  return (
    <form onSubmit={submit} noValidate className="panel grid gap-6 p-6 sm:p-9">
      <div>
        <h2 className="h2">Change my status</h2>
        <p className="mt-2 text-sm text-muted">Enter your email and select the new information you would like to opt in to or opt out of.</p>
      </div>
      <Field label="Email" name="email" type="email" required errors={errors} />
      <fieldset className="grid gap-3">
        {optionalConsents.map((l, i) => <Check_ key={i} name={`s-${i}`} label={l} />)}
      </fieldset>
      <button className="btn w-fit" type="submit">Submit</button>
    </form>
  );
}
