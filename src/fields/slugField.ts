import type { Field } from "payload";
import { toKebabCase } from "@/utilities/toKebabCase";

const formatSlug =
  (fieldToUse: string): any =>
  ({ value, data, originalDoc }) => {
    // se l'admin ha inserito un campo valido, lo formatto e lo slug diventa quello
    if (typeof value === "string") return toKebabCase(value);

    // altrimenti utilizzo il field specificato dentro la definizione della collection
    const fallback = data?.[fieldToUse] || originalDoc?.[fieldToUse];

    if (typeof fallback === "string") return toKebabCase(fallback);

    // fallback: restituisco value e basta
    return value;
  };

export const slugField = (fieldToUse: string = "title"): Field => ({
  name: "slug",
  type: "text",
  admin: {
    position: "sidebar",
  },
  hooks: { beforeValidate: [formatSlug(fieldToUse)] },
});
