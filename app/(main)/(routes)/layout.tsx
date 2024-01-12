"use client";
import "@/app/globals.css";
import SideBar from "@/components/ui/overview/overview_sidebar";
import { cn } from "@/lib/utils";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import no_scrollbar_style from "@/styles/no_scrollbar.module.css";
import { Open_Sans } from "next/font/google";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const font = Open_Sans({ subsets: ["latin"] });

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

  const bgGradientMorning = "linear-gradient(45deg,#85FFBD,#FFFB7D)";
  const bgGradientAfternoon = "linear-gradient(62deg,#4158D0,#C850C0,#FFCC70)";
  const bgGradientNight = "linear-gradient(90deg,#00DBDE,#FC00FF)";
  let bgGradient = "";

  if (new Date().getHours() >= 6 && new Date().getHours() < 12)
    bgGradient = bgGradientMorning;
  else if (new Date().getHours() >= 12 && new Date().getHours() < 18)
    bgGradient = bgGradientAfternoon;
  else if (new Date().getHours() >= 18 && new Date().getHours() < 24)
    bgGradient = bgGradientNight;

  return (
    <div
      className={cn(font.className, "min-h-screen bg-slate-100")}
      // style={{
      //   backgroundImage: bgGradientMorning,
      //   backgroundSize: "400%",
      // }}
    >
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
          "ml-[80px] bg-transparent py-2 pr-4 duration-150 ease-linear",
          isSideBarCollapsed ? "" : "lg:ml-[248px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
