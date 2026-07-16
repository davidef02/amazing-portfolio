import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from "payload";
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

// Il sito è single-page e statico (SSG: /en, /it). Ogni contenuto CMS finisce in quelle
// due pagine, quindi su ogni modifica/eliminazione rigenero on-demand entrambe le locale:
// le pagine restano statiche (servite dalla CDN) ma riflettono le modifiche admin senza
// redeploy. Il guard `disableRevalidate` permette a seed/script di saltare la rigenerazione.
function revalidateFrontendPaths(payload: Payload) {
  for (const locale of locales) {
    payload.logger.info(`Revalidating frontend path: /${locale}`);
    revalidatePath(`/${locale}`);
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
