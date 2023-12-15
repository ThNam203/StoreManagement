"use client";

import "../globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "react-redux";
import { Open_Sans } from "next/font/google";
import { ReactNode, useEffect } from "react";
const font = Open_Sans({ subsets: ["latin"] });
import store from "@/store";
import { useAppSelector } from "@/hooks";
import Preloader from "@/components/ui/preloader";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={cn(font.className)}>
          <GlobalPreloader/>
          {children}
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}

const GlobalPreloader = () => {
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
  return preloaderVisibility ? <Preloader /> : null;
};
