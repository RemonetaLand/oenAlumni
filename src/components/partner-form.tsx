"use client";
import { Field, LimitedText, Success, useRequiredForm } from "./fields";

export function PartnerForm() {
  const { errors, done, submit, reset } = useRequiredForm();
  if (done)
    return <Success title="Thank you for getting in touch" again="Send another enquiry" onReset={reset}
      text="Demo only: nothing was stored or emailed. In the live version your details are saved and sent to the chairman." />;
  return (
    <form onSubmit={submit} noValidate className="panel grid gap-5 p-6 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" name="firstName" required errors={errors} />
        <Field label="Surname" name="surname" required errors={errors} />
        <Field label="Company name (optional)" name="company" errors={errors} />
        <Field label="Telephone" name="telephone" type="tel" required errors={errors} />
        <div className="sm:col-span-2"><Field label="Email" name="email" type="email" required errors={errors} /></div>
      </div>
      <LimitedText label="Details of your request (optional)" name="request" />
      <button className="btn w-fit" type="submit">Submit</button>
    </form>
  );
}
