import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Импортируем компонент Шапки (убедись, что файл components/Header.tsx существует)
import Header from "@/components/Header"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Настраиваем SEO (заголовки вкладки браузера)
export const metadata: Metadata = {
  title: "HEGEL - Профессиональный электромонтаж",
  description: "Каталог электротехнической продукции: коробки, щитки, аксессуары. Официальный сайт.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Меняем язык сайта на русский
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* 4. Вставляем Шапку в самый верх */}
        <Header />
        
        {/* Это контент остальных страниц, который будет меняться */}
        {children}
      </body>
    </html>
  );
}