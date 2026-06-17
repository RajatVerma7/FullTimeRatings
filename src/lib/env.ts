/** Resolve Postgres URL from Vercel/Supabase integration env vars */
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.SUPABASE_DATABASE_URL
  );
}

export function isDatabaseConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url?.includes("supabase") || url?.includes("postgres"));
}
