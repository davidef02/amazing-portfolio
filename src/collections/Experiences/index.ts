import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS } from "@/const/colors";

export const Experiences: CollectionConfig = {
  slug: "experiences",

  labels: {
    singular: "Experience",
    plural: "Experiences",
  },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "text", required: true },
    {
      name: "color",
      type: "select",
      options: THEME_COLORS.map((color) => color),
      required: true,
    },
    slugField("title"),
  ],
};
