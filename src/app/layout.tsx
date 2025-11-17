import type { Metadata } from "next";
import { Barlow_Condensed } from 'next/font/google';
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
});

export const metadata: Metadata = {
  title: "Crave - Discover, Eat, Share",
  description: "Your food-first video app. Real videos. Real food.",
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} antialiased`} style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
        {children}
      </body>
    </html>
  );
}

