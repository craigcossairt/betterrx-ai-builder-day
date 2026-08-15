import { describe, expect, it } from "vitest";
import { postgresUrlFromEnv } from "@/lib/schema-env";

describe("postgresUrlFromEnv", () => {
  it("prefers the direct URL and rejects a redacted placeholder", () => {
    expect(
      postgresUrlFromEnv({
        POSTGRES_URL_NON_POOLING: "postgresql://db.example/postgres",
        POSTGRES_URL: "postgresql://pool.example/postgres",
      }),
    ).toBe("postgresql://db.example/postgres");
    expect(
      postgresUrlFromEnv({ POSTGRES_URL: "[SENSITIVE]" }),
    ).toBeNull();
  });
});
