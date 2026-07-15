import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { SectionHeading } from "@/components/SectionHeading";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en", { month: "short", year: "numeric" });

export default async function Experience() {
  const payload = await getPayload({ config });
  const { docs: experiences } = await payload.find({
    collection: "experiences",
    limit: 100,
    sort: "_order",
  });

  return (
    <div>
      <SectionHeading num="03" title="Experiences" />
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
                  {fmt(e.startDate)} — {e.endDate ? fmt(e.endDate) : "Present"}
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
