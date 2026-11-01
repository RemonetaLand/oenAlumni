"use client";
import { FormEvent, useState } from "react";
import { Check } from "lucide-react";

export type Errors = Record<string, boolean>;

/** Client-side validation: marks every empty required field so it can be highlighted red. */
export function useRequiredForm(onValid?: () => void) {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const next: Errors = {};
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (!el.name || !el.required) continue;
      const bad = el.type === "checkbox" ? !el.checked : !el.value.trim() || !el.checkValidity();
      if (bad) next[el.name] = true;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) { onValid?.(); setDone(true); }
  }
  return { errors, done, setDone, submit, reset: () => { setErrors({}); setDone(false); } };
}

export function Field({ label, name, type = "text", required = false, errors = {} }: {
  label: string; name: string; type?: string; required?: boolean; errors?: Errors;
}) {
  const bad = errors[name];
  return (
    <div className="field" data-invalid={bad || undefined}>
      <label htmlFor={name}>{label}{required && <span className="ml-1 text-gold">*</span>}</label>
      <input id={name} name={name} type={type} required={required} aria-invalid={bad || undefined} />
      {bad && <p className="field-error">Please complete this field{type === "email" ? " with a valid email" : ""}.</p>}
    </div>
  );
}

export function LimitedText({ label, name }: { label: string; name: string }) {
  const [n, setN] = useState(0);
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} maxLength={500} onChange={(e) => setN(e.target.value.length)} />
      <p className="text-right text-xs text-muted">{n} / 500</p>
    </div>
  );
}

export function Check_({ name, label, required = false, errors = {} }: { name: string; label: string; required?: boolean; errors?: Errors }) {
  return (
    <label className="check" data-invalid={errors[name] || undefined}>
      <input type="checkbox" name={name} required={required} />
      <span>{label}{required && <strong className="ml-1 text-gold">*</strong>}</span>
    </label>
  );
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
