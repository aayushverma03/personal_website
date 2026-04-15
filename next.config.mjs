/** @type {import('next').NextConfig} */
const prelegalBackendUrl =
  process.env.PRELEGAL_BACKEND_URL || "http://127.0.0.1:8000";
const ehsBackendUrl =
  process.env.EHS_BACKEND_URL || "http://127.0.0.1:8001";

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/prelegal/:path*",
        destination: `${prelegalBackendUrl}/api/:path*`,
      },
      {
        source: "/api/ehs/:path*",
        destination: `${ehsBackendUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/verityEHS",
        destination: "/ai-projects/verity-ehs",
        permanent: false,
      },
      {
        source: "/verityEHS/:path*",
        destination: "/ai-projects/verity-ehs/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
