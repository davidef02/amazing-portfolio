"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import type { Header } from "@/payload-types";
import useScrollPastId from "./use-scroll-past-id";

type Props = {
  navItems: NonNullable<Header["navItems"]>;
  badgeColor: Header["badgeColor"];
};

const navBtn =
  "interactive-brutal rounded-base border-2 border-black px-3.5 py-2 text-[12.5px] font-extrabold uppercase tracking-wide shadow-brutal";

export default function HeaderClient({ navItems, badgeColor }: Props) {
  const active = useScrollPastId(navItems.map((i) => i.link.replace(/^#/, "")));
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (link: string) => active === link.replace(/^#/, "");

  return (
    <>
      {/* nav desktop (>=880px) */}
      <nav aria-label="Sections" className="hidden gap-2.5 min-[880px]:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className={cn(navBtn, isActive(item.link) ? "bg-main" : "bg-white")}
          >
            {item.title}
          </a>
        ))}
      </nav>

      {/* hamburger (<880px) */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className={cn(
          BG[badgeColor],
          "interactive-brutal flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-base border-2 border-black shadow-brutal min-[880px]:hidden",
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
        </div>
      )}
    </>
  );
}
