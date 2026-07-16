import type { CollectionConfig } from "payload";
import { slugField } from "@/fields/slugField";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { revalidateFrontend, revalidateFrontendAfterDelete } from "@/hooks/revalidate";

export const Projects: CollectionConfig = {
  slug: "projects",

  hooks: {
    afterChange: [revalidateFrontend],
    afterDelete: [revalidateFrontendAfterDelete],
  },

  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  labels: {
    singular: "Project",
    plural: "Projects",
  },

  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "richText", required: true, localized: true },
    { name: "screenshot", type: "upload", relationTo: "media", required: true },
    { name: "tags", type: "relationship", relationTo: "tags", hasMany: true },
    { name: "link", type: "text" },
    { name: "live", type: "checkbox" },
    {
      name: "mainColor",
      type: "select",
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
      required: true,
    },
    {
      name: "scotchColor",
      type: "select",
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
      required: true,
    },
    slugField("title"),
  ],

  versions: { drafts: true, maxPerDoc: 5 },
};
