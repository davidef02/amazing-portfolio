import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";

export const Projects: CollectionConfig = {
  slug: "projects",

  labels: {
    singular: "Project",
    plural: "Projects",
  },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "richText", required: true },
    { name: "screenshot", type: "upload", relationTo: "media", required: true },
    { name: "tags", type: "relationship", relationTo: "tags", hasMany: true },
    { name: "link", type: "text" },
    { name: "live", type: "checkbox" },
    {
      name: "mainColor",
      type: "select",
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
      required: true,
    },
    {
      name: "scotchColor",
      type: "select",
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
      required: true,
    },
    slugField("title"),
  ],

  versions: { drafts: true, maxPerDoc: 5 },
};
