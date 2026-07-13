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
import { SiteConfig } from "./globals/SiteConfig";
import { Hero } from "./globals/Hero";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ["@/components/BeforeLogin"],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ["@/components/BeforeDashboard"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  collections: [Media, Users, Skills, Projects],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteConfig, Header, Footer, Hero],
  plugins: [
    formBuilderPlugin({
      defaultToEmail: "davide.fantauzzi02@gmail.com",
      beforeEmail: (emails, beforeChangeParams) => {
        const formData = beforeChangeParams.data;
        return emails.map((email) => ({
          ...email,
          subject: `${formData.name || "Un utente"} ti ha contattato! dal portfolio`,
          html: CUSTOM_HTML_EMAIL,
        }));
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
