import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Public SEO page redirects
      { source: "/community-hub", destination: "/seo/free-testing", permanent: true },
      { source: "/free-testing", destination: "/seo/free-testing", permanent: true },

      // Authenticated dashboard redirects
      { source: "/community-dashboard", destination: "/app/free-testing", permanent: true },
      { source: "/community-dashboard/:path*", destination: "/app/free-testing/:path*", permanent: true },
      { source: "/dashboard", destination: "/app/pro-testing", permanent: true },
      { source: "/dashboard/:path*", destination: "/app/pro-testing/:path*", permanent: true },

      // Sample page redirects
      { source: "/samples/free-community-hub", destination: "/samples/free-testing", permanent: true },
      { source: "/samples/paid-dashboard", destination: "/samples/pro-testing", permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
