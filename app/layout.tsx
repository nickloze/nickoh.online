import type { Metadata, Viewport } from "next";
import { EB_Garamond, Geist_Mono, Inter } from "next/font/google";
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

/* Geist Mono Light carries the PROBLEM / SOLUTION / APPROACH labels on the
   project pages (672:3003 and siblings) — a deliberate design font, not a
   system label, so it ships rather than falling back to Inter. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nickoh.online"),
  title: {
    default: "Nicholas Koh — Product Designer",
    /* project pages: "Refine — Nicholas Koh". Next announces route changes
       from the title, so each project gets its own. */
    template: "%s — Nicholas Koh",
  },
  description:
    "Hello! I'm Nicholas, a product designer who loves building experiences that simplify complex problems. I work best where form sharpens function, always hunting for the shortcut hiding within a long route",
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
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable} ${geistMono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
