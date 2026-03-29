import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Carlo Baclao - Full Stack Developer",
  description: "Professional portfolio of Carlo Baclao, showcasing expertise in full stack development, projects, and achievements.",
  keywords: ["Carlo Baclao", "Full Stack Developer", "Portfolio", "Web Development", "React", "Next.js"],
  authors: [{ name: "Carlo Baclao" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} min-h-full bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
