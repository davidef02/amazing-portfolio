import { GlobalConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateFrontendGlobal } from "@/hooks/revalidate";

export const Footer: GlobalConfig = {
  label: "Footer",
  slug: "footer",

  hooks: {
    afterChange: [revalidateFrontendGlobal],
  },

  access: {
    read: anyone,
    update: authenticated,
  },

  fields: [
    {
      name: "footerDescription",
      type: "richText",
      required: true,
      localized: true,
      label: "Written nonsense in the footer of the page",
    },
  ],
};
