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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark')`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full bg-slate-900 text-slate-100 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
