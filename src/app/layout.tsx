import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Building a Real-Time Shopping Assistant",
  description: "Turn Live video into instant purchases using object recognition",
  openGraph: {
    images: [
      {
        url: '/meta_image.png',
        width: 1200,
        height: 630,
        alt: 'Cerebrium Real-Time Shopping Assistant',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <Analytics />
      </body>
    </html>
  );
}
