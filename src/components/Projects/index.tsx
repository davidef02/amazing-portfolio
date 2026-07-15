import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";

// tilt a riposo per card (si raddrizza in hover)
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default async function Projects() {
  const payload = await getPayload({ config });
  const { docs: projects } = await payload.find({
    collection: "projects",
    limit: 100,
    depth: 1,
  });

  return (
    <div>
      <SectionHeading num="02" title="Projects">
        <span className="rounded-base border-2 border-black bg-hot-pink px-2.5 py-1 font-mono text-xs font-bold">
          click a card to flip it ↓
        </span>
      </SectionHeading>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-7 gap-y-9">
        {projects.map((p, i) => {
          const tag = typeof p.tags === "object" ? p.tags : null;
          return (
            // SEAM logica: aggiungere onClick/onKeyDown + stato rotateY sul wrapper interno per il flip
            <div
              key={p.id}
              className={cn(
                "relative h-[272px] transition-transform duration-200 [perspective:1200px] hover:rotate-0",
                TILT[i % TILT.length]
              )}
            >
              {/* tape */}
              <span
                className={cn(
                  BG[p.scotchColor],
                  "absolute -top-3 left-1/2 z-10 h-6 w-[90px] -translate-x-1/2 -rotate-2 border-x-2 border-dashed border-black/25 opacity-[0.85]"
                )}
              />

              {/* wrapper flip (rotateY 0 a riposo -> front) */}
              <div className="absolute inset-0 transition-transform duration-[450ms] [transform-style:preserve-3d]">
                {/* FRONT */}
                <div className="absolute inset-0 flex flex-col gap-2.5 rounded-base border-2 border-black bg-white p-3.5 shadow-brutal [backface-visibility:hidden]">
                  <div className="relative flex-1 overflow-hidden rounded-base border-2 border-black">
                    <Media resource={p.screenshot} fill imgClassName="object-cover" />
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        title={p.live ? "Live" : "Not live"}
                        className={cn(
                          "h-3.5 w-3.5 rounded-full border-2 border-black",
                          p.live ? "bg-black" : "bg-red"
                        )}
                      />
                      <h3 className="text-lg font-black uppercase">{p.title}</h3>
                    </div>
                    <span
                      className={cn(
                        BG[p.mainColor],
                        "flex-none rounded-base border-2 border-black px-2.5 py-1 text-[10.5px] font-extrabold uppercase"
                      )}
                    >
                      Flip ↻
                    </span>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className={cn(
                    BG[p.mainColor],
                    "absolute inset-0 flex flex-col gap-2.5 rounded-base border-2 border-black p-4 shadow-brutal [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  )}
                >
                  <span className="font-mono text-[10.5px] font-bold">{p.slug}</span>
                  <h3 className="text-[19px] font-black uppercase">{p.title}</h3>
                  <RichText
                    data={p.description}
                    enableGutter={false}
                    enableProse={false}
                    className="flex-1 text-[13px] font-semibold leading-[1.55]"
                  />
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {tag && (
                        <span className="rounded-base border-2 border-black bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.4px]">
                          {tag.title}
                        </span>
                      )}
                    </div>
                    {p.live && (
                      <a
                        href={p.link}
                        className="flex-none rounded-base border-2 border-black bg-black px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="ml-1 mt-6 font-mono text-[11px] font-semibold text-black/55">
        {`// click (or press Enter) to flip a card — the Visit link stays a link`}
      </p>
    </div>
  );
}
