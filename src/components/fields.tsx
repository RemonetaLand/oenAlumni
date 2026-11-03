"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { get, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { postJson } from "@/lib/client";

/** Error object for a field name such as "email" or "optional.events". */
function useFieldError(name: string) {
  const { formState } = useFormContext();
  return get(formState.errors, name) as { message?: string } | undefined;
}

export function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  const { register } = useFormContext();
  const bad = useFieldError(name);
  return (
    <div className="field" data-invalid={bad ? true : undefined}>
      <label htmlFor={name}>{label}{required && <span className="ml-1 text-gold">*</span>}</label>
      <input id={name} type={type} aria-invalid={bad ? true : undefined} {...register(name)} />
      {bad && <p className="field-error">Please complete this field{type === "email" ? " with a valid email" : ""}.</p>}
    </div>
  );
}

export function LimitedText({ label, name }: { label: string; name: string }) {
  const { register, watch } = useFormContext();
  const length = String(watch(name) ?? "").length;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} maxLength={500} {...register(name)} />
      <p className="text-right text-xs text-muted">{length} / 500</p>
    </div>
  );
}

export function Check_({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  const { register } = useFormContext();
  const bad = useFieldError(name);
  return (
    <label className="check" data-invalid={bad ? true : undefined}>
      <input type="checkbox" {...register(name)} />
      <span>{label}{required && <strong className="ml-1 text-gold">*</strong>}</span>
    </label>
  );
}

/** Hidden field real visitors never fill in; bots usually do. */
export function Honeypot() {
  const { register } = useFormContext();
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
    </div>
  );
}

export function SubmitRow({ error }: { error: string | null }) {
  const { formState } = useFormContext();
  return (
    <div className="grid gap-3">
      {error && <p role="alert" className="field-error">{error}</p>}
      <button className="btn w-fit" type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Sending…" : "Submit"}</button>
    </div>
  );
}

/**
 * Shared submit flow: the same zod schema the server uses validates in the browser (errors highlight red,
 * first one is focused), then the values are posted to the API.
 */
export function useApiSubmit<S extends z.ZodType>(endpoint: string) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const onValid = async (values: z.output<S>) => {
    setServerError(null);
    const error = await postJson(endpoint, values).catch(() => "Could not reach the server. Please try again.");
    if (error) setServerError(error); else setDone(true);
  };
  return { done, serverError, onValid, reset: () => { setServerError(null); setDone(false); } };
}

export function Success({ title, text, onReset, again }: { title: string; text: string; onReset: () => void; again: string }) {
  return (
    <div role="status" className="panel p-8">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2d6a48] text-white"><Check /></span>
      <h2 className="h2 mt-5">{title}</h2>
      <p className="mt-3 max-w-lg text-muted">{text}</p>
      <button className="btn btn-ghost mt-6" onClick={onReset}>{again}</button>
    </div>
  );
}
