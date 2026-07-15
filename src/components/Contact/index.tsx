import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { SectionHeading } from "@/components/SectionHeading";
import { externalLinkProps } from "@/utilities/link";
import ContactClient from "./contact-client";

export default async function Contact() {
  const payload = await getPayload({ config });
  const social = await payload.findGlobal({ slug: "social", depth: 1 });
  const form = typeof social.contactForm === "object" ? social.contactForm : null;

  return (
    <div>
      <SectionHeading num="04" title="Contact" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-start gap-6">
        {/* form: FE in contact-client, submit = seam (lo fai tu) */}
        {form && <ContactClient form={form} messages={social.toast} />}

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
                {...externalLinkProps(s.link)}
                className={cn(
                  BG[s.color],
                  "interactive-brutal flex items-center justify-between gap-2.5 rounded-base border-2 border-black px-3.5 py-2.5 text-[13px] font-extrabold uppercase tracking-wide"
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
