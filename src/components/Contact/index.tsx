import config from "@payload-config";
import { getPayload } from "payload";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/SectionHeading";

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

export default async function Contact() {
  const payload = await getPayload({ config });
  const social = await payload.findGlobal({ slug: "social", depth: 1 });
  const form = typeof social.contactForm === "object" ? social.contactForm : null;

  return (
    <div>
      <SectionHeading num="04" title="Contact" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-start gap-6">
        {/* form — SEAM logica: onSubmit -> POST form-submissions + toast */}
        <form className="flex flex-col gap-4 rounded-base border-4 border-black bg-white p-[22px] shadow-brutal">
          {form?.fields?.map((f) => {
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

        {/* elsewhere */}
        <div className="flex flex-col gap-3.5 rounded-base border-2 border-black bg-white p-[22px] shadow-brutal">
          <h3 className="text-lg font-black uppercase">Elsewhere</h3>
          {social.socialDescription && (
            <p className="text-sm font-medium leading-[1.55]">{social.socialDescription}</p>
          )}
          <div className="flex flex-col gap-2.5">
            {social.links?.map((s) => (
              <a
                key={s.id}
                href={s.link}
                className={cn(
                  BG[s.color],
                  "interactive-brutal flex items-center justify-between gap-2.5 rounded-base border-2 border-black px-3.5 py-2.5 text-[13px] font-extrabold uppercase tracking-wide shadow-brutal"
                )}
              >
                <span>{s.title}</span>
                <span>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
