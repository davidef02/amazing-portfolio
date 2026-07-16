import type { Locale } from "./config";

// Stringhe UI hardcoded (non gestite dal CMS). I contenuti veri
// (nav, hero, footer, social, toast, sezioni…) arrivano dai globals/collections
// localizzati di Payload — qui stanno solo le stringhe di chrome dell'app.
type Dictionary = {
  projects: { flipHint: string };
  experiences: { present: string };
  contact: { send: string; sending: string; elsewhere: string };
  aria: { sections: string; toggleMenu: string; switchLanguage: string };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    projects: { flipHint: "click a card to flip it ↓" },
    experiences: { present: "Present" },
    contact: { send: "Send message →", sending: "Sending…", elsewhere: "Elsewhere" },
    aria: { sections: "Sections", toggleMenu: "Toggle menu", switchLanguage: "Switch language" },
  },
  it: {
    projects: { flipHint: "clicca una card per girarla ↓" },
    experiences: { present: "Presente" },
    contact: { send: "Invia messaggio →", sending: "Invio…", elsewhere: "Altrove" },
    aria: { sections: "Sezioni", toggleMenu: "Apri/chiudi menu", switchLanguage: "Cambia lingua" },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
