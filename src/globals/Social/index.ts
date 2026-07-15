import { GlobalConfig } from "payload";
import { THEME_COLORS, THEME_COLOR_LABELS } from "@/const/colors";

export const Social: GlobalConfig = {
  slug: "social",

  fields: [
    { name: "contactForm", type: "relationship", relationTo: "forms", required: true },
    {
      name: "toast",
      label: "Contact form toast",
      type: "group",
      fields: [
        { name: "successTitle", type: "text", required: true },
        { name: "successMessage", type: "text", required: true },
        { name: "errorTitle", type: "text", required: true },
        { name: "errorMessage", type: "text", required: true },
      ],
    },
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
          options: THEME_COLORS.map((c) => ({ label: THEME_COLOR_LABELS[c], value: c })),
          required: true,
        },
      ],
    },
  ],
};
