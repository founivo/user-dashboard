import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Founivo — Find Your Founder",
  description: "Discover and connect with verified startup founders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
