import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
 return { name: "Aana", short_name: "Aana", description: "Technology articles, reviews and guides.", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#0071e3", icons: [{ src: "/brand/android-192.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/brand/android-512.png", sizes: "512x512", type: "image/png", purpose: "any" }] };
}
