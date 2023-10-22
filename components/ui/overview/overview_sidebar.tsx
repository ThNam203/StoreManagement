"use client";
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
  UserCog,
  Wrench,
  MenuSquare,
  CalendarRange,
  Boxes,
  Group,
  Receipt,
  Users,
  User2,
  Truck,
  ArrowLeftCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { Button } from "../button";
import React, { useState } from "react";

const LucideIcons = (iconName: string, isCollapsed: boolean | null) => {
  const iconSize = 16;
  const iconClasses = cn(
    "m-auto",
    isCollapsed == null ? "lg:ml-4 lg:mr-4" : "",
    isCollapsed == true ? "" : isCollapsed == false ? "ml-4 mr-4" : ""
  );
  let icon: JSX.Element;
  switch (iconName) {
    case "GanttChartSquare":
      return <GanttChartSquare size={iconSize} className={iconClasses} />;
    case "Receipt":
      return <Receipt size={iconSize} className={iconClasses} />;
    case "Users":
      return <Users size={iconSize} className={iconClasses} />;
    case "BarChart3":
      return <BarChart3 size={iconSize} className={iconClasses} />;
    case "ShoppingCart":
      return <ShoppingCart size={iconSize} className={iconClasses} />;
    case "ShoppingBag":
      return <ShoppingBag size={iconSize} className={iconClasses} />;
    case "Package":
      return <Package size={iconSize} className={iconClasses} />;
    case "User":
      return <User size={iconSize} className={iconClasses} />;
    case "Contact":
      return <Contact size={iconSize} className={iconClasses} />;
    case "CalendarClock":
      return <CalendarClock size={iconSize} className={iconClasses} />;
    case "Settings":
      return <Settings size={iconSize} className={iconClasses} />;
    case "LogOut":
      return <LogOut size={iconSize} className={iconClasses} />;
    case "UserCog":
      return <UserCog size={iconSize} className={iconClasses} />;
    case "Wrench":
      return <Wrench size={iconSize} className={iconClasses} />;
    case "MenuSquare":
      return <MenuSquare size={iconSize} className={iconClasses} />;
    case "CalendarRange":
      return <CalendarRange size={iconSize} className={iconClasses} />;
    case "Boxes":
      return <Boxes size={iconSize} className={iconClasses} />;
    case "Group":
      return <Group size={iconSize} className={iconClasses} />;
    case "User2":
      return <User2 size={iconSize} className={iconClasses} />;
    case "Truck":
      return <Truck size={iconSize} className={iconClasses} />;
  }
};

