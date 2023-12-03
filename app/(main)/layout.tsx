"use client";

import "../globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "react-redux";
import { Open_Sans } from "next/font/google";
import { ReactNode, useEffect } from "react";
const font = Open_Sans({ subsets: ["latin"] });
import store from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Preloader from "@/components/ui/preloader";
import { Toaster } from "@/components/ui/toaster";
import { setProducts } from "@/reducers/productsReducer";
import ProductService from "@/services/product_service";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import { setBrands } from "@/reducers/productBrandsReducer";
import { setLocations } from "@/reducers/productLocationsReducer";
import { setProperties } from "@/reducers/productPropertiesReducer";
import { setGroups } from "@/reducers/productGroupsReducer";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import { convertStaffReceived } from "@/utils";
import { useRouter } from "next/navigation";
import CustomerService from "@/services/customer_service";
import { setCustomerGroup } from "@/reducers/customerGroupsReducer";
import { setCustomers } from "@/reducers/customersReducer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={cn(font.className)}>
          <GlobalPreloader />
          {children}
          <Toaster />
        </body>
      </html>
    </Provider>
  );
}

const GlobalPreloader = () => {
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data));

        const brandsResult = await ProductService.getAllBrands();
        dispatch(setBrands(brandsResult.data));

        const locationsResult = await ProductService.getAllLocations();
        dispatch(setLocations(locationsResult.data));

        const propertiesResult = await ProductService.getAllProperties();
        dispatch(setProperties(propertiesResult.data));

        const groupsResult = await ProductService.getAllGroups();
        dispatch(setGroups(groupsResult.data));

        const customers = await CustomerService.getAllCustomers();
        dispatch(setCustomers(customers.data))

        const customerGroups = await CustomerService.getAllCustomerGroups();
        dispatch(setCustomerGroup(customerGroups.data))

        const staffResult = await StaffService.getAllStaffs();
        const convertedStaffs = staffResult.data.map((staff) =>
          convertStaffReceived(staff)
        );
        dispatch(setStaffs(convertedStaffs));

        dispatch(disablePreloader());
      } catch (error) {
        // router.push("/login")
        dispatch(disablePreloader());
        axiosUIErrorHandler(error, toast);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return preloaderVisibility ? <Preloader /> : null;
};
