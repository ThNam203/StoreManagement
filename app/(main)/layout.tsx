import "../globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import SideBar from "@/components/ui/overview/overview_sidebar";
import no_scrollbar_style from "../../styles/no_scrollbar.module.css";
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
      <body className={font.className + "  bg-slate-100"}>
        <SideBar className={no_scrollbar_style["no-scrollbar"] + " z-10 bg-white"} />
        <div className="bg-slate-100 ml-[80px] lg:ml-[216px] py-4 pr-4">
          {children}
        </div>
      </body>
    </html>
  );
}
