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
    { name: "screenshot", type: "upload", relationTo: "media", required: true },
    { name: "skills", type: "array", fields: [{ name: "skill", type: "text" }] },
    { name: "link", type: "text", required: true },
    { name: "live", type: "checkbox", required: true },
    slugField("title"),
  ],

  versions: { drafts: true, maxPerDoc: 5 },
};
