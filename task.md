# Roadmap: Next.js + Payload CMS Neobrutalist Portfolio

Questo è il tuo pannello di controllo dei task da completare. Le fasi di bonifica iniziale sono state completate con successo.

## 1. Configurazione Stili (Tailwind v4)
- [/] **Definizione Token `@theme`:** Verificare che `src/app/(frontend)/globals.css` sia configurato correttamente per mappare le classi utili di Neobrutal UI Live (`rounded-base`, `bg-main`, `shadow-brutal`, `bg-hot-pink`, `bg-mint`, `bg-lemon`) e le utility di focus/transizione.

## 2. Creazione Modelli nel Database (Payload CMS)
- [ ] **Collezione `Skills` (`src/collections/Skills.ts`):**
  - Definisci lo slug `skills`.
  - Campo `name` (text, required: true).
  - Campo `badgeColor` (select con opzioni: yellow, pink, cyan, green).
- [ ] **Collezione `Projects` (`src/collections/Projects.ts`):**
  - Definisci lo slug `projects`.
  - Campo `title` (text, required: true).
  - Campo `description` (richText, usando il Lexical editor).
  - Campo `coverImage` (upload, collegato a `media`).
  - Campo `technologies` (relationship, collegato a `skills`, hasMany: true).
  - Campo `githubLink` (text).
  - Campo `liveLink` (text).
  - Campi in riga (`row`): `windowColor` (select: yellow, cyan, white), `initialX` e `initialY` (number).
- [ ] **Global `Header` (`src/globals/Header.ts`):**
  - Definisci lo slug `header`.
  - Campo `navItems` (array con campi `label` e `link`).
- [ ] **Global `Footer` (`src/globals/Footer.ts`):**
  - Definisci lo slug `footer`.
  - Campo `contactEmail` (text).
  - Campo `socialLinks` (array con campi `platformName` e `url`).
- [ ] **Global `Hero` (`src/globals/Hero.ts`):**
  - Definisci lo slug `hero`.
  - Campo `heroTitle` (text, required: true).
  - Campo `bio` (textarea).
- [ ] **Registrazione e Generazione Tipi:**
  - Importa e aggiungi le entità create negli array `collections` e `globals` di `src/payload.config.ts`.
  - Esegui `npm run generate:types` nel terminale per rigenerare il file `payload-types.ts` e assicurarti l'autocompletamento TypeScript a prova di errore.

## 3. Popolamento Dati (Admin Panel)
- [ ] **Prerequisiti:** Avviare il server locale (`npm run dev`).
- [ ] **Account Admin:** Registrarsi su `http://localhost:3000/admin`.
- [ ] **Compilazione:**
  - Aggiungere 3 o 4 Skills (es. "Next.js" -> verde, "Payload" -> rosa).
  - Compilare i testi Globali (`Hero`, `Header`, `Footer`).
  - Creare 2 Progetti agganciando le relative Skills.

## 4. Frontend e Collegamento Dati
- [ ] **Data Fetching (`src/app/(frontend)/page.tsx`):**
  - Importare il config di Payload.
  - Usare `getPayload` per estrarre in modo asincrono i dati dei progetti e del profilo.
- [ ] **Sviluppo Hero & Layout:**
  - Stampare il titolo e la bio dal global `Hero`.
  - Renderizzare l'header e il footer prelevando le voci dai relativi Globals.
- [ ] **Visualizzazione Progetti:**
  - Mappare l'array dei progetti estratti dal database.
  - Renderizzare ogni progetto usando i componenti standard `<Card>`, `<Button>` e `<Badge>` importati da `@/components/ui/`.
