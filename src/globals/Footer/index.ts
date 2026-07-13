import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  label: "Footer",
  slug: "footer",

  fields: [
    {
      name: "footerDescription",
      type: "richText",
      required: true,
      label: "Written nonsense in the footer of the page",
    },
  ],
};
