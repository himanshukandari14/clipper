import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";

export const metadata: Metadata = {
  title: "Podcast Clipper",
  description: "Podcast Clipper",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const script = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${script.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
