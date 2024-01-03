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
import ProfileService from "@/services/profileService";
import { setProfile } from "@/reducers/profileReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { Providers } from "./home/providers";
import Footer from "./home/footer";
import Header from "./home/header";
import ScrollToTop from "./home/scroll-to-top";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={cn(font.className)}>
          <GlobalState>
            <Providers>
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </Providers>
          </GlobalState>
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}

const GlobalState = ({ children }: { children: React.ReactNode }) => {
  const [gotUserInfo, setGotUserInfo] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getUserInfo = async () => {
      const profile = await ProfileService.getProfile();
      const convertedProfile = convertStaffReceived(profile.data);
      dispatch(setProfile(convertedProfile));
    };

    getUserInfo()
      .then(() => {})
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => setGotUserInfo(true));
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
