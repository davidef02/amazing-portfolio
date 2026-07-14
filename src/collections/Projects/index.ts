import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS } from "@/const/colors";

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
    { name: "tags", type: "relationship", relationTo: "tags" },
    { name: "link", type: "text", required: true },
    { name: "live", type: "checkbox", required: true },
    {
      name: "mainColor",
      type: "select",
      options: THEME_COLORS.map((color) => color),
      required: true,
    },
    {
      name: "scotchColor",
      type: "select",
      options: THEME_COLORS.map((color) => color),
      required: true,
    },
    slugField("title"),
  ],

  versions: { drafts: true, maxPerDoc: 5 },
};
