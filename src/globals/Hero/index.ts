import { GlobalConfig } from "payload";
import { THEME_COLORS } from "@/const/colors";

export const Hero: GlobalConfig = {
  label: "Hero",
  slug: "hero",

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
          options: THEME_COLORS.map((color) => color),
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
