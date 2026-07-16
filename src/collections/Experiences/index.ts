import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateFrontend, revalidateFrontendAfterDelete } from "@/hooks/revalidate";

export const Experiences: CollectionConfig = {
  slug: "experiences",

  hooks: {
    afterChange: [revalidateFrontend],
    afterDelete: [revalidateFrontendAfterDelete],
  },

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
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "text", required: true, localized: true },
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
