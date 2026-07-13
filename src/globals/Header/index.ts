import { GlobalConfig } from "payload";
import { THEME_COLORS } from "@/const/colors";

export const Header: GlobalConfig = {
  label: "Header",
  slug: "header",

  fields: [
    {
      name: "badgeColor",
      label: "Badge color",
      type: "select",
      options: THEME_COLORS.map((color) => color),
      required: true,
    },
    {
      name: "navItems",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "link", type: "text", required: true },
      ],
    },
  ],
};
