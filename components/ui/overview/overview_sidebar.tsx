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
  Grid3x3,
  Eye,
  Box,
  PenSquare,
  ArrowLeftRight,
  Undo,
  BaggageClaim,
  ShoppingBasket,
  ArrowUpSquare,
  PackageX,
  PieChart,
  FileBarChart2,
  Percent,
  PercentCircle,
  Banknote,
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
import Link from "next/link";

enum IconNames {
  GanttChartSquare,
  Receipt,
  Users,
  BarChart3,
  ShoppingCart,
  Grid3X3,
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
  User2,
  Truck,
  Eye,
  Box,
  PenSquare,
  ArrowLeftRight,
  Undo,
  BaggageClaim,
  ShoppingBasket,
  ArrowUpSquare,
  PackageX,
  PieChart,
  FileBarChart2,
  Percent,
  PercentCircle,
  BankNote,
}

const LucideIcons = (iconName: IconNames, isCollapsed: boolean | null) => {
  const iconSize = 16;
  const iconClasses = cn(
    "m-auto",
    isCollapsed == null ? "lg:ml-4 lg:mr-4" : "",
    isCollapsed == true ? "" : isCollapsed == false ? "ml-4 mr-4" : "",
  );
  let icon: JSX.Element;
  switch (iconName) {
    case IconNames.GanttChartSquare:
      return <GanttChartSquare size={iconSize} className={iconClasses} />;
    case IconNames.Receipt:
      return <Receipt size={iconSize} className={iconClasses} />;
    case IconNames.Users:
      return <Users size={iconSize} className={iconClasses} />;
    case IconNames.BarChart3:
      return <BarChart3 size={iconSize} className={iconClasses} />;
    case IconNames.ShoppingCart:
      return <ShoppingCart size={iconSize} className={iconClasses} />;
    case IconNames.Grid3X3:
      return <Grid3x3 size={iconSize} className={iconClasses} />;
    case IconNames.ShoppingBag:
      return <ShoppingBag size={iconSize} className={iconClasses} />;
    case IconNames.Package:
      return <Package size={iconSize} className={iconClasses} />;
    case IconNames.User:
      return <User size={iconSize} className={iconClasses} />;
    case IconNames.Contact:
      return <Contact size={iconSize} className={iconClasses} />;
    case IconNames.CalendarClock:
      return <CalendarClock size={iconSize} className={iconClasses} />;
    case IconNames.Settings:
      return <Settings size={iconSize} className={iconClasses} />;
    case IconNames.LogOut:
      return <LogOut size={iconSize} className={iconClasses} />;
    case IconNames.UserCog:
      return <UserCog size={iconSize} className={iconClasses} />;
    case IconNames.Wrench:
      return <Wrench size={iconSize} className={iconClasses} />;
    case IconNames.MenuSquare:
      return <MenuSquare size={iconSize} className={iconClasses} />;
    case IconNames.CalendarRange:
      return <CalendarRange size={iconSize} className={iconClasses} />;
    case IconNames.Boxes:
      return <Boxes size={iconSize} className={iconClasses} />;
    case IconNames.Group:
      return <Group size={iconSize} className={iconClasses} />;
    case IconNames.User2:
      return <User2 size={iconSize} className={iconClasses} />;
    case IconNames.Truck:
      return <Truck size={iconSize} className={iconClasses} />;
    case IconNames.Eye:
      return <Eye size={iconSize} className={iconClasses} />;
    case IconNames.Box:
      return <Box size={iconSize} className={iconClasses} />;
    case IconNames.PenSquare:
      return <PenSquare size={iconSize} className={iconClasses} />;
    case IconNames.ArrowLeftRight:
      return <ArrowLeftRight size={iconSize} className={iconClasses} />;
    case IconNames.ArrowUpSquare:
      return <ArrowUpSquare size={iconSize} className={iconClasses} />;
    case IconNames.BaggageClaim:
      return <BaggageClaim size={iconSize} className={iconClasses} />;
    case IconNames.PackageX:
      return <PackageX size={iconSize} className={iconClasses} />;
    case IconNames.ShoppingBasket:
      return <ShoppingBasket size={iconSize} className={iconClasses} />;
    case IconNames.Undo:
      return <Undo size={iconSize} className={iconClasses} />;
    case IconNames.PieChart:
      return <PieChart size={iconSize} className={iconClasses} />;
    case IconNames.FileBarChart2:
      return <FileBarChart2 size={iconSize} className={iconClasses} />;
    case IconNames.Percent:
      return <Percent size={iconSize} className={iconClasses} />;
    case IconNames.PercentCircle:
      return <PercentCircle size={iconSize} className={iconClasses} />;
    case IconNames.BankNote:
      return <Banknote size={iconSize} className={iconClasses} />;
  }
};

