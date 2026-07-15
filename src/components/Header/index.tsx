import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";

export default async function Header() {
  const payload = await getPayload({ config });
  const [header, site] = await Promise.all([
    payload.findGlobal({ slug: "header" }),
    payload.findGlobal({ slug: "siteConfig", select: { fullName: true } }),
  ]);

  return (
    <>
      {/* spacer per header fixed */}
      <div className="h-[74px]" />
      <div className="fixed inset-x-0 top-3 z-[1000] px-4">
        <header className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 rounded-base border-2 border-black bg-white px-3.5 py-2.5 shadow-brutal">
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-[17px] font-black uppercase tracking-wide"
          >
            <span className={cn(BG[header.badgeColor], "h-5 w-5 flex-none rounded-base border-2 border-black")} />
            <span>{site.fullName}</span>
          </a>

          {/* nav desktop (>=880px) — SEAM: stato attivo scroll-spy */}
          <nav aria-label="Sections" className="hidden gap-2.5 min-[880px]:flex">
            {header.navItems?.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="interactive-brutal rounded-base border-2 border-black bg-white px-3.5 py-2 text-[12.5px] font-extrabold uppercase tracking-wide shadow-brutal"
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* hamburger (<880px) — SEAM: toggle menu + dropdown mobile */}
          <button
            type="button"
            aria-label="Toggle menu"
            className={cn(
              BG[header.badgeColor],
              "interactive-brutal flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-base border-2 border-black shadow-brutal min-[880px]:hidden"
            )}
          >
            <span className="h-[2.5px] w-[18px] bg-black" />
            <span className="h-[2.5px] w-[18px] bg-black" />
            <span className="h-[2.5px] w-[18px] bg-black" />
          </button>
        </header>
      </div>
    </>
  );
}
