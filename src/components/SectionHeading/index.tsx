import type { ReactNode } from "react";

// heading condiviso: chip numerato + titolo (+ chip extra opzionale)
export function SectionHeading({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-3.5">
      <span className="rounded-base border-2 border-black bg-main px-2.5 py-1.5 text-[15px] font-black shadow-brutal">
        {num}
      </span>
      <h2 className="text-[clamp(28px,4.5vw,40px)] font-black uppercase tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </div>
  );
}
