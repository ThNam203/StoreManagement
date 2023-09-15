import {
  GanttChartSquare,
  BarChart3,
  ShoppingCart,
  ShoppingBag,
  Package,
  User,
  Contact,
  CalendarClock,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "./separator";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SideBarButton = (iconName: string, title: string) => {
  const iconSize = 16;
  const iconClasses = "m-auto lg:ml-8 lg:mr-4 group-hover:ml-8 group-hover:mr-4";
  let icon: JSX.Element;
  switch (iconName) {
    case "GanttChartSquare":
      icon = <GanttChartSquare size={iconSize} className={iconClasses} />;
      break;
    case "BarChart3":
      icon = <BarChart3 size={iconSize} className={iconClasses} />;
      break;
    case "ShoppingCart":
      icon = <ShoppingCart size={iconSize} className={iconClasses} />;
      break;
    case "ShoppingBag":
      icon = <ShoppingBag size={iconSize} className={iconClasses} />;
      break;
    case "Package":
      icon = <Package size={iconSize} className={iconClasses} />;
      break;
    case "User":
      icon = <User size={iconSize} className={iconClasses} />;
      break;
    case "Contact":
      icon = <Contact size={iconSize} className={iconClasses} />;
      break;
    case "CalendarClock":
      icon = <CalendarClock size={iconSize} className={iconClasses} />;
      break;
    case "Settings":
      icon = <Settings size={iconSize} className={iconClasses} />;
      break;
    case "LogOut":
      icon = <LogOut size={iconSize} className={iconClasses} />;
      break;
  }

  return (
    <div
      className={
        cn(
          "hover:text-blue-700 hover:bg-blue-100",
          title == "Logout" && "hover:text-red-700 hover:bg-red-200"
        ) +
        " w-5/6 flex justify-start items-center h-10 my-1 mx-auto" +
        " rounded-sm hover:cursor-pointer"
      }
    >
      {icon!}
      <p className="text-sm hidden lg:block group-hover:block">
        {title}

        {
          /* "ORDERS section needs an aditional which tells how much orders is being processed" */
          title === "Orders" ? (
            /* leading-[1.75rem] == h-7 value, which is to align the text vertically */
            <span className="w-7 h-7 ml-6 leading-[1.75rem] rounded-full bg-blue-800 text-white text-sm text-center inline-block">
              10
            </span>
          ) : null
        }
      </p>
    </div>
  );
};

const SideBar = () => {
  return (
    <section className="flex flex-col items-center w-[64px] lg:min-w-[200px] lg:flex-[0.2] group hover:w-[200px]">
      <div className="flex flex-row items-center my-4 mx-auto">
        {/* <img src="/static/web_avatar.png" alt="web avatar" className="w-[32px] h-[32px]"/> */}
        <Image
          src="/static/web_avatar.png"
          alt="web avatar"
          width={32}
          height={32}
        />
        <h1 className="ml-2 hidden font-semibold text-xl tracking-tight lg:block group-hover:block">
          VIRTUAL STORE
        </h1>
      </div>

      {SideBarButton("GanttChartSquare", "Overview")}
      {SideBarButton("BarChart3", "Analytics")}
      {SideBarButton("ShoppingCart", "Orders")}
      {SideBarButton("ShoppingBag", "Products")}
      {SideBarButton("Package", "Inventory")}
      {SideBarButton("User", "Customers")}
      {SideBarButton("Contact", "Employees")}
      {SideBarButton("CalendarClock", "Events")}
      <Separator className="w-5/6 my-[8px]" />
      {SideBarButton("Settings", "Settings")}
      {SideBarButton("LogOut", "Logout")}
    </section>
  );
};

export default SideBar;
