import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowBro - AI-Powered Customer Growth",
  description: "Automate conversations and drive sales conversions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}