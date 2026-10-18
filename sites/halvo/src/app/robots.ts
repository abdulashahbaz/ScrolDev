import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Indexable on purpose: every page discloses that Halvo is a ScrolDev concept
// (the badge, the footer and /legal), and a clean SEO audit is part of the pitch.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
