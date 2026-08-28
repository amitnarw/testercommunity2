import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Public SEO page redirects
      { source: "/community-hub", destination: "/seo/handshake-testing", permanent: true },
      { source: "/free-testing", destination: "/seo/handshake-testing", permanent: true },

      // Authenticated dashboard redirects
      { source: "/community-dashboard", destination: "/app/handshake-testing", permanent: true },
      { source: "/community-dashboard/:path*", destination: "/app/handshake-testing/:path*", permanent: true },
      { source: "/dashboard", destination: "/app/pro-testing", permanent: true },
      { source: "/dashboard/:path*", destination: "/app/pro-testing/:path*", permanent: true },

      // Sample page redirects
      { source: "/samples/free-community-hub", destination: "/samples/handshake-testing", permanent: true },
      { source: "/samples/free-testing", destination: "/samples/handshake-testing", permanent: true },
      { source: "/samples/paid-dashboard", destination: "/samples/pro-testing", permanent: true },

      // S10: My Tasks page removed (hub Running tab replaces it); Elite Badge
      // moved to /profile , preserve old bookmarks.
      { source: "/app/handshake-testing/my-tasks", destination: "/app/handshake-testing", permanent: true },
      { source: "/app/handshake-testing/elite-badge", destination: "/profile#elite-badge", permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
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
