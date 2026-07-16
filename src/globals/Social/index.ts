import { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Social: GlobalConfig = {
  slug: "social",

  access: {
    read: anyone,
    update: authenticated,
  },

  fields: [
    { name: "contactForm", type: "relationship", relationTo: "forms", required: true },
    {
      name: "toast",
      label: "Contact form toast",
      type: "group",
      fields: [
        { name: "successTitle", type: "text", required: true, localized: true },
        { name: "successMessage", type: "text", required: true, localized: true },
        { name: "errorTitle", type: "text", required: true, localized: true },
        { name: "errorMessage", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "socialDescription",
      label: "Text on top of social links",
      required: false,
      type: "text",
      localized: true,
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
          options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
          required: true,
        },
      ],
    },
  ],
};
