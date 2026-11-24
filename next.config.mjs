/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DETALABS_NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      {
        source: "/stelvoice",
        destination: "/products/stelvoice",
        permanent: true,
      },
    ];
  },
  images: {
    // The shipped images are already compressed; avoid requiring a paid Images binding.
    unoptimized: process.env.CLOUDFLARE_BUILD === "1",
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
};
export default nextConfig;
