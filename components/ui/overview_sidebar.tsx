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
} from "lucide-react";
import { Separator } from "./separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const SideBarButton = (
  iconName: string,
  title: string,
  className: string = ""
) => {
  const iconSize = 16;
  const iconClasses =
    "m-auto lg:ml-4 lg:mr-4 group-hover:ml-4 group-hover:mr-4";
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
    case "UserCog":
      icon = <UserCog size={iconSize} className={iconClasses} />;
      break;
    case "Wrench":
      icon = <Wrench size={iconSize} className={iconClasses} />;
      break;
    case "MenuSquare":
      icon = <MenuSquare size={iconSize} className={iconClasses} />;
      break;
    case "CalendarRange":
      icon = <CalendarRange size={iconSize} className={iconClasses} />;
      break;
    case "Boxes":
      icon = <Boxes size={iconSize} className={iconClasses} />;
      break;
    case "Group":
      icon = <Group size={iconSize} className={iconClasses} />;
      break;
    case "User2":
      icon = <User2 size={iconSize} className={iconClasses} />;
      break;
    case "Truck":
      icon = <Truck size={iconSize} className={iconClasses} />;
      break;
  }

  return (
    <div
      className={
        cn(
          "hover:text-blue-700 hover:bg-blue-100",
          title == "Logout" && "hover:text-red-700 hover:bg-red-200"
        ) +
        " w-5/6 flex justify-start items-center min-h-[2.5rem] h-10 my-1" +
        " rounded-sm hover:cursor-pointer " +
        className
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

const SideBar = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col fixed left-0 h-full overflow-y-scroll items-center min-w-[64px] w-[64px] lg:min-w-[200px] lg:flex-[0.2] group hover:w-[200px] hover:min-w-[200px] ease-linear duration-200",
        className
      )}
    >
      <div className="flex flex-row items-center mx-auto">
        {/* <img src="/static/web_avatar.png" alt="web avatar" className="w-[32px] h-[32px]"/> */}
        <Image src="/web_avatar.png" alt="web avatar" width={48} height={48} />
        <h1 className="ml-2 hidden font-bold text-xl tracking-tight lg:block group-hover:block">
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
            showArrowFunc="lg:block hidden group-hover:block"
            className="gap-2"
          >
            <Avatar className="w-9 h-9 border-2 border-dashed border-blue-500 hover:border-solid">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="hidden group-hover:block lg:block">
              <h4 className="font-medium text-sm max-w-[85px] text-start break-words">
                Nam Huynh
              </h4>
              <p className="text-xs opacity-75 text-start flex-wrap">Staff</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {SideBarButton("UserCog", "Edit profile", "w-full")}
            {SideBarButton("LogOut", "Logout", "w-full")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible={true}
        className="w-5/6 bg-slate-100 rounded-xl mx-2 my-1 lg:pr-2 group-hover:pr-2 hover:cursor-pointer"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger
            showArrowFunc="lg:block hidden group-hover:block"
            className="justify-center lg:justify-start group-hover:justify-start gap-2 h-12"
          >
            <div className="flex flex-row w-full">
              <Receipt
                size={16}
                className="m-auto lg:ml-4 lg:mr-4 group-hover:ml-4 group-hover:mr-4"
              />
              <p className="text-sm font-normal hidden lg:block group-hover:block">
                Sales
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {SideBarButton("ShoppingCart", "Orders", "w-full")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible={true}
        className="w-5/6 bg-slate-100 rounded-xl mx-2 my-1 lg:pr-2 group-hover:pr-2  hover:cursor-pointer"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger
            showArrowFunc="lg:block hidden group-hover:block"
            className="justify-center lg:justify-start group-hover:justify-start gap-2 h-12"
          >
            <div className="flex flex-row w-full">
              <Users
                size={16}
                className="m-auto lg:ml-4 lg:mr-4 group-hover:ml-4 group-hover:mr-4"
              />
              <p className="text-sm font-normal hidden lg:block group-hover:block">
                Partners
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {SideBarButton("User2", "Customer group", "w-full")}
            {SideBarButton("User", "Customers", "w-full")}
            {SideBarButton("Truck", "Supplier", "w-full")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {SideBarButton("Package", "Warehouse")}
      {SideBarButton("BarChart3", "Report")}

      <Accordion
        type="single"
        collapsible={true}
        className="w-5/6 bg-slate-100 rounded-xl mx-2 my-1 lg:pr-2 group-hover:pr-2 hover:cursor-pointer"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger
            showArrowFunc="lg:block hidden group-hover:block"
            className="justify-center lg:justify-start group-hover:justify-start gap-2 h-12"
          >
            <div className="flex flex-row w-full">
              <ShoppingBag
                size={16}
                className="m-auto lg:ml-4 lg:mr-4 group-hover:ml-4 group-hover:mr-4"
              />
              <p className="text-sm font-normal hidden lg:block group-hover:block">
                Products
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {SideBarButton("Group", "Product group", "w-full pl-0")}
            {SideBarButton("Boxes", "Products", "w-full")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible={true}
        className="w-5/6 bg-slate-100 rounded-xl mx-2 my-1 lg:pr-2 group-hover:pr-2 hover:cursor-pointer"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger
            showArrowFunc="lg:block hidden group-hover:block"
            className="justify-center lg:justify-start group-hover:justify-start gap-2 h-12"
          >
            <div className="flex flex-row w-full">
              <Contact
                size={16}
                className="m-auto lg:ml-4 lg:mr-4 group-hover:ml-4 group-hover:mr-4"
              />
              <p className="text-sm font-normal hidden lg:block group-hover:block">
                Staff
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {SideBarButton("UserCog", "Staff group", "w-full")}
            {SideBarButton("MenuSquare", "Staff account", "w-full")}
            {SideBarButton("Wrench", "Role setting", "w-full")}
            {SideBarButton("CalendarRange", "Work manage", "w-full")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {SideBarButton("Settings", "Settings")}
    </div>
  );
};

export default SideBar;
