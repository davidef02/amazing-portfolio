import type { GlobalConfig } from "payload";
import { THEME_COLORS } from "@/const/colors";

export const SiteConfig: GlobalConfig = {
  slug: "siteConfig",

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
          options: [...THEME_COLORS],
          defaultValue: "yellow",
          required: true,
        },
        {
          name: "selection",
          label: "Hex codes",
          type: "group",
          fields: THEME_COLORS.map((c) => ({
            name: c,
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
        { name: "metaDescription", type: "text", required: true },
        { name: "metaLink", type: "text", required: true },
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