const SideBarButton = (
  iconName: string,
  title: string,
  className: string = "",
  isCollapsed: boolean | null
) => {
  const icon = LucideIcons(iconName, isCollapsed);

  return (
    <div
      className={cn(
        "hover:text-blue-700 hover:bg-blue-100",
        title == "Logout" && "hover:text-red-700 hover:bg-red-200",
        " w-5/6 flex justify-start items-center min-h-[2.5rem] h-10 my-1" +
          " rounded-sm hover:cursor-pointer ",
        className
      )}
    >
      {icon!}
      <p
        className={cn(
          "text-sm",
          isCollapsed == null ? "hidden lg:block" : "",
          isCollapsed == true ? "hidden" : isCollapsed == false ? "block" : ""
        )}
      >
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

const SideBarAccordion = (
  iconName: string,
  title: string,
  buttons: JSX.Element[],
  isCollapsed: boolean | null
) => {
  return (
    <Accordion
      type="single"
      collapsible={true}
      className="w-5/6 bg-slate-100 rounded-xl mx-2 my-1 hover:cursor-pointer"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          showArrowFunc={cn(
            "mr-2",
            isCollapsed == null ? "hidden lg:block" : "",
            isCollapsed == true ? "hidden" : isCollapsed == false ? "block" : ""
          )}
          className={cn(
            "justify-center gap-2 h-12",
            isCollapsed == null ? "justify-center lg:justify-start" : "",
            isCollapsed == true
              ? "justify-center"
              : isCollapsed == false
              ? "justify-start"
              : "",
          )}
        >
          <div className="flex flex-row w-full">
            {LucideIcons(iconName, isCollapsed)}
            <p
              className={cn(
                "text-sm font-normal",
                isCollapsed == null ? "hidden lg:block" : "",
                isCollapsed == true
                  ? "hidden"
                  : isCollapsed == false
                  ? "block"
                  : ""
              )}
            >
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mx-2">{...buttons}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const SideBar = ({
  className,
  changeSideBarCollapsibility,
  isSideBarCollapsed: isCollapsed,
}: {
  className: string;
  changeSideBarCollapsibility: () => void;
  isSideBarCollapsed: boolean | null;
}) => {
  return (
    <div>
      <ArrowLeftCircle
        height={20}
        width={20}
        color="#FFFFFF"
        fill="rgb(96 165 250)"
        onClick={() => changeSideBarCollapsibility()}
        className={cn(
          "fixed rounded-full translate-x-[-50%] z-20 top-8 ease-linear duration-150 hover:cursor-pointer",
          isCollapsed == null
            ? "max-lg:rotate-180 left-[64px] lg:left-[200px]"
            : "",
          isCollapsed == true
            ? "left-[64px] rotate-180"
            : isCollapsed == false
            ? "left-[200px]"
            : ""
        )}
      />
      <div
        className={cn(
          "flex flex-col fixed left-0 top-0 h-full overflow-y-scroll items-center ease-linear duration-200",
          className,
          isCollapsed == null ? "w-[64px] lg:w-[200px]" : "",
          isCollapsed == true
            ? "w-[64px]"
            : isCollapsed == false
            ? "w-[200px]"
            : ""
        )}
      >
        <div className="flex flex-row w-full items-center justify-center relative overflow-y-visible">
          {/* <img src="/static/web_avatar.png" alt="web avatar" className="w-[32px] h-[32px]"/> */}
          <Image
            src="/web_avatar.png"
            alt="web avatar"
            width={48}
            height={48}
          />
          <h1
            className={cn(
              "ml-2 font-bold text-xl tracking-tight",
              isCollapsed == null ? "hidden lg:block" : "",
              isCollapsed == true
                ? "hidden"
                : isCollapsed == false
                ? "block"
                : ""
            )}
          >
            MSTORE
          </h1>
        </div>
        <Accordion
          type="single"
          collapsible={true}
          className="w-5/6 bg-slate-100 rounded-xl mx-2 my-2 px-2 hover:cursor-pointer"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger
              showArrowFunc={cn(
                isCollapsed == null ? "hidden lg:block" : "",
                isCollapsed == true
                  ? "hidden"
                  : isCollapsed == false
                  ? "block"
                  : ""
              )}
              className="gap-2"
            >
              <Avatar className="w-9 h-9 border-2 border-dashed border-blue-500 hover:border-solid">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  isCollapsed == null ? "hidden lg:block" : "",
                  isCollapsed == true
                    ? "hidden"
                    : isCollapsed == false
                    ? "block"
                    : ""
                )}
              >
                <h4 className="font-medium text-sm max-w-[85px] text-start break-words">
                  Nam Huynh
                </h4>
                <p className="text-xs opacity-75 text-start flex-wrap">Staff</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {SideBarButton("UserCog", "Edit profile", "w-full", isCollapsed)}
              {SideBarButton("LogOut", "Logout", "w-full", isCollapsed)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {SideBarAccordion(
          "Receipt",
          "Sales",
          [SideBarButton("ShoppingCart", "Orders", "!w-full", isCollapsed)],
          isCollapsed
        )}

        {SideBarAccordion(
          "Users",
          "Partners",
          [
            SideBarButton("User2", "Customer group", "!w-full", isCollapsed),
            SideBarButton("User", "Customers", "!w-full", isCollapsed),
            SideBarButton("Truck", "Supplier", "!w-full", isCollapsed),
          ],
          isCollapsed
        )}

        {SideBarButton("Package", "Warehouse", "", isCollapsed)}
        {SideBarButton("BarChart3", "Report", "", isCollapsed)}

        {SideBarAccordion(
          "ShoppingBag",
          "Products",
          [
            SideBarButton("Group", "Product group", "!w-full", isCollapsed),
            SideBarButton("Boxes", "Products", "!w-full", isCollapsed),
          ],
          isCollapsed
        )}

        {SideBarAccordion(
          "Contact",
          "Staff",
          [
            SideBarButton("UserCog", "Staff group", "!w-full", isCollapsed),
            SideBarButton(
              "MenuSquare",
              "Staff account",
              "!w-full",
              isCollapsed
            ),
            SideBarButton("Wrench", "Role setting", "!w-full", isCollapsed),
            SideBarButton(
              "CalendarRange",
              "Work manage",
              "!w-full",
              isCollapsed
            ),
          ],
          isCollapsed
        )}

        {SideBarButton("Settings", "Settings", "", isCollapsed)}
      </div>
    </div>
  );
};

export default SideBar;
