import { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Header: GlobalConfig = {
  label: "Header",
  slug: "header",

  access: {
    read: anyone,
    update: authenticated,
  },

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
        { name: "title", type: "text", required: true, localized: true },
        { name: "link", type: "text", required: true },
      ],
    },
  ],
};
