// Backup dati DB → JSON (no Docker, no CLI). Dump di tutte le tabelle public.
// Uso: node scripts/backup-db.mjs
import "dotenv/config";
import pg from "pg";
import { writeFileSync, mkdirSync } from "node:fs";

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

const { rows: tables } = await client.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
   ORDER BY table_name`,
);

const dump = {};
for (const { table_name } of tables) {
  const { rows } = await client.query(`SELECT * FROM "${table_name}"`);
  dump[table_name] = rows;
}

await client.end();

mkdirSync("backups", { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, "-");
const file = `backups/data-${ts}.json`;
writeFileSync(file, JSON.stringify(dump, null, 2), "utf8");

const totalRows = Object.values(dump).reduce((n, r) => n + r.length, 0);
console.log(`WROTE ${file}`);
console.log(`tables: ${tables.length}, rows: ${totalRows}`);
for (const [t, r] of Object.entries(dump)) {
  if (r.length) console.log(`  ${t}: ${r.length}`);
}
