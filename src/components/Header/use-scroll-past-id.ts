import { useEffect, useState } from "react";

export default function useScrollPastId(ids: string[]): string {
  const [activeElem, setActiveElem] = useState<string>("");
  const elementIds = ids.join(","); // x evitare riesecuzione di useeffect ad ogni rerender

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const idList = elementIds ? elementIds.split(",") : [];
    const visible = new Map<string, boolean>(); // id -> sta intersecando la banda?

    // priorità: sezione-in-banda > fondo-pagina > sopra-tutto (hero) > mantieni ultimo
    const compute = () => {
      // ultimo (in ordine documento) che interseca: con banda in alto è la sezione in cui sei entrato
      const current = idList.filter((id) => visible.get(id)).pop();
      if (current) {
        setActiveElem(current);
        return;
      }
      // fondo pagina: l'ultima sezione (contact) non entra mai nella banda -> forzala
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && idList.length) {
        setActiveElem(idList[idList.length - 1]);
        return;
      }
      // sopra la prima sezione (in hero) -> nessuna attiva
      const first = document.getElementById(idList[0]);
      if (first && first.getBoundingClientRect().top > 88) setActiveElem("");
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
      compute();
    }, {
      root: null,
      threshold: 0,
      rootMargin: "-88px 0px -85% 0px", // banda sottile sotto l'header (88px) -> ~15% viewport
    });

    idList.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    compute();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [elementIds]);

  return activeElem;
}
