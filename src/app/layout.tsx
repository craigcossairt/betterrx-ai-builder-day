import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import { DemoChrome } from "@/ui/chrome/DemoChrome";
import { PwaRegister } from "@/ui/PwaRegister";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BetterRX DME",
  description: "Hospice-first DME ordering and visibility",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BetterRX DME",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/brand/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3868A8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Suspense>
          <DemoChrome />
        </Suspense>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
