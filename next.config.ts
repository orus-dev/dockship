import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ssh2", "docker-modem", "dockerode"],
};

export default nextConfig;
