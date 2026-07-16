import config from "@payload-config";
import { getPayload } from "payload";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import HeaderClient from "@/components/Header/header-client";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Header({ locale }: { locale: Locale }) {
  const payload = await getPayload({ config });
  const t = getDictionary(locale);
  const [header, site] = await Promise.all([
    payload.findGlobal({ slug: "header", locale }),
    payload.findGlobal({ slug: "siteConfig", select: { fullName: true } }),
  ]);

  return (
    <>
      <div className="h-[74px]" />
      <div className="fixed inset-x-0 top-3 z-[1000] px-4">
        <header className="relative mx-auto flex max-w-[1100px] items-center justify-between gap-3 rounded-base border-2 border-black bg-white px-3.5 py-2.5 shadow-brutal">
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-[17px] font-black uppercase tracking-wide"
          >
            <span
              className={cn(
                BG[header.badgeColor],
                "h-5 w-5 flex-none rounded-base border-2 border-black",
              )}
            />
            <span>{site.fullName}</span>
          </a>
          {/* isola client: riceve dati come props */}
          <HeaderClient
            navItems={header.navItems ?? []}
            badgeColor={header.badgeColor}
            locale={locale}
            aria={t.aria}
          />
        </header>
      </div>
    </>
  );
}
