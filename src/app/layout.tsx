import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barefoot Mary — An Investigative History Podcast",
  description:
    "Half-remembered events, overlooked histories, and the persistent local legends that shape how communities understand themselves. Rooted in Pensacola and the wider Gulf Coast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
