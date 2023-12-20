"use client";

import "../globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "react-redux";
import { Open_Sans } from "next/font/google";
import { ReactNode, useEffect, useState } from "react";
const font = Open_Sans({ subsets: ["latin"] });
import store from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Preloader from "@/components/ui/preloader";
import { Toaster } from "@/components/ui/toaster";
import StaffService from "@/services/staff_service";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={cn(font.className)}>
          <GlobalState>{children}</GlobalState>
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}

const GlobalState = ({ children }: { children: React.ReactNode }) => {
  const [gotUserInfo, setGotUserInfo] = useState(false);
  useEffect(() => {
    const getUserInfo = async () => {
      // TODO: get user info
      setGotUserInfo(true);
    };
    getUserInfo();
  }, []);

  if (!gotUserInfo) return <GlobalPreloader />;
  return (
    <>
      <GlobalPreloader />
      {children}
    </>
  );
};

const GlobalPreloader = () => {
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
  return preloaderVisibility ? <Preloader /> : null;
};
