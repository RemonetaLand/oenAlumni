"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { partnerSchema } from "@/lib/validation";
import { Field, Honeypot, LimitedText, SubmitRow, Success, useApiSubmit } from "./fields";

export function PartnerForm() {
  const form = useForm<z.input<typeof partnerSchema>, unknown, z.output<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { firstName: "", surname: "", company: "", telephone: "", email: "", request: "", website: "" },
  });
  const { done, serverError, onValid, reset } = useApiSubmit<typeof partnerSchema>("/api/partner");
  if (done)
    return <Success title="Thank you for getting in touch" again="Send another enquiry" onReset={() => { form.reset(); reset(); }}
      text="Your details have been sent to the chairman and we will get back to you." />;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="panel grid gap-5 p-6 sm:p-9">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" name="firstName" required />
          <Field label="Surname" name="surname" required />
          <Field label="Company name (optional)" name="company" />
          <Field label="Telephone" name="telephone" type="tel" required />
          <div className="sm:col-span-2"><Field label="Email" name="email" type="email" required /></div>
        </div>
        <LimitedText label="Details of your request (optional)" name="request" />
        <Honeypot />
        <SubmitRow error={serverError} />
      </form>
    </FormProvider>
  );
}
