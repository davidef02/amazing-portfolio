import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";

export default async function Hero() {
  const payload = await getPayload({ config });
  const [hero, site] = await Promise.all([
    payload.findGlobal({ slug: "hero" }),
    payload.findGlobal({ slug: "siteConfig", select: { fullName: true } }),
  ]);

  return (
    <div className="flex flex-col">
      {/* badge stickers */}
      <div className="mb-5 flex flex-wrap gap-3">
        {hero.badges?.map((b, i) => (
          <Badge
            key={b.id}
            className={cn(BG[b.color], "shadow-brutal uppercase tracking-wide", i % 2 ? "rotate-2" : "-rotate-2")}
          >
            {b.title}
          </Badge>
        ))}
      </div>

      {/* name block */}
      <div className="rounded-base border-4 border-black bg-main shadow-brutal p-[clamp(24px,4vw,44px)]">
        <h1 className="text-[clamp(52px,9vw,112px)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
          {site.fullName.split(" ").map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </h1>
      </div>

      {/* tagline + bio */}
      <RichText
        data={hero.heroDescription}
        enableGutter={false}
        enableProse={false}
        className="mt-6 max-w-[620px] text-base font-medium leading-relaxed"
      />

      {/* CTAs */}
      <div className="mt-7 flex flex-wrap gap-3.5">
        {hero.link?.map((l) => (
          <Button
            key={l.id}
            asChild
            variant={l.color === "black" ? "default" : "neutral"}
            className={cn(
              "h-auto px-[22px] py-3.5 text-[15px] font-black uppercase tracking-wide",
              l.color === "black" && "bg-black text-white"
            )}
          >
            <a href={l.link}>{l.title}</a>
          </Button>
        ))}
      </div>
    </div>
  );
}
