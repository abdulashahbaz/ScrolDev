import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/customers";
import { posts } from "@/content/posts";
import { site } from "@/content/site";
import { solutions } from "@/content/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/product",
    "/pricing",
    "/customers",
    "/changelog",
    "/company",
    "/contact",
    "/security",
    "/blog",
    "/legal",
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...caseStudies.map((c) => `/customers/${c.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
