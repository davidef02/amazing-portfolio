import { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";

export const Header: GlobalConfig = {
  label: "Header",
  slug: "header",

  fields: [
    {
      name: "badgeColor",
      label: "Badge color",
      type: "select",
      options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
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
