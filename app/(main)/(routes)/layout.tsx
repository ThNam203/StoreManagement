"use client";
import "@/app/globals.css";
import type { Metadata } from "next";
import SideBar from "@/components/ui/overview/overview_sidebar";
import no_scrollbar_style from "@/styles/no_scrollbar.module.css";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Open_Sans } from "next/font/google";
import Preloader from "@/components/ui/preloader";
import { useDispatch } from "react-redux";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Convenient Store",
  description: "Convenient Store Management Website",
  icons: ["/web_avatar.png"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState<boolean | null>(
    null,
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

  const handleShowPreloader = (show: boolean) => {
    if (show) dispatch(showPreloader());
    else dispatch(disablePreloader());
  };

  return (
    <div className={font.className + "  min-h-screen bg-slate-100"}>
      <SideBar
        showPreloader={handleShowPreloader}
        isSideBarCollapsed={isSideBarCollapsed}
        changeSideBarCollapsibility={changeSideBarCollapsibilityOnClick}
        className={cn(
          no_scrollbar_style["no-scrollbar"],
          "z-[9] bg-white shadow-md shadow-gray-300",
        )}
      />
      <div
        className={cn(
          "ml-[80px] bg-slate-100 py-2 pr-4 duration-150 ease-linear",
          isSideBarCollapsed ? "" : "lg:ml-[248px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
