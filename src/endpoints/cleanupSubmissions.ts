import type { Endpoint, PayloadRequest } from "payload";

// Conservazione dei messaggi del form (Privacy Policy §06): cancellati dopo RETENTION_MONTHS.
// Enforcement automatico: Vercel Cron chiama GET /api/cron/cleanup-submissions (vedi vercel.json).
// Vercel Cron aggiunge in automatico l'header `Authorization: Bearer <CRON_SECRET>`; qui riusiamo
// la stessa guardia di `jobs.access.run` in payload.config.ts.
// NB: cambiando questo numero, aggiorna anche il testo §06 in privacy-content.ts (dichiarato = fatto).
export const RETENTION_MONTHS = 12;

function isAuthorized(req: PayloadRequest): boolean {
  // admin loggato: può lanciarlo a mano dall'API. Altrimenti: secret di Vercel Cron.
  if (req.user) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export const cleanupSubmissions: Endpoint = {
  path: "/cron/cleanup-submissions",
  method: "get",
  handler: async (req) => {
    if (!isAuthorized(req)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

    try {
      // operazione di sistema (cron) -> overrideAccess default true. delete-by-where cancella TUTTI
      // i match. form-submissions non ha hook di revalidation: la cancellazione non tocca le pagine.
      const result = await req.payload.delete({
        collection: "form-submissions",
        where: { createdAt: { less_than: cutoff.toISOString() } },
      });

      const deleted = Array.isArray(result?.docs) ? result.docs.length : 0;
      req.payload.logger.info(
        `[cleanup-submissions] deleted ${deleted} submission(s) older than ${RETENTION_MONTHS} months (cutoff ${cutoff.toISOString()})`,
      );

      return Response.json({ deleted, cutoff: cutoff.toISOString() });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      req.payload.logger.error(`[cleanup-submissions] failed: ${message}`);
      return Response.json({ error: "Cleanup failed" }, { status: 500 });
    }
  },
};
