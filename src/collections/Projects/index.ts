import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";

export const Projects: CollectionConfig = {
  slug: "projects",

  labels: {
    singular: "Project",
    plural: "Projects",
  },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "richText", required: true },
    { name: "live", type: "upload", relationTo: "media", required: true },
    slugField("title"),
  ],
};
