import { GlobalConfig } from "payload";
import { THEME_COLORS } from "@/const/colors";

export const Social: GlobalConfig = {
  slug: "social",

  fields: [
    {
      name: "socialDescription",
      label: "Text on top of social links",
      required: false,
      type: "text",
    },
    {
      name: "links",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "link", type: "text", required: true },
        {
          name: "color",
          type: "select",
          options: THEME_COLORS.map((color) => color),
          required: true,
        },
      ],
    },
  ],
};