const SideBarButton = ({
  iconName,
  title,
  className,
  isCollapsed,
  href,
}: {
  iconName?: IconNames;
  title: string;
  className: string;
  isCollapsed: boolean | null;
  href: string;
}) => {
  const icon = iconName ? LucideIcons(iconName, isCollapsed) : null;

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-blue-100 hover:text-blue-700",
        title == "Logout" && "hover:bg-red-200 hover:text-red-700",
        " my-1 flex h-10 min-h-[2.5rem] w-5/6 items-center justify-start" +
          " rounded-sm hover:cursor-pointer ",
        className,
      )}
    >
      {icon}
      <p
        className={cn(
          "text-sm",
          icon ? "" : "ml-4",
          isCollapsed == null ? "hidden lg:block" : "",
          isCollapsed == true ? "hidden" : isCollapsed == false ? "block" : "",
        )}
      >
        {title}
        {
          /* "ORDERS section needs an aditional which tells how much orders is being processed" */
          title === "Orders" ? (
            /* leading-[1.75rem] == h-7 value, which is to align the text vertically */
            <span className="ml-6 inline-block h-7 w-7 rounded-full bg-blue-800 text-center text-sm leading-[1.75rem] text-white">
              10
            </span>
          ) : null
        }
      </p>
    </Link>
  );
};

