import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { SectionHeading } from "@/components/SectionHeading";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Experience({ locale }: { locale: Locale }) {
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({ slug: "header", locale });
  const sectionTitle = header.navItems?.find(i => i.link === "#experiences")?.title || "Experiences";
  const t = getDictionary(locale);
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });
  const { docs: experiences } = await payload.find({
    collection: "experiences",
    limit: 100,
    sort: "_order",
    locale,
  });

  return (
    <div>
      <SectionHeading num="03" title={sectionTitle} />
      <ol className="ml-3 flex flex-col gap-6 border-l-2 border-black">
        {experiences.map((e) => (
          <li key={e.id} className="relative pl-6">
            <span
              className={cn(
                BG[e.color],
                "absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-black"
              )}
            />
            <div className="interactive-brutal rounded-base border-2 border-black bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[17px] font-black uppercase">{e.title}</h3>
                <span className="font-mono text-xs font-semibold text-black/60">
                  {fmt(e.startDate)} — {e.endDate ? fmt(e.endDate) : t.experiences.present}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium leading-[1.55]">{e.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
