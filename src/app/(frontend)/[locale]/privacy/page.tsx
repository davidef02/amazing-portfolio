import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerSideURL } from "@/utilities/getURL";
import { privacyContent, PRIVACY_EMAIL, GARANTE_URL } from "./privacy-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// come la home: solo le locale note sono valide
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const c = privacyContent[locale];
  const serverURL = getServerSideURL();
  const canonical = `${serverURL}/${locale}/privacy`;

  return {
    title: c.title,
    description: c.lead,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${serverURL}/${l}/privacy`])),
        "x-default": `${serverURL}/${defaultLocale}/privacy`,
      },
    },
  };
}

// link inline testo (accento brutal: underline + hover accent)
const linkClass =
  "font-bold underline decoration-2 underline-offset-[3px] transition-brutal hover:bg-main focus-visible:focus-brutal";

const emailLink = (
  <a href={`mailto:${PRIVACY_EMAIL}`} className={cn(linkClass, "break-words")}>
    {PRIVACY_EMAIL}
  </a>
);
const garanteLink = (
  <a href={GARANTE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
    garanteprivacy.it
  </a>
);

// sostituisce i token {email} / {garante} nel testo con i rispettivi link
function renderText(text: string) {
  return text.split(/(\{email\}|\{garante\})/g).map((part, i) => {
    if (part === "{email}") return <Fragment key={i}>{emailLink}</Fragment>;
    if (part === "{garante}") return <Fragment key={i}>{garanteLink}</Fragment>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const pill =
  "interactive-brutal rounded-base border-2 border-black text-[12.5px] font-extrabold uppercase tracking-wide focus-visible:focus-brutal";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = privacyContent[locale];
  const aria = getDictionary(locale).aria;

  return (
    <main className="mx-auto max-w-[820px] px-4 pb-16 pt-6">
      {/* top bar: back + switch lingua (nav home rotta qui, ancore #section vivono sulla home) */}
      <div className="mb-10 flex items-center justify-between gap-3">
        <Link href={`/${locale}`} className={cn(pill, "inline-flex items-center gap-2 bg-white px-3.5 py-2")}>
          <span aria-hidden>←</span>
          {c.back}
        </Link>
        <div role="group" aria-label={aria.switchLanguage} className="flex gap-1.5">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}/privacy`}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              className={cn(pill, "px-2.5 py-2", l === locale ? "bg-main" : "bg-white")}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

      {/* intestazione documento */}
      <header className="mb-9">
        <span className="inline-block rounded-base border-2 border-black bg-main px-2.5 py-1.5 text-[12px] font-black uppercase tracking-wide shadow-brutal">
          {c.eyebrow}
        </span>
        <h1 className="mt-4 text-[clamp(34px,6vw,56px)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
          {c.title}
        </h1>
        <p className="mt-3 font-mono text-[12.5px] font-semibold uppercase tracking-wide text-foreground/55">
          {c.updated}
        </p>
        <p className="mt-6 max-w-[62ch] text-[16px] font-medium leading-[1.65]">{c.lead}</p>
      </header>

      {/* sezioni: documento legale = struttura numerata (01..08), coerente coi chip della home */}
      <div className="flex flex-col gap-5">
        {c.sections.map((s) => (
          <section
            key={s.n}
            className="rounded-base border-2 border-black bg-white p-6 shadow-brutal sm:p-7"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-base border-2 border-black bg-main px-2 py-1 text-[13px] font-black shadow-brutal">
                {s.n}
              </span>
              <h2 className="text-[18px] font-black uppercase tracking-[-0.01em] sm:text-[20px]">
                {s.title}
              </h2>
            </div>

            <div className="flex flex-col gap-3.5">
              {s.body.map((block, i) => {
                if ("p" in block) {
                  return (
                    <p key={i} className="text-[15px] font-medium leading-[1.7] text-foreground/85">
                      {renderText(block.p)}
                    </p>
                  );
                }
                if ("ul" in block) {
                  return (
                    <ul key={i} className="flex flex-col gap-2">
                      {block.ul.map((li, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-[15px] font-medium leading-[1.6] text-foreground/85"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] h-[7px] w-[7px] flex-none border border-black bg-main"
                          />
                          <span>{renderText(li)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <dl key={i} className="flex flex-col gap-2.5">
                    {block.dl.map(([term, desc]) => (
                      <div
                        key={term}
                        className="flex flex-col gap-0.5 border-l-2 border-black pl-3.5 sm:flex-row sm:items-baseline sm:gap-2"
                      >
                        <dt className="flex-none text-[14px] font-black uppercase tracking-wide">
                          {term}
                        </dt>
                        <dd className="text-[15px] font-medium leading-[1.6] text-foreground/85">
                          {desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                );
              })}
            </div>
          </section>
        ))}

        {/* CTA finale */}
        <section className="mt-1 rounded-base border-2 border-black bg-main p-6 shadow-brutal sm:p-7">
          <h2 className="text-[18px] font-black uppercase tracking-[-0.01em] sm:text-[20px]">
            {c.cta.title}
          </h2>
          <p className="mt-2 text-[15px] font-medium leading-[1.6]">{c.cta.text}</p>
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="interactive-brutal mt-4 inline-flex items-center gap-2 rounded-base border-2 border-black bg-white px-4 py-2.5 text-[14px] font-black tracking-wide focus-visible:focus-brutal"
          >
            <span className="break-all">{PRIVACY_EMAIL}</span>
            <span aria-hidden>→</span>
          </a>
        </section>
      </div>

      <div className="mt-14">
        <Footer locale={locale} />
      </div>
    </main>
  );
}
