import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateFrontend, revalidateFrontendAfterDelete } from "@/hooks/revalidate";

export const Skills: CollectionConfig = {
  slug: "skills",

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
    singular: "Skill",
    plural: "Skills",
  },

  orderable: true,

  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "richText", localized: true },
    slugField("title"),
  ],
};
