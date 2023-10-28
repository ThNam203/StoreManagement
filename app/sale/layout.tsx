import { Metadata } from "next";
import "../globals.css";
import { Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(font.className)}>{children}</body>
    </html>
  );
}