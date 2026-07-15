// link esterni (http/https) -> aprono in nuova tab di default; interni (#, /) same-tab
export const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const externalLinkProps = (href: string) =>
  isExternal(href) ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};
