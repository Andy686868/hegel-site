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
        protocol: 'http',
        hostname: '127.0.0.1', // Добавлено для совместимости с локальным API
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