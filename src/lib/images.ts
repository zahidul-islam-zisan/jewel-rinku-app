/**
 * Photographs copied from the current Jewel Rinku Enterprise website
 * (jewelrinku.com.bd). They are company-published assets, not stock photos.
 */
export const images = {
  logoWhite: {
    src: "/images/logo-white.png",
    alt: "Jewel Rinku Enterprise",
  },
  logoBlack: {
    src: "/images/logo-black.png",
    alt: "Jewel Rinku Enterprise",
  },
  hero: {
    src: "/images/hero-office.jpg",
    alt: "Jewel Rinku Enterprise Limited office signboard, Moynertek, Uttarkhan, Dhaka.",
  },
  heroSecondary: {
    src: "/images/hero-slide-2.jpg",
    alt: "Jewel Rinku Enterprise premises, from the company homepage.",
  },
  about: {
    src: "/images/about.webp",
    alt: "Photograph from the Jewel Rinku Enterprise About Us page.",
  },
  aboutBg: {
    src: "/images/about-bg.webp",
    alt: "About page background photograph from jewelrinku.com.bd.",
  },
  mdPortrait: {
    src: "/images/md-portrait.png",
    alt: "Md. Rezaul Karim, Managing Director, Jewel Rinku Enterprise.",
  },
  consultation: {
    src: "/images/md-portrait.png",
    alt: "Md. Rezaul Karim, Managing Director, Jewel Rinku Enterprise.",
  },
  training: {
    src: "/images/training-1.webp",
    alt: "Training programme at the Jewel Rinku Enterprise training centre.",
  },
  office: {
    src: "/images/about.webp",
    alt: "Photograph from the Jewel Rinku Enterprise About Us page.",
  },
  officeBuilding: {
    src: "/images/office-building.jpg",
    alt: "Jewel Rinku Enterprise office building, from the company website.",
  },
  workers: {
    src: "/images/manpower.webp",
    alt: "Workforce photograph published on jewelrinku.com.bd.",
  },
  facility: {
    src: "/images/facility.webp",
    alt: "Facility photograph published on jewelrinku.com.bd.",
  },
  electrical: {
    src: "/images/electrical-1.webp",
    alt: "Electrical section at the Jewel Rinku Enterprise training centre.",
  },
  welding: {
    src: "/images/training-3.webp",
    alt: "Training programme at the Jewel Rinku Enterprise training centre.",
  },
  hospitality: {
    src: "/images/training-2.webp",
    alt: "Training programme at the Jewel Rinku Enterprise training centre.",
  },
  manufacturing: {
    src: "/images/tiles-1.webp",
    alt: "Tiles mason training at the Jewel Rinku Enterprise training centre.",
  },
  gallery: [
    { src: "/images/training-1.webp", alt: "Training programme" },
    { src: "/images/training-2.webp", alt: "Training programme" },
    { src: "/images/training-3.webp", alt: "Training programme" },
    { src: "/images/training-4.webp", alt: "Training programme" },
    { src: "/images/training-5.webp", alt: "Training programme" },
    { src: "/images/office-1.webp", alt: "Office" },
    { src: "/images/office-2.webp", alt: "Office" },
    { src: "/images/training-office.webp", alt: "Training office" },
    { src: "/images/electrical-1.webp", alt: "Electrical section" },
    { src: "/images/tiles-1.webp", alt: "Tiles mason" },
  ],
} as const;

export type ImageKey = Exclude<keyof typeof images, "gallery">;
