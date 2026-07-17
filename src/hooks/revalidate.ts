import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from "payload";
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

// Il sito è single-page e statico (SSG: /en, /it, + /en/privacy, /it/privacy). Ogni contenuto
// CMS finisce in quelle pagine, quindi su ogni modifica/eliminazione rigenero on-demand tutte
// le route per locale: restano statiche (servite dalla CDN) ma riflettono le modifiche admin
// senza redeploy. La pagina /privacy è inclusa perché usa i global Footer + SiteConfig.
// Il guard `disableRevalidate` permette a seed/script di saltare la rigenerazione.
function revalidateFrontendPaths(payload: Payload) {
  for (const locale of locales) {
    for (const path of [`/${locale}`, `/${locale}/privacy`]) {
      payload.logger.info(`Revalidating frontend path: ${path}`);
      revalidatePath(path);
    }
  }
}

export const revalidateFrontend: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) revalidateFrontendPaths(payload);
  return doc;
};

export const revalidateFrontendAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) revalidateFrontendPaths(payload);
  return doc;
};

export const revalidateFrontendGlobal: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) revalidateFrontendPaths(payload);
  return doc;
};
