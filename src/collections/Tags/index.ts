import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

export const Tags: CollectionConfig = {
  slug: "tags",

  labels: {
    singular: "tag",
    plural: "tags",
  },

  fields: [{ name: "title", type: "text", required: true }, slugField("title")],
};
