"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StaffService from "@/services/staff_service";
import {
  ArrowLeftCircle,
  ArrowLeftRight,
  ArrowUpSquare,
  BaggageClaim,
  Banknote,
  BarChart3,
  Box,
  Boxes,
  CalendarClock,
  CalendarRange,
  Contact,
  Eye,
  FileBarChart2,
  GanttChartSquare,
  Grid3x3,
  Group,
  LogOut,
  LogOutIcon,
  MenuSquare,
  Package,
  PackageX,
  PenSquare,
  Percent,
  PercentCircle,
  PieChart,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Truck,
  Undo,
  User,
  User2,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import {
  AddStaffDialog,
  DisableField,
  HiddenField,
} from "../staff/add_staff_dialog";
import { useToast } from "../use-toast";
import { Staff } from "@/entities/Staff";
import {
  convertStaffReceived,
  convertStaffToSent,
} from "@/utils/staffApiUtils";
import { useRouter } from "next/navigation";
import { setProfile } from "@/reducers/profileReducer";
import { Button } from "../button";
import AuthService from "@/services/authService";
import UpdateStoreInformationDialog from "@/components/component/updateStoreInfoDialog";
import { convertRoleReceived } from "@/utils/roleSettingApiUtils";

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
  onClick,
}: {
  iconName?: IconNames;
  title: string;
  className: string;
  isCollapsed: boolean | null;
  href: string;
  onClick?: () => void;
}) => {
  const icon = iconName ? LucideIcons(iconName, isCollapsed) : null;

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-blue-100 hover:text-blue-700",
        " my-1 flex h-10 min-h-[2.5rem] w-5/6 items-center justify-start",
        "rounded-sm hover:cursor-pointer",
        className,
      )}
      onClick={onClick}
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
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile.value);
  const roles = useAppSelector((state) => state.role.value);
  console.log('roles', roles, profile)
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  const storeInfo = useAppSelector((state) => state.store.information);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const updateOwner = async (value: Staff, avatar: File | null) => {
    try {
      const staffToSent = convertStaffToSent(value, "owner");
      const dataForm: any = new FormData();
      dataForm.append(
        "data",
        new Blob([JSON.stringify(staffToSent)], { type: "application/json" }),
      );
      dataForm.append("file", avatar);
      const staffResult = await StaffService.updateStaff(
        staffToSent.id,
        dataForm,
      );
      const staffReceived = convertStaffReceived(staffResult.data);
      dispatch(setProfile(staffReceived));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    }
  };
  const handleUpdateStaff = (value: Staff, avatar: File | null) => {
    return updateOwner(value, avatar).then(() => {
      toast({
        variant: "default",
        title: "Update successfully",
      });
    });
  };

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
                <AvatarImage
                  src={profile?.avatar ?? "https://github.com/shadcn.png"}
                />
                <AvatarFallback>{profile?.name}</AvatarFallback>
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
                  {profile?.name ?? "NAME NOT FOUND"}
                </h4>
                <p className="flex-wrap text-start text-xs opacity-75">
                  {profile?.position ?? "POSITION NOT FOUND"}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SideBarButton
                iconName={IconNames.UserCog}
                title="Edit Profile"
                className="!w-full"
                isCollapsed={isCollapsed}
                href=""
                onClick={() => setOpenProfileDialog(true)}
              />
              <Button
                className={cn(
                  "hover:bg-blue-100 hover:text-blue-700",
                  " my-1 h-10 min-h-[2.5rem] w-full p-0",
                  "rounded-sm hover:cursor-pointer hover:bg-red-200 hover:text-red-700",
                )}
                onClick={() => {
                  AuthService.logOut()
                    .then(() => {
                      router.push("/login");
                      toast({
                        title: "Logout successfully",
                      });
                    })
                    .catch((e) => {
                      axiosUIErrorHandler(e, toast, router);
                    });
                }}
              >
                <div className="flex w-full justify-start ">
                  {LucideIcons(IconNames.LogOut, isCollapsed)}
                  <p
                    className={cn(
                      "h-full flex-1 text-start text-sm",
                      isCollapsed == null ? "hidden lg:block" : "",
                      isCollapsed == true
                        ? "hidden"
                        : isCollapsed == false
                          ? "block"
                          : "",
                    )}
                  >
                    Logout
                  </p>
                </div>
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {userPermissions.invoice.create && (
          <SideBarButton
            iconName={IconNames.Percent}
            title="Sale in-store"
            className="border border-blue-400"
            isCollapsed={isCollapsed}
            href="/sale"
          />
        )}

        {userPermissions.overview.read && (
          <SideBarButton
            iconName={IconNames.Eye}
            title="Overview"
            className=""
            isCollapsed={isCollapsed}
            href="/overview"
          />
        )}

        {userPermissions.catalog.read ||
          userPermissions.discount.read ||
          userPermissions.stockCheck.read ?
            <SideBarAccordion
              iconName={IconNames.Box}
              title="Products"
              buttons={[
                <SideBarButton
                  key={1}
                  iconName={IconNames.Group}
                  title="Catalog"
                  className={
                    cn("!w-full ", userPermissions.catalog.read ? "" : " hidden")
                  }
                  isCollapsed={isCollapsed}
                  href="/catalog"
                />,
                <SideBarButton
                  key={2}
                  iconName={IconNames.PercentCircle}
                  title="Discount"
                  className={
                    cn("!w-full ", userPermissions.discount.read ? "" : " hidden")
                  }
                  isCollapsed={isCollapsed}
                  href="/discount"
                />,
                <SideBarButton
                  key={3}
                  iconName={IconNames.PenSquare}
                  title="Stock Check"
                  className={
                    cn("!w-full ", userPermissions.stockCheck.read ? "" : " hidden")
                  }
                  isCollapsed={isCollapsed}
                  href="/stock-check"
                />,
              ]}
              isCollapsed={isCollapsed}
            />
          : null}

        {userPermissions.invoice.read ||
        userPermissions.returnInvoice.read ||
        userPermissions.purchaseOrder.read ||
        userPermissions.purchaseReturn.read ||
        userPermissions.damageItems.read ? (
          <SideBarAccordion
            iconName={IconNames.Receipt}
            title="Transaction"
            buttons={[
              <SideBarButton
                key={1}
                iconName={IconNames.Receipt}
                title="Invoices"
                className={
                  cn("!w-full ", userPermissions.invoice.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/invoice"
              />,
              <SideBarButton
                key={2}
                iconName={IconNames.Undo}
                title="Return"
                className={
                    cn("!w-full ", userPermissions.returnInvoice.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/return"
              />,
              <SideBarButton
                key={3}
                iconName={IconNames.BaggageClaim}
                title="Purchase Orders"
                className={
                    cn("!w-full ", userPermissions.purchaseOrder.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/purchase-order"
              />,
              <SideBarButton
                key={4}
                iconName={IconNames.ArrowUpSquare}
                title="Purchase Returns"
                className={
                    cn("!w-full ", userPermissions.purchaseReturn.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/purchase-return"
              />,
              <SideBarButton
                key={5}
                iconName={IconNames.PackageX}
                title="Damaged Items"
                className={
                  cn("!w-full ", userPermissions.damageItems.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/damaged-item"
              />,
            ]}
            isCollapsed={isCollapsed}
          />
        ) : null}

        {userPermissions.fundLedger && (
          <SideBarButton
            iconName={IconNames.BankNote}
            title="Fund Ledger"
            className=""
            isCollapsed={isCollapsed}
            href="/fund-ledger"
          />
        )}

        {userPermissions.customer.read || userPermissions.supplier.read ? (
          <SideBarAccordion
            iconName={IconNames.Users}
            title="Partners"
            buttons={[
              // SideBarButton("User2", "Customer group", "!w-full", isCollapsed={isCollapsed}, "/partner/customer_group"),
              <SideBarButton
                key={1}
                iconName={IconNames.User}
                title="Customers"
                className={
                  cn("!w-full ", userPermissions.customer.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/customer"
              />,
              <SideBarButton
                key={2}
                iconName={IconNames.Truck}
                title="Supplier"
                className={
                  cn("!w-full ", userPermissions.supplier.read ? "" : " hidden")
                }
                isCollapsed={isCollapsed}
                href="/supplier"
              />,
            ]}
            isCollapsed={isCollapsed}
          />
        ) : null}

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

        {userPermissions.report.read && (
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
        )}

        {(storeInfo && profile?.position === "owner") ||
        profile?.position === "Owner" ? (
          <UpdateStoreInformationDialog
            DialogTrigger={
              <SideBarButton
                iconName={IconNames.Settings}
                title="Settings"
                className=""
                isCollapsed={isCollapsed}
                href="#"
              />
            }
            storeInfo={storeInfo!}
          />
        ) : null}
      </div>
      <AddStaffDialog
        data={profile!}
        open={openProfileDialog}
        setOpen={setOpenProfileDialog}
        submit={handleUpdateStaff}
        title="Edit Profile"
        disableFields={["position", "email"] as DisableField[]}
        hiddenFields={["salary", "password"] as HiddenField[]}
      />
    </div>
  );
};

export default SideBar;
