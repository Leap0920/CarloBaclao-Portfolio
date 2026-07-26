import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Carlo Baclao - IT Student seeking opportunities",
  description: "Portfolio of Carlo Baclao, an IT student specializing in full stack development, IoT, and open-source projects.",
  keywords: ["Carlo Baclao", "IT Student", "Portfolio", "Web Development", "React", "Next.js", "IoT"],
  authors: [{ name: "Carlo Baclao" }],
  openGraph: {
    title: "Carlo Baclao - IT Student seeking opportunities",
    description: "Portfolio of Carlo Baclao, an IT student specializing in full stack development, IoT, and open-source projects.",
    type: "website",
    url: "https://carlobaclao.dev",
    siteName: "Carlo Baclao Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carlo Baclao - IT Student seeking opportunities",
    description: "Portfolio of Carlo Baclao, an IT student specializing in full stack development, IoT, and open-source projects.",
  },
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
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <script defer data-domain="carlobaclao.dev" src="https://plausible.io/js/script.js" />
      </head>
      <body className={`${inter.className} min-h-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
