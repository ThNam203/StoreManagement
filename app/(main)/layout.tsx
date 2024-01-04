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
import StoreService from "@/services/storeService";
import { setStoreInformation } from "@/reducers/storeReducer";
import RoleService from "@/services/role_service";
import { setRoles } from "@/reducers/roleReducer";
import { convertRoleReceived } from "@/utils/roleSettingApiUtils";

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
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getGlobalData = async () => {
      const profile = await ProfileService.getProfile();
      const convertedProfile = convertStaffReceived(profile.data);
      dispatch(setProfile(convertedProfile));

      const storeInfo = await StoreService.getStoreInformation();
      dispatch(setStoreInformation(storeInfo.data));

      const rolesCall = await RoleService.getAllRoles();
      const convertedRoles = rolesCall.data.map(convertRoleReceived);
      dispatch(setRoles(convertedRoles));
    };

    getGlobalData()
      .then(() => setGotUserInfo(true))
      .catch((e) => axiosUIErrorHandler(e, toast, router));
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
