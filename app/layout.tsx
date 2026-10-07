import type { Metadata } from "next";
import "./globals.css";
import { BRAND } from "@/lib/brand";

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
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Code+Pro:wght@400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
