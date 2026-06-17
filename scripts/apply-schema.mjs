/**
 * Apply database schema to Supabase Postgres.
 *
 * Usage:
 *   DATABASE_URL="postgresql://postgres.[ref]:[password]@...:5432/postgres" node scripts/apply-schema.mjs
 *
 * Get connection string from Supabase → Settings → Database → URI (direct, port 5432)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "../supabase/migrations/001_initial_schema.sql");

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Missing DATABASE_URL. Set your Supabase Postgres connection string.");
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, "utf8");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected. Applying schema...");
    await client.query(sql);
    console.log("Schema applied successfully.");

    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log("\nTables created:");
    rows.forEach((r) => console.log(`  - ${r.table_name}`));
  } catch (err) {
    console.error("Failed to apply schema:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
