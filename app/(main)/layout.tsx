import "../globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import SideBar from "@/components/ui/overview_sidebar";
import styles from "./styles.module.css";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Convenient Store",
  description: "Convenient Store Management Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className + " overflow-x-hidden bg-white"}>
        <SideBar className={styles["no-scrollbar"] + " z-10 bg-white"} />
        <div className="bg-slate-100 overflow-hidden ml-[64px] lg:ml-[200px]">
          {children}
        </div>
      </body>
    </html>
  );
}
