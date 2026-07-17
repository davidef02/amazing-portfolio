import { postgresAdapter } from "@payloadcms/db-postgres";
import sharp from "sharp";
import path from "path";
import { APIError, buildConfig, PayloadRequest } from "payload";
import { fileURLToPath } from "url";
import { Skills } from "./collections/Skills";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { defaultLexical } from "@/fields/defaultLexical";
import { getServerSideURL } from "./utilities/getURL";
import { Projects } from "./collections/Projects";
import { Experiences } from "./collections/Experiences";
import { SiteConfig } from "./globals/SiteConfig";
import { Hero } from "./globals/Hero";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { CUSTOM_HTML_EMAIL } from "./const/email";
import { Social } from "@/globals/Social";
import { resendAdapter } from "@payloadcms/email-resend";
import { Tags } from "@/collections/Tags";
import { s3Storage } from "@payloadcms/storage-s3";
import { cleanupSubmissions } from "./endpoints/cleanupSubmissions";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  email: resendAdapter({
    // Resend sandbox: invia SOLO all'indirizzo dell'account Resend (= defaultToEmail) — basta per
    // la notifica al proprietario. Per usare noreply@davidefantauzzi.me (inviare a chiunque + inbox
    // garantita) va prima verificato il dominio su Resend; non serve per questo portfolio.
    defaultFromAddress: "onboarding@resend.dev",
    defaultFromName: "Portfolio",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  admin: {
    toast: { limit: 1, position: "bottom-right" },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  collections: [Media, Users, Skills, Projects, Experiences, Tags],
  // cleanup automatico dei messaggi del form oltre il periodo di conservazione (Privacy Policy §06),
  // invocato da Vercel Cron (vedi vercel.json). Montato su /api/cron/cleanup-submissions.
  endpoints: [cleanupSubmissions],
  localization: {
    locales: [
      { code: "en", label: "English" },
      { code: "it", label: "Italiano" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteConfig, Header, Footer, Hero, Social],
  plugins: [
    formBuilderPlugin({
      defaultToEmail: "contactme@davidefantauzzi.me",
      // `confirmationMessage` del plugin è required e blocca il salvataggio del form in admin.
      // Il frontend non lo usa (i feedback sono toast, testo dal global Social) → reso opzionale
      // e sempre nascosto. Non lo rimuoviamo del tutto per non forzare un drop di colonna su Neon.
      formOverrides: {
        fields: ({ defaultFields }) => {
          // `confirmationMessage` (richText) è required e blocca il salvataggio del form in admin.
          // Lo rendiamo opzionale e nascosto (il frontend usa i toast dal global Social).
          const cm = defaultFields.find(
            (f) => "name" in f && f.name === "confirmationMessage",
          ) as { required?: boolean; admin?: { hidden?: boolean } } | undefined;
          if (cm) {
            cm.required = false;
            cm.admin ??= {};
            cm.admin.hidden = true;
          }
          return defaultFields;
        },
      },
      // honeypot anti-spam: il frontend invia sempre un campo nascosto `website` vuoto; i bot lo
      // compilano → 400 in beforeValidate = niente salvataggio e niente email (sendEmail è in
      // afterChange). Se vuoto, la riga viene rimossa così non finisce né in DB né in {{*:table}}.
      formSubmissionOverrides: {
        hooks: {
          beforeValidate: [
            ({ data }) => {
              type Entry = { field?: string; value?: unknown };
              const entries: Entry[] = data?.submissionData ?? [];
              const trap = entries.find((e) => e.field === "website");
              if (trap && String(trap.value ?? "").trim() !== "") {
                throw new APIError("Invalid submission", 400);
              }
              if (data) {
                data.submissionData = entries.filter((e) => e.field !== "website");
              }
              return data;
            },
          ],
        },
      },
      beforeEmail: (emails, beforeChangeParams) => {
        const formData = beforeChangeParams.data;
        return emails.map((email) => ({
          ...email,
          subject: `${formData.name || "Un utente"} ti ha contattato dal portfolio`,
          html: CUSTOM_HTML_EMAIL(email),
        }));
      },
    }),
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          disableLocalStorage: true,
          generateFileURL: ({ filename, prefix }) => {
            return `https://media.davidefantauzzi.me/${prefix}/${filename}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET_NAME || "portfolio-media",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT || "",
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        const secret = process.env.CRON_SECRET;
        if (!secret) return false;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${secret}`;
      },
    },
    tasks: [],
  },
});
