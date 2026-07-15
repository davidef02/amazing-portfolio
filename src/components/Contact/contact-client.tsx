"use client";

import { type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Form } from "@/payload-types";

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

export default function ContactClient({ form }: { form: Form }) {
  // ===== SEAM: logica submit (la fai tu) =====
  // POST /api/form-submissions con { form: form.id, submissionData: [{ field, value }] }
  // + stati pending/error/success + toast. Ora fa solo preventDefault.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-base border-4 border-black bg-white p-[22px] shadow-brutal"
    >
      {form.fields?.map((f) => {
        if (!("name" in f)) return null;
        const id = `cf-${f.name}`;
        const label = f.label || f.name;

        if (f.blockType === "textarea") {
          return (
            <Field key={f.id} id={id} label={label}>
              <Textarea id={id} name={f.name} rows={5} required={!!f.required} className={inputClass} />
            </Field>
          );
        }
        if (f.blockType === "text" || f.blockType === "email" || f.blockType === "number") {
          return (
            <Field key={f.id} id={id} label={label}>
              <Input id={id} name={f.name} type={f.blockType} required={!!f.required} className={inputClass} />
            </Field>
          );
        }
        return null;
      })}

      <Button
        type="submit"
        className="h-auto px-[22px] py-3.5 text-[15px] font-black uppercase tracking-wide"
      >
        Send message →
      </Button>
    </form>
  );
}
