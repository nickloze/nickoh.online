import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "./components/MotionProvider";

/* Inter carries every sans string on the site — tab labels, card rows,
   "Available"/"Work". The Figma frames set the tab labels in SF Pro; Nic
   chose Inter everywhere so the site reads the same on every platform. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* EB Garamond (regular + italic) carries the bio, the socials list and the
   italic "for" in the availability line. */
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nickoh.online"),
  title: "Nicholas Koh — Product Designer",
  description:
    "Hello! I'm Nicholas, a product designer who loves building experiences that simplify complex problems. I work best where form sharpens function, always hunting for the shortcut hiding within a long route, where I believe simple carries character",
  openGraph: {
    title: "Nicholas Koh — Product Designer",
    description:
      "A product designer who loves building experiences that simplify complex problems.",
    url: "https://nickoh.online",
    siteName: "nickoh.online",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0e0e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
