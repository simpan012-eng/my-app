import type { Metadata } from "next";
import { Geist, Bebas_Neue } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import { Suspense } from "react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KrökenKrew",
  description: "The official KrökenKrew website",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  weight: "400", // Bebas Neue finns bara i denna vikt
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${bebasNeue.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="fixed top-0 z-50 h-[64px] w-full bg-gray-900" />}>
            <Navbar />
          </Suspense>

          {/* PAGE CONTENT — pt-16 kompenserar för den fixerade navbaren (64px) */}
          <div className="pt-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}