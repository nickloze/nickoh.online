import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

/* Geist is the one typeface the shipped design uses (see DESIGN handoff). It's a
   variable font, so no explicit weight list — the full 100–900 axis is loaded. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nicholas Koh — Creative Technologist",
  description:
    "Nicholas Koh — Creative Technologist and Product/Service Designer from Singapore. Service design is the lens, digital is the medium. Form follows function.",
};

/* Dark interface; viewportFit:"cover" lets env(safe-area-inset-*) resolve on
   the @mobile frame (iPhone Dynamic Island). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
