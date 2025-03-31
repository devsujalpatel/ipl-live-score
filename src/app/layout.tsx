import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL Live Score",
  description: "Get IPL Live Scores",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-gray-900 to-indigo-900">
        {children}
      </body>
    </html>
  );
}
