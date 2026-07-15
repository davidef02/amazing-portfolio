import { GlobalConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Footer: GlobalConfig = {
  label: "Footer",
  slug: "footer",

  access: {
    read: anyone,
    update: authenticated,
  },

  fields: [
    {
      name: "footerDescription",
      type: "richText",
      required: true,
      label: "Written nonsense in the footer of the page",
    },
  ],
};
