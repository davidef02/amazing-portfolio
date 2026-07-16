import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateFrontend, revalidateFrontendAfterDelete } from "@/hooks/revalidate";

export const Tags: CollectionConfig = {
  slug: "tags",

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
    singular: "Tag",
    plural: "Tags",
  },

  admin: {
    useAsTitle: "title",
  },

  fields: [{ name: "title", type: "text", required: true }, slugField("title")],
};
