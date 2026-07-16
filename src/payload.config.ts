import { postgresAdapter } from "@payloadcms/db-postgres";
import sharp from "sharp";
import path from "path";
import { buildConfig, PayloadRequest } from "payload";
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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  email: resendAdapter({
    // sandbox Resend: nessun dominio da verificare, consegna all'email del tuo account Resend
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
      defaultToEmail: "davide.fantauzzi02@gmail.com",
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
