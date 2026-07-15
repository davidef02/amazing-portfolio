"use client";

import { Toaster as SonnerToaster } from "sonner";

// toaster globale (montato una volta nel layout) — stile neobrutalist
export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      duration={6000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 rounded-base border-2 border-black p-3.5 shadow-brutal",
          title: "text-sm font-black uppercase",
          description: "text-[13px] font-semibold",
          success: "bg-mint",
          error: "bg-red",
        },
      }}
    />
  );
}
