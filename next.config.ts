import type { NextConfig } from "next";

const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  images: {
    // allow local static outputs from velite under /static
    remotePatterns: [],
  },
  experimental: {
    // If you use typedRoutes later, you can enable it
    // typedRoutes: true,
  },
};

export default nextConfig;
