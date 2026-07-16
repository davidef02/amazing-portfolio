import config from "@payload-config";
import { getPayload } from "payload";
import RichText from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Skills({ locale }: { locale: Locale }) {
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({ slug: "header", locale });
  const sectionTitle = header.navItems?.find(i => i.link === "#skills")?.title || "Skills";
  const t = getDictionary(locale);
  const { docs: skills } = await payload.find({
    collection: "skills",
    limit: 100,
    locale,
    select: { title: true, description: true },
  });

  return (
    <div>
      <SectionHeading num="01" title={sectionTitle} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
        {skills.map((s) => (
          <div
            key={s.id}
            className="interactive-brutal rounded-base border-2 border-black bg-white p-[18px]"
          >
            <h3 className="mb-2 text-[17px] font-black uppercase tracking-[0.3px]">{s.title}</h3>
            {s.description && (
              <RichText
                data={s.description}
                enableGutter={false}
                enableProse={false}
                className="text-sm font-medium leading-[1.55]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
