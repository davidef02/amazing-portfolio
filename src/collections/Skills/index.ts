import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

export const Skills: CollectionConfig = {
  slug: "skills",

  labels: {
    singular: "Skill",
    plural: "Skills",
  },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "richText" },
    slugField("title"),
  ],
};
