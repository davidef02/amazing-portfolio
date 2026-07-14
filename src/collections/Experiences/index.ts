import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS } from "@/const/colors";

export const Experiences: CollectionConfig = {
  slug: "experiences",

  labels: {
    singular: "Experience",
    plural: "Experiences",
  },

  orderable: true,

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "text", required: true },
    {
      name: "color",
      type: "select",
      options: THEME_COLORS.map((color) => color),
      required: true,
    },
    { name: "startDate", type: "date", required: true },
    { name: "endDate", type: "date" },
    slugField("title"),
  ],
};
