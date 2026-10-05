import type { Metadata } from "next";
import { Merriweather, Source_Sans_3, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const displaySerif = Merriweather({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const uiSans = Source_Sans_3({
  variable: "--font-ui-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const uiMono = Source_Code_Pro({
  variable: "--font-ui-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Scaffold OS · Scaffold Operating System",
    template: "%s · Scaffold OS",
  },
  description:
    "Zero-data Scaffold OS — build, configure, and publish courses from an empty catalog.",
  icons: {
    icon: BRAND.system.favicon,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${uiSans.variable} ${uiMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
