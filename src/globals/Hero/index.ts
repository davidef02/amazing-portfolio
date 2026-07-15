import { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Hero: GlobalConfig = {
  label: "Hero",
  slug: "hero",

  access: {
    read: anyone,
    update: authenticated,
  },

  fields: [
    {
      name: "heroDescription",
      type: "richText",
      required: true,
      label: "Hero description",
    },
    {
      name: "badges",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "color",
          type: "select",
          options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
          required: true,
        },
      ],
    },
    {
      name: "link",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "link", type: "text", required: true },
        { name: "color", type: "select", options: ["white", "black"] },
      ],
    },
  ],
};
