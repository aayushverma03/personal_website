/** @type {import('next').NextConfig} */
const prelegalBackendUrl =
  process.env.PRELEGAL_BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/prelegal/:path*",
        destination: `${prelegalBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
