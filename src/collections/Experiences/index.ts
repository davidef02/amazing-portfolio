import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Experiences: CollectionConfig = {
  slug: "experiences",

  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

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
