import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

export const Tags: CollectionConfig = {
  slug: "tags",

  labels: {
    singular: "Tag",
    plural: "Tags",
  },

  admin: {
    useAsTitle: "title",
  },

  fields: [{ name: "title", type: "text", required: true }, slugField("title")],
};
