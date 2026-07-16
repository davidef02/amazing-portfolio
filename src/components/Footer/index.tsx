import config from "@payload-config";
import { getPayload } from "payload";
import RichText from "@/components/RichText";
import type { Locale } from "@/i18n/config";

export default async function Footer({ locale }: { locale: Locale }) {
  const payload = await getPayload({ config });
  const [footer, site] = await Promise.all([
    payload.findGlobal({ slug: "footer", locale }),
    payload.findGlobal({ slug: "siteConfig", select: { fullName: true } }),
  ]);
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-black pt-4 text-[12.5px] font-bold uppercase tracking-wide">
      <span>
        © {year} {site.fullName}
      </span>
      <RichText data={footer.footerDescription} enableGutter={false} enableProse={false} />
    </div>
  );
}
