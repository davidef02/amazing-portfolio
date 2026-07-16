import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RichText from "@/components/RichText";
import { externalLinkProps } from "@/utilities/link";
import type { Locale } from "@/i18n/config";

export default async function Hero({ locale }: { locale: Locale }) {
  const payload = await getPayload({ config });
  const [hero, site] = await Promise.all([
    payload.findGlobal({ slug: "hero", locale }),
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
        className={cn(
          "mt-6 max-w-[620px] text-base font-medium leading-relaxed",
          // heading nel richText = tagline (uppercase 900), paragrafo = bio
          "[&_:is(h1,h2,h3)]:font-black [&_:is(h1,h2,h3)]:uppercase [&_:is(h1,h2,h3)]:text-[clamp(17px,2.4vw,24px)] [&_:is(h1,h2,h3)]:leading-[1.05] [&_:is(h1,h2,h3)]:tracking-[0.3px]",
          "[&>*+*]:mt-3"
        )}
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
            <a href={l.link} {...externalLinkProps(l.link)}>
              {l.title}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
