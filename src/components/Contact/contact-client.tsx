"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { getClientSideURL } from "@/utilities/getURL";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Form, Social } from "@/payload-types";
import type { Locale } from "@/i18n/config";

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-black uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

const inputClass = "h-auto p-3 text-base font-semibold";

export default function ContactClient({
  form,
  messages,
  t,
  locale,
}: {
  form: Form;
  // contenuto toast dal CMS (Social.toast, localizzato) — sempre presente
  messages: Social["toast"];
  t: {
    send: string;
    sending: string;
    consentBefore: string;
    consentLink: string;
    consentAfter: string;
  };
  locale: Locale;
}) {
  const [pending, setPending] = useState(false);
  // consenso privacy: gate all'invio (obbligatorio, solo frontend)
  const [agreed, setAgreed] = useState(false);

  // best practice form-builder: POST /api/form-submissions con { form, submissionData }
  const submit = async (formEl: HTMLFormElement) => {
    const data = new FormData(formEl);
    const submissionData = (form.fields ?? []).flatMap((f) =>
      "name" in f ? [{ field: f.name, value: String(data.get(f.name) ?? "") }] : []
    );

    setPending(true);
    try {
      const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: form.id, submissionData }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      formEl.reset();
      setAgreed(false);
      toast.success(messages.successTitle, { description: messages.successMessage });
    } catch {
      toast.error(messages.errorTitle, { description: messages.errorMessage });
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      className="flex flex-col gap-4 rounded-base border-4 border-black bg-white p-[22px] shadow-brutal"
    >
      {form.fields?.map((f) => {
        if (!("name" in f)) return null;
        const id = `cf-${f.name}`;
        const label = f.label ?? "";

        if (f.blockType === "textarea") {
          return (
            <Field key={f.id} id={id} label={label}>
              <Textarea
                id={id}
                name={f.name}
                rows={5}
                required
                maxLength={2000}
                className={inputClass}
                suppressHydrationWarning
              />
            </Field>
          );
        }
        if (f.blockType === "text" || f.blockType === "email" || f.blockType === "number") {
          return (
            <Field key={f.id} id={id} label={label}>
              <Input
                id={id}
                name={f.name}
                type={f.blockType}
                required
                maxLength={200}
                className={inputClass}
                suppressHydrationWarning
              />
            </Field>
          );
        }
        return null;
      })}

      {/* consenso privacy: obbligatorio, gate all'invio */}
      <label className="flex cursor-pointer items-start gap-2.5 text-[13px] font-medium leading-[1.45]">
        <span className="relative mt-px flex-none">
          <input
            type="checkbox"
            name="privacy-consent"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            aria-describedby="cf-consent-text"
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-[3px] border-2 border-black bg-white checked:bg-main focus-visible:focus-brutal"
            suppressHydrationWarning
          />
          {/* spunta SVG: tratto spesso a cap quadrati (coerente col design), niente glifo testuale */}
          <svg
            aria-hidden
            viewBox="0 0 12 12"
            className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 peer-checked:block"
          >
            <path
              d="M1.5 6.5 4.5 9.5 10.5 2"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="square"
            />
          </svg>
        </span>
        <span id="cf-consent-text">
          {t.consentBefore}{" "}
          <a
            href={`/${locale}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-main focus-visible:focus-brutal"
          >
            {t.consentLink}
          </a>{" "}
          {t.consentAfter}
        </span>
      </label>

      <Button
        type="submit"
        disabled={pending || !agreed}
        className="h-auto px-5.5 py-3.5 text-[15px] font-black uppercase tracking-wide"
      >
        {pending ? t.sending : t.send}
      </Button>
    </form>
  );
}
