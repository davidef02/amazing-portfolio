import type { Locale } from "@/i18n/config";

// Informativa privacy: contenuto legale hardcoded e localizzato (NON dal CMS).
// Testo legale che cambia raramente -> niente collection/global, niente hook di
// revalidation da ricordare. `{email}` e `{garante}` sono token sostituiti con i
// rispettivi link dal renderer in page.tsx.

export const PRIVACY_EMAIL = "davide.fantauzzi02@gmail.com";
export const GARANTE_URL = "https://www.garanteprivacy.it";

type Block = { p: string } | { ul: string[] } | { dl: [string, string][] };
type Section = { n: string; title: string; body: Block[] };

export type PrivacyContent = {
  eyebrow: string;
  title: string;
  updated: string;
  lead: string;
  back: string;
  sections: Section[];
  cta: { title: string; text: string };
};

export const privacyContent: Record<Locale, PrivacyContent> = {
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updated: "Last updated: July 17, 2026",
    lead: "This notice explains how personal data collected through this website is handled, in accordance with Regulation (EU) 2016/679 (GDPR).",
    back: "Back to home",
    sections: [
      {
        n: "01",
        title: "Data controller",
        body: [
          {
            p: "The data controller is Davide Fantauzzi. For any question about your personal data, write to {email}.",
          },
        ],
      },
      {
        n: "02",
        title: "What data is collected",
        body: [
          {
            p: "Data you provide voluntarily through the contact form: your name, your email address, and the content of your message.",
          },
          {
            p: "Technical browsing data collected automatically by the hosting infrastructure (IP address, browser type, access logs) to keep the site working and secure.",
          },
          {
            p: "This site uses no profiling cookies and no advertising trackers, and it carries out no automated decision-making or profiling.",
          },
        ],
      },
      {
        n: "03",
        title: "Why the data is processed, and on what legal basis",
        body: [
          {
            p: "Contact-form data is processed for the sole purpose of replying to your request. The legal basis is the performance of pre-contractual measures taken at your request, together with the controller's legitimate interest in responding (Art. 6(1)(b) and (f) GDPR).",
          },
          {
            p: "Technical browsing data is processed on the basis of the legitimate interest in keeping the site secure and functioning.",
          },
          {
            p: "Providing the data requested by the form is optional, but without it I cannot follow up on your request.",
          },
        ],
      },
      {
        n: "04",
        title: "Who receives the data",
        body: [
          {
            p: "To run this site I rely on providers that process data on my behalf (data processors):",
          },
          {
            dl: [
              ["Vercel Inc.", "hosting and delivery of the site."],
              ["Neon Inc.", "database where messages sent through the form are stored."],
              ["Resend", "delivery of the email that notifies me of your message."],
              ["Cloudflare, Inc.", "DNS management and storage of media files."],
            ],
          },
          {
            p: "Data is never disclosed publicly or sold to third parties for commercial purposes.",
          },
        ],
      },
      {
        n: "05",
        title: "Data transfers outside the EU",
        body: [
          {
            p: "Some providers are based in the United States. Any transfer takes place in compliance with the GDPR, on the basis of the Standard Contractual Clauses approved by the European Commission and/or adherence to the EU–US Data Privacy Framework. A copy of these safeguards can be requested by writing to {email}.",
          },
        ],
      },
      {
        n: "06",
        title: "How long the data is kept",
        body: [
          {
            p: "Messages sent through the contact form are kept for no longer than 12 months from the date they are received, after which they are deleted automatically, unless a legal obligation requires otherwise. Technical logs are kept only for as long as strictly necessary for the security of the site.",
          },
        ],
      },
      {
        n: "07",
        title: "Your rights",
        body: [
          {
            p: "At any time you can exercise the rights granted by Articles 15–22 GDPR:",
          },
          {
            ul: [
              "access your data and request a copy;",
              "request its rectification or erasure;",
              "request restriction of, or object to, the processing;",
              "request the portability of your data.",
            ],
          },
          {
            p: "To exercise them, write to {email}. You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali, {garante}).",
          },
        ],
      },
      {
        n: "08",
        title: "Changes to this notice",
        body: [
          {
            p: "This notice may be updated over time. Any change will be published on this page, along with an updated revision date.",
          },
        ],
      },
    ],
    cta: {
      title: "Questions about your data?",
      text: "Write to me and I'll get back to you as soon as I can.",
    },
  },

  it: {
    eyebrow: "Note legali",
    title: "Privacy Policy",
    updated: "Ultimo aggiornamento: 17 luglio 2026",
    lead: "Questa informativa descrive come vengono trattati i dati personali raccolti tramite questo sito, in conformità al Regolamento (UE) 2016/679 (GDPR).",
    back: "Torna alla home",
    sections: [
      {
        n: "01",
        title: "Titolare del trattamento",
        body: [
          {
            p: "Il titolare del trattamento è Davide Fantauzzi. Per qualsiasi questione relativa ai tuoi dati personali puoi scrivere a {email}.",
          },
        ],
      },
      {
        n: "02",
        title: "Quali dati raccogliamo",
        body: [
          {
            p: "Dati che fornisci volontariamente tramite il modulo di contatto: nome, indirizzo email e contenuto del messaggio.",
          },
          {
            p: "Dati tecnici di navigazione raccolti automaticamente dall'infrastruttura di hosting (indirizzo IP, tipo di browser, log di accesso) per garantire il funzionamento e la sicurezza del sito.",
          },
          {
            p: "Il sito non utilizza cookie di profilazione né strumenti di tracciamento pubblicitario, e non effettua alcun processo decisionale automatizzato o attività di profilazione.",
          },
        ],
      },
      {
        n: "03",
        title: "Perché trattiamo i dati e su quale base giuridica",
        body: [
          {
            p: "I dati del modulo di contatto sono trattati al solo scopo di rispondere alla tua richiesta. La base giuridica è l'esecuzione di misure precontrattuali adottate su tua richiesta, unita al legittimo interesse del titolare a fornire riscontro (art. 6, par. 1, lett. b ed f, GDPR).",
          },
          {
            p: "I dati tecnici di navigazione sono trattati sulla base del legittimo interesse a mantenere il sito sicuro e funzionante.",
          },
          {
            p: "Il conferimento dei dati richiesti dal modulo è facoltativo, ma senza di essi non è possibile dare seguito alla tua richiesta.",
          },
        ],
      },
      {
        n: "04",
        title: "A chi comunichiamo i dati",
        body: [
          {
            p: "Per erogare il servizio mi avvalgo di fornitori che trattano i dati per mio conto (responsabili del trattamento):",
          },
          {
            dl: [
              ["Vercel Inc.", "hosting e distribuzione del sito."],
              ["Neon Inc.", "database in cui sono archiviati i messaggi inviati dal modulo."],
              ["Resend", "invio dell'email di notifica del tuo messaggio."],
              ["Cloudflare, Inc.", "gestione DNS e archiviazione dei file multimediali."],
            ],
          },
          {
            p: "I dati non sono diffusi né ceduti a terzi per finalità commerciali.",
          },
        ],
      },
      {
        n: "05",
        title: "Trasferimento dei dati fuori dall'UE",
        body: [
          {
            p: "Alcuni fornitori hanno sede negli Stati Uniti. Gli eventuali trasferimenti avvengono nel rispetto del GDPR, sulla base delle Clausole Contrattuali Standard approvate dalla Commissione Europea e/o dell'adesione al Data Privacy Framework UE-USA. Una copia delle garanzie adottate può essere richiesta scrivendo a {email}.",
          },
        ],
      },
      {
        n: "06",
        title: "Per quanto tempo conserviamo i dati",
        body: [
          {
            p: "I messaggi inviati tramite il modulo di contatto sono conservati per un massimo di 12 mesi dalla data di ricezione, trascorsi i quali vengono cancellati automaticamente, salvo obblighi di legge. I log tecnici sono conservati per il tempo strettamente necessario alla sicurezza del sito.",
          },
        ],
      },
      {
        n: "07",
        title: "I tuoi diritti",
        body: [
          {
            p: "In qualsiasi momento puoi esercitare i diritti previsti dagli articoli 15-22 del GDPR:",
          },
          {
            ul: [
              "accedere ai tuoi dati e chiederne copia;",
              "chiederne la rettifica o la cancellazione;",
              "chiedere la limitazione del trattamento od opporti ad esso;",
              "richiedere la portabilità dei dati.",
            ],
          },
          {
            p: "Per esercitarli, scrivi a {email}. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali ({garante}).",
          },
        ],
      },
      {
        n: "08",
        title: "Modifiche a questa informativa",
        body: [
          {
            p: "Questa informativa può essere aggiornata nel tempo. Le eventuali modifiche saranno pubblicate su questa pagina, con la data di aggiornamento aggiornata.",
          },
        ],
      },
    ],
    cta: {
      title: "Domande sui tuoi dati?",
      text: "Scrivimi, ti rispondo appena posso.",
    },
  },
};
