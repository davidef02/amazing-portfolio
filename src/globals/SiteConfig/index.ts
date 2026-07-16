import type { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const SiteConfig: GlobalConfig = {
  slug: "siteConfig",

  access: {
    read: anyone,
    update: authenticated,
  },

  fields: [
    // gruppo sui colori
    {
      name: "colors",
      type: "group",
      fields: [
        {
          name: "mainColor",
          label: "Main color",
          type: "select",
          options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
          defaultValue: "yellow",
          required: true,
        },
        {
          name: "selection",
          label: "Hex codes",
          type: "group",
          fields: THEME_COLORS.map((c) => ({
            name: c,
            label: THEME_COLOR_LABELS[c],
            type: "text" as const,
            required: true,
            validate: (v: string | null | undefined) =>
              /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v ?? "") || "Hex non valido (es. #ffdc58)",
          })),
        },
      ],
    },
    // nome e titolo del sito
    { name: "fullName", label: "Full name", type: "text", required: true },
    { name: "siteTitle", label: "Site title", type: "text", required: true },
    // gruppo sul seo
    {
      name: "seo",
      label: "SEO",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text", required: true },
        { name: "metaDescription", type: "text", required: true, localized: true },
        { name: "metaLink", type: "text", required: true },
        {
          name: "metaImage",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description: "Consigliato 1200×630px. Anteprima quando condividi il link",
          },
        },
      ],
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: {
        mimeType: {
          in: ["image/x-icon", "image/vnd.microsoft.icon", "image/png", "image/svg+xml"],
        },
      },
    },
  ],
};
