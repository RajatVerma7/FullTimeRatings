import type { MetadataRoute } from "next";
import { getTopRatedMatches } from "@/lib/queries/matches";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matchdb.app";
  const matches = await getTopRatedMatches();

  const matchUrls = matches.map((match) => ({
    url: `${baseUrl}/match/${match.slug}`,
    lastModified: new Date(match.matchDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/top-rated`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tournaments`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/lists`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    ...matchUrls,
  ];
}
