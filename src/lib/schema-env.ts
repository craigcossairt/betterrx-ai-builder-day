export function postgresUrlFromEnv(
  env: Record<string, string | undefined>,
): string | null {
  const url = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || "";
  if (!url || url === "[SENSITIVE]") return null;
  if (!url.startsWith("postgres")) return null;
  return url;
}
