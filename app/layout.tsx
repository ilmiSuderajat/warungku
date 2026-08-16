import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento, Arimo } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "./components/ui/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "WarungKita",
  description: "belanja instan jadi mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sacramento.variable} ${arimo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BottomNav />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
