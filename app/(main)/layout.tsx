"use client";
import "../globals.css";
import type { Metadata } from "next";
import SideBar from "@/components/ui/overview/overview_sidebar";
import no_scrollbar_style from "../../styles/no_scrollbar.module.css";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Open_Sans } from "next/font/google";
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
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState<boolean | null>(
    null
  );
  const [isWindowLarge, setIsWindowLarge] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) setIsWindowLarge(false);
    else setIsWindowLarge(true);

    const screenObserver = (e: MediaQueryListEvent) => {
      setIsWindowLarge(!e.matches);
    };

    const mql = window.matchMedia("(max-width: 1023px)");
    mql.addEventListener("change", screenObserver);

    return () => {
      mql.removeEventListener("change", screenObserver);
    };
  }, []);

  const changeSideBarCollapsibilityOnClick = () => {
    if (isSideBarCollapsed == null) {
      if (isWindowLarge) setIsSideBarCollapsed(true);
      else setIsSideBarCollapsed(false);
    } else setIsSideBarCollapsed((prev) => !prev);
  };

  return (
      <div className={font.className + "  bg-slate-100 min-h-screen"}>
        <SideBar
          isSideBarCollapsed={isSideBarCollapsed}
          changeSideBarCollapsibility={changeSideBarCollapsibilityOnClick}
          className={cn(
            no_scrollbar_style["no-scrollbar"],
            "z-[9] bg-white shadow-gray-300 shadow-md")
          }
        />
        <div
          className={cn(
            "bg-slate-100 ml-[80px] py-2 pr-4 ease-linear duration-150",
            isSideBarCollapsed ? "" : "lg:ml-[248px]"
          )}
        >
          {children}
        </div>
      </div>
  );
}
