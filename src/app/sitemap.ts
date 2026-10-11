import type { MetadataRoute } from "next";

const paths = [
  "/",
  "/about-us",
  "/employers",
  "/employers/request",
  "/jobs",
  "/job-categories",
  "/job-seeker-guide",
  "/recruitment-process",
  "/training-center",
  "/licenses-and-credentials",
  "/operation-flow",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/news",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `https://jewelrinku.com.bd${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
