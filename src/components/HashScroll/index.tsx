"use client";

import { useEffect } from "react";

// hard load / reload su /#id -> scrolla all'elemento
// (lo scroll nativo su hash di Next App Router è inaffidabile con contenuto async)
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    // aspetta che layout/font si assestino, poi scrolla (scroll-mt gestisce l'offset header)
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView();
    }, 100);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
