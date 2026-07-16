import { useEffect, useState } from "react";

export default function useScrollPastId(ids: string[]): string {
  const [activeElem, setActiveElem] = useState<string>("");
  const elementIds = ids.join(",");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const idList = elementIds ? elementIds.split(",") : [];
    
    const compute = () => {
      // 1. Fallback assoluto: se la pagina è finita, vince l'ultimo elemento
      const atBottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 50;
      
      if (atBottom && idList.length) {
        setActiveElem(idList[idList.length - 1]);
        return;
      }

      // 2. Reading Line: una linea immaginaria a circa 1/3 dello schermo
      const readingLine = window.innerHeight * 0.33;
      let currentActive = "";
      let minDistance = Infinity;

      // Trova l'elemento che attraversa la reading line
      idList.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        // Se la sezione contiene la reading line (inizia sopra e finisce sotto)
        if (rect.top <= readingLine && rect.bottom >= readingLine) {
          currentActive = id;
        }
      });

      // Se siamo nello spazio tra due sezioni, cerchiamo quella più vicina alla reading line
      if (!currentActive) {
        idList.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          
          const distanceToTop = Math.abs(rect.top - readingLine);
          const distanceToBottom = Math.abs(rect.bottom - readingLine);
          const closest = Math.min(distanceToTop, distanceToBottom);
          
          if (closest < minDistance) {
            minDistance = closest;
            currentActive = id;
          }
        });
      }

      // Se la primissima sezione è ancora tutta sotto la reading line, non attiviamo nulla
      const firstEl = document.getElementById(idList[0]);
      if (firstEl && firstEl.getBoundingClientRect().top > readingLine) {
        setActiveElem("");
        return;
      }

      if (currentActive) {
        setActiveElem(currentActive);
      }
    };

    // Usiamo il listener passivo. getBoundingClientRect in sola lettura non causa reflow
    // ed è estremamente preciso rispetto ai bug dell'IntersectionObserver su altezze strane.
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    
    // Inizializza subito
    compute();

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [elementIds]);

  return activeElem;
}
