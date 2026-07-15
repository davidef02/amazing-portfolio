import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";

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
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
      required: true,
    },
    { name: "startDate", type: "date", required: true },
    { name: "endDate", type: "date" },
    slugField("title"),
  ],
};
