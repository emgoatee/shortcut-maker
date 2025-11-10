import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shortcut Maker - AI-Powered Apple Shortcuts Guide",
  description:
    "Generate step-by-step instructions for building Apple Shortcuts. Describe what you want, get detailed build guides with action parameters and tips.",
  keywords: ["Apple Shortcuts", "iOS", "iPadOS", "macOS", "automation", "Shortcuts app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
