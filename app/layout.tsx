import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học Tốt Tiểu Học — Học chắc từng chặng",
  description: "Khóa học tiểu học giúp con hiểu bài, luyện tập đúng trọng tâm và tiến bộ mỗi ngày.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

