"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BG } from "@/const/colors";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Project, Tag } from "@/payload-types";

// tilt a riposo per card (si raddrizza in hover)
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tags = (Array.isArray(p.tags) ? p.tags : []).filter(
    (t): t is Tag => typeof t === "object" && t !== null
  );

  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Flip project ${p.title}`}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={cn(
        "relative h-[272px] cursor-pointer transition-transform duration-200 [perspective:1200px] hover:rotate-0",
        "focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-black focus-visible:outline-offset-[6px]",
        TILT[index % TILT.length]
      )}
    >
      {/* tape */}
      <span
        className={cn(
          BG[p.scotchColor],
          "absolute -top-3 left-1/2 z-10 h-6 w-[90px] -translate-x-1/2 -rotate-2 border-x-2 border-dashed border-black/25 opacity-[0.85]"
        )}
      />

      {/* wrapper flip: rotateY(180) quando flipped */}
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-[450ms] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
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
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-base border-2 border-black bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.4px]"
                >
                  {t.title}
                </span>
              ))}
            </div>
            {p.live && p.link && (
              <a
                href={p.link}
                onClick={(e) => e.stopPropagation()}
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
}
