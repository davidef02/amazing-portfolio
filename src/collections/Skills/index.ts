import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Skills: CollectionConfig = {
  slug: "skills",

  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  labels: {
    singular: "Skill",
    plural: "Skills",
  },

  orderable: true,

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "richText" },
    slugField("title"),
  ],
};