const SideBarAccordion = ({
  iconName,
  title,
  buttons,
  isCollapsed,
}: {
  iconName: IconNames;
  title: string;
  buttons: JSX.Element[];
  isCollapsed: boolean | null;
}) => {
  return (
    <Accordion
      type="single"
      collapsible={true}
      className="mx-2 my-1 w-5/6 rounded-md bg-slate-100"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          showArrowFunc={cn(
            "mr-2",
            isCollapsed == null ? "hidden lg:block" : "",
            isCollapsed == true
              ? "hidden"
              : isCollapsed == false
                ? "block"
                : "",
          )}
          className={cn(
            "h-12 justify-center gap-2",
            isCollapsed == null ? "justify-center lg:justify-start" : "",
            isCollapsed == true
              ? "justify-center"
              : isCollapsed == false
                ? "justify-start"
                : "",
          )}
        >
          <div className="flex w-full flex-row">
            {LucideIcons(iconName, isCollapsed)}
            <p
              className={cn(
                "text-sm font-normal",
                isCollapsed == null ? "hidden lg:block" : "",
                isCollapsed == true
                  ? "hidden"
                  : isCollapsed == false
                    ? "block"
                    : "",
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
          "fixed top-8 z-[10] translate-x-[-50%] rounded-full duration-150 ease-linear hover:cursor-pointer",
          isCollapsed == null
            ? "left-[64px] max-lg:rotate-180 lg:left-[232px]"
            : "",
          isCollapsed == true
            ? "left-[64px] rotate-180"
            : isCollapsed == false
              ? "left-[232px]"
              : "",
        )}
      />
      <div
        className={cn(
          "fixed left-0 top-0 flex h-full flex-col items-center overflow-y-scroll duration-200 ease-linear",
          className,
          isCollapsed == null ? "w-[64px] lg:w-[232px]" : "",
          isCollapsed == true
            ? "w-[64px]"
            : isCollapsed == false
              ? "w-[232px]"
              : "",
        )}
      >
        <div className="relative flex w-full flex-row items-center justify-center overflow-y-visible">
          {/* <img src="/static/web_avatar.png" alt="web avatar" className="w-[32px] h-[32px]"/> */}
          <Image
            src="/web_avatar.png"
            alt="web avatar"
            width={48}
            height={48}
          />
          <h1
            className={cn(
              "ml-2 text-xl font-bold tracking-tight",
              isCollapsed == null ? "hidden lg:block" : "",
              isCollapsed == true
                ? "hidden"
                : isCollapsed == false
                  ? "block"
                  : "",
            )}
          >
            MSTORE
          </h1>
        </div>
        <Accordion
          type="single"
          collapsible={true}
          className="mx-2 my-2 w-5/6 rounded-md bg-slate-100 px-2"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger
              showArrowFunc={cn(
                isCollapsed == null ? "hidden lg:block" : "",
                isCollapsed == true
                  ? "hidden"
                  : isCollapsed == false
                    ? "block"
                    : "",
              )}
              className="gap-2"
            >
              <Avatar className="h-9 w-9 border-2 border-dashed border-blue-500 hover:border-solid">
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
                      : "",
                )}
              >
                <h4 className="max-w-[85px] break-words text-start text-sm font-medium">
                  Nam Huynh
                </h4>
                <p className="flex-wrap text-start text-xs opacity-75">Staff</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SideBarButton
                iconName={IconNames.UserCog}
                title="Edit Profile"
                className="!w-full"
                isCollapsed={isCollapsed}
                href=""
              />
              <SideBarButton
                iconName={IconNames.LogOut}
                title="Logout"
                className="!w-full"
                isCollapsed={isCollapsed}
                href="/login"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SideBarButton
          iconName={IconNames.Percent}
          title="Sale in-store"
          className="border border-blue-400"
          isCollapsed={isCollapsed}
          href="/sale"
        />

        <SideBarButton
          iconName={IconNames.Eye}
          title="Overview"
          className=""
          isCollapsed={isCollapsed}
          href="/overview"
        />

        <SideBarAccordion
          iconName={IconNames.Box}
          title="Products"
          buttons={[
            <SideBarButton
              key={1}
              iconName={IconNames.Group}
              title="Catalog"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/catalog"
            />,
            <SideBarButton
              key={2}
              iconName={IconNames.PercentCircle}
              title="Discount"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/discount"
            />,
            <SideBarButton
              key={3}
              iconName={IconNames.PenSquare}
              title="Stock Check"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/stock-check"
            />,
          ]}
          isCollapsed={isCollapsed}
        />

        <SideBarAccordion
          iconName={IconNames.Receipt}
          title="Transaction"
          buttons={[
            <SideBarButton
              key={1}
              iconName={IconNames.Receipt}
              title="Invoices"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/invoice"
            />,
            <SideBarButton
              key={2}
              iconName={IconNames.Undo}
              title="Return"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/return"
            />,
            <SideBarButton
              key={3}
              iconName={IconNames.BaggageClaim}
              title="Purchase Orders"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/purchase-order"
            />,
            <SideBarButton
              key={4}
              iconName={IconNames.ArrowUpSquare}
              title="Purchase Returns"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/purchase-return"
            />,
            <SideBarButton
              key={5}
              iconName={IconNames.PackageX}
              title="Damaged Items"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/damaged-item"
            />,
          ]}
          isCollapsed={isCollapsed}
        />

        <SideBarButton
          iconName={IconNames.BankNote}
          title="Fund Ledger"
          className=""
          isCollapsed={isCollapsed}
          href="/fund-ledger"
        />

        <SideBarAccordion
          iconName={IconNames.Users}
          title="Partners"
          buttons={[
            // SideBarButton("User2", "Customer group", "!w-full", isCollapsed={isCollapsed}, "/partner/customer_group"),
            <SideBarButton
              key={1}
              iconName={IconNames.User}
              title="Customers"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/customer"
            />,
            <SideBarButton
              key={2}
              iconName={IconNames.Truck}
              title="Supplier"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/supplier"
            />,
          ]}
          isCollapsed={isCollapsed}
        />

        <SideBarAccordion
          iconName={IconNames.BarChart3}
          title="Reports"
          buttons={[
            <SideBarButton
              key={1}
              title="Sale Transaction"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/sale-transaction"
            />,
            <SideBarButton
              key={2}
              title="Profit By Day"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/sale-profit-by-day"
            />,
            <SideBarButton
              key={3}
              title="Revenue By Staff"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/revenue-by-staff"
              />,
              // <SideBarButton
              //   key={8}
              //   title="Products"
              //   className="!w-full"
              //   isCollapsed={isCollapsed}
              //   href="/report/product"
              // />,
              <SideBarButton
              key={4}
              title="Products"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/products"
              />,
            // <SideBarButton
            //   key={5}
            //   title="Product Sale"
            //   className="!w-full"
            //   isCollapsed={isCollapsed}
            //   href="/report/product-sale"
            // />,
            <SideBarButton
              key={6}
              title="Sale By Day"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/sale-by-day"
            />,
            <SideBarButton
              key={7}
              title="Customer"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/customer"
            />,
            <SideBarButton
              key={9}
              title="Finance"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/finance"
            />,
            <SideBarButton
              key={10}
              title="Supply Transaction"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/report/supply-transaction"
            />,
          ]}
          isCollapsed={isCollapsed}
        />

        {/* <SideBarButton
          iconName={IconNames.Settings}
          title="Settings"
          className=""
          isCollapsed={isCollapsed}
          href="/settings"
        /> */}

        <SideBarAccordion
          iconName={IconNames.Contact}
          title="Staff"
          buttons={[
            <SideBarButton
              key={2}
              iconName={IconNames.MenuSquare}
              title="Staff Account"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/staff/staff-account"
            />,
            <SideBarButton
              key={3}
              iconName={IconNames.Wrench}
              title="Role Setting"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/staff/staff-role"
            />,
            <SideBarButton
              key={4}
              iconName={IconNames.CalendarRange}
              title="Work Manage"
              className="!w-full"
              isCollapsed={isCollapsed}
              href="/staff/attendance"
            />,
          ]}
          isCollapsed={isCollapsed}
        />

        <SideBarButton
          iconName={IconNames.Settings}
          title="Settings"
          className=""
          isCollapsed={isCollapsed}
          href="/settings"
        />
      </div>
    </div>
  );
};

export default SideBar;
