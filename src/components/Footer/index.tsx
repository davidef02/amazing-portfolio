import config from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
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
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t-2 border-black pt-4 text-[12.5px] font-bold uppercase tracking-wide">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <span>
          © {year} {site.fullName}
        </span>
        <Link
          href={`/${locale}/privacy`}
          className="underline decoration-2 underline-offset-2 hover:bg-main focus-visible:focus-brutal"
        >
          Privacy Policy
        </Link>
      </div>
      <RichText data={footer.footerDescription} enableGutter={false} enableProse={false} />
    </div>
  );
}
