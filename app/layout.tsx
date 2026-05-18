import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Nic's Online Archive",
  description:
    "Nicholas Koh — creative technologist and product designer. Service design is the lens. Digital is the medium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-page font-sans text-white">{children}</body>
    </html>
  );
}
