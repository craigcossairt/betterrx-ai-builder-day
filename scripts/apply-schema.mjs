import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

function postgresUrlFromEnv(env) {
  const url = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || "";
  if (!url || url === "[SENSITIVE]") return null;
  if (!url.startsWith("postgres")) return null;
  return url;
}

const url = postgresUrlFromEnv(process.env);
if (!url) {
  console.log("skip schema: no postgres url in this environment");
  process.exit(0);
}

const sqlPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../supabase/migrations/0001_hospice.sql",
);
const sql = postgres(url, { ssl: "require", max: 1 });
try {
  await sql.unsafe(readFileSync(sqlPath, "utf8"));
  console.log("applied supabase/migrations/0001_hospice.sql");
} finally {
  await sql.end({ timeout: 5 });
}
