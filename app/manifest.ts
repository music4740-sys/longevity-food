import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "International Longevity Food",
    short_name: "ILF",
    description: "세계 장수 지역의 식단, 7일 리셋 플랜",
    start_url: "/",
    display: "standalone",
    background_color: "#100d0a",
    theme_color: "#5b6b4a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
