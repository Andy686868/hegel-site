import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // РАЗРЕШАЕМ SVG КАРТИНКИ
    dangerouslyAllowSVG: true, 
    // Отключаем строгую защиту Content-Security-Policy для картинок (для разработки)
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;