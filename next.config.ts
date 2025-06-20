import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ⚠️ permite todos los dominios (solo para desarrollo)
      },
    ],
  },
};

export default nextConfig;
