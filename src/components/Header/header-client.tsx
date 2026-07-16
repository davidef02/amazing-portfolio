"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import type { Header } from "@/payload-types";
import { locales, type Locale } from "@/i18n/config";
import useScrollPastId from "./use-scroll-past-id";

type Props = {
  navItems: NonNullable<Header["navItems"]>;
  badgeColor: Header["badgeColor"];
  locale: Locale;
  aria: { sections: string; toggleMenu: string; switchLanguage: string };
};

const navBtn =
  "interactive-brutal rounded-base border-2 border-black px-3.5 py-2 text-[12.5px] font-extrabold uppercase tracking-wide";

// switch lingua: link statici a /<locale> (sito single-page, lo switch cambia solo la locale)
function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex gap-1.5">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "interactive-brutal rounded-base border-2 border-black px-2.5 py-2 text-[12.5px] font-extrabold uppercase",
            l === locale ? "bg-main" : "bg-white",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

export default function HeaderClient({ navItems, badgeColor, locale, aria }: Props) {
  const active = useScrollPastId(navItems.map((i) => i.link.replace(/^#/, "")));
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (link: string) => active === link.replace(/^#/, "");

  return (
    <>
      {/* nav desktop (>=880px) */}
      <nav aria-label={aria.sections} className="hidden items-center gap-2.5 min-[880px]:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className={cn(navBtn, isActive(item.link) ? "bg-main" : "bg-white")}
          >
            {item.title}
          </a>
        ))}
        <LangSwitch locale={locale} label={aria.switchLanguage} />
      </nav>

      {/* hamburger (<880px) */}
      <button
        type="button"
        aria-label={aria.toggleMenu}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className={cn(
          BG[badgeColor],
          "interactive-brutal flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-base border-2 border-black min-[880px]:hidden",
        )}
      >
        <span className="h-[2.5px] w-4.5 bg-black" />
        <span className="h-[2.5px] w-4.5 bg-black" />
        <span className="h-[2.5px] w-4.5 bg-black" />
      </button>

      {/* dropdown mobile — richiede `relative` sul <header> genitore */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-10 mt-2.5 flex flex-col gap-2.5 rounded-base border-2 border-black bg-white p-3 shadow-brutal min-[880px]:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              onClick={() => setMenuOpen(false)}
              className={cn(navBtn, "text-left", isActive(item.link) ? "bg-main" : "bg-white")}
            >
              {item.title}
            </a>
          ))}
          <LangSwitch locale={locale} label={aria.switchLanguage} />
        </div>
      )}
    </>
  );
}
