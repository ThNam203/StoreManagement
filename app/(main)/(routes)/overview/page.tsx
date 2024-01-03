"use client";
import Notification from "@/components/ui/notification";
import Charts from "@/components/ui/overview/overview_chart";
import RecentActivityItem from "@/components/ui/overview/overview_recent_activity_item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ActivityLog } from "@/entities/ActivityLog";
import { SaleProfitByDayReport } from "@/entities/Report";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setStaffs } from "@/reducers/staffReducer";
import ActivityLogService from "@/services/activityLogService";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import InvoiceService from "@/services/invoiceService";
import ReportService from "@/services/reportService";
import ReturnInvoiceService from "@/services/returnInvoiceService";
import StaffService from "@/services/staff_service";
import { format, isAfter, isBefore } from "date-fns";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import scrollbar_style from "../../../../styles/scrollbar.module.css";
import styles from "./styles.module.css";
import { report } from "process";
import { ReturnInvoiceServer } from "@/entities/ReturnInvoice";
import { Invoice } from "@/entities/Invoice";
import { faker } from "@faker-js/faker";

const notifications = [
  {
    id: 1,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Nam",
    actionDetail: " created a new page",
    secondSubject: " in New Zealand",
    createdAt: "Now",
    badges: ["News"],
    isRead: false,
  },
  {
    id: 2,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Alice",
    actionDetail: "uploaded a video",
    secondSubject: "on YouTube",
    createdAt: "5 minutes ago",
    badges: ["Entertainment"],
    isRead: true,
  },
  {
    id: 3,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "John",
    actionDetail: "wrote a blog post",
    secondSubject: "about technology",
    createdAt: "1 hour ago",
    badges: ["Technology"],
    isRead: false,
  },
  {
    id: 4,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Emma",
    actionDetail: "shared a photo",
    secondSubject: "on Instagram",
    createdAt: "2 hours ago",
    badges: ["Social Media"],
    isRead: true,
  },
  {
    id: 5,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Michael",
    actionDetail: "commented on a post",
    secondSubject: "on Facebook",
    createdAt: "3 hours ago",
    badges: ["Social Media"],
    isRead: false,
  },
  {
    id: 6,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Sophia",
    actionDetail: "sent a message",
    secondSubject: "via email",
    createdAt: "4 hours ago",
    badges: ["Communication"],
    isRead: true,
  },
  ,
  {
    id: 7,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Sophia",
    actionDetail: "sent a message",
    secondSubject: "via email",
    createdAt: "4 hours ago",
    badges: ["Communication"],
    isRead: true,
  },
  {
    id: 8,
    imageUrl: "https://i.pravatar.cc/300",
    firstSubject: "Sophia",
    actionDetail: "sent a message",
    secondSubject: "via email",
    createdAt: "4 hours ago",
    badges: ["Communication"],
    isRead: true,
  },
];

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const staffs = useAppSelector((state) => state.staffs.value);
  const [chartType, setChartType] = useState<"order" | "revenue" | "refund" | "customer">("order")
  const [saleProfitReport, setSaleProfitReport] =
    useState<SaleProfitByDayReport>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [todayInvoices, setTodayInvoices] = useState<Invoice[]>([]);
  const [todayReturnInvoices, setTodayReturnInvoices] = useState<ReturnInvoiceServer[]>([]);
  const [previousDayInvoices, setPreviousDayInvoices] = useState<Invoice[]>([]);
  const [previousDayReturnInvoices, setPreviousDayReturnInvoices] = useState<ReturnInvoiceServer[]>([]);

  const todayReturnsValue = todayReturnInvoices.map((v) => v.total).reduce((acc, cur) => acc + cur, 0)
  const previousDayReturnsValue = previousDayReturnInvoices.map((v) => v.total).reduce((acc, cur) => acc + cur, 0)

  const getChartLabel = () => {
    if (chartType === "order") return "Order by hour"
    if (chartType === "revenue") return "Revenue by hour"
    if (chartType === "refund") return "Refund by hour"
    if (chartType === "customer") return "Customer by hour"
    return ""
  }

  const getChartData = () => {
    const invoicesByHour: Invoice[][] = Array.from({length: 24}, (v, i) => i).map((v) => [])
    const returnsByHour: ReturnInvoiceServer[][] = Array.from({length: 24}, (v, i) => i).map((v) => [])

    todayInvoices.forEach((invoice) => {
      const hour = new Date(invoice.createdAt).getHours()
      invoicesByHour[hour].push(invoice)
    })

    todayReturnInvoices.forEach((invoice) => {
      const hour = new Date(invoice.createdAt).getHours()
      returnsByHour[hour].push(invoice)
    })

    if (chartType === "order") return invoicesByHour.map((invoices) => invoices.length)
    if (chartType === "revenue") {
      const invoiceValues = invoicesByHour.map((invoices) => invoices.map((invoice) => invoice.total).reduce((acc, cur) => acc + cur, 0))
      const returnValues = returnsByHour.map((invoices) => invoices.map((invoice) => invoice.total).reduce((acc, cur) => acc + cur, 0))
      return invoiceValues.map((value, index) => value - returnValues[index])
    }
    if (chartType === "refund") return returnsByHour.map((invoices) => invoices.map((invoice) => invoice.total).reduce((acc, cur) => acc + cur, 0))
    if (chartType === "customer") {
      return invoicesByHour.map((invoices) => {
        return new Set(invoices.map((v) => v.customerId !== null ? v.customerId : {})).size})
    }
    return []
  }

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const previousDay = new Date();
      previousDay.setDate(today.getDate() - 1);
      previousDay.setHours(0, 0, 0, 0);

      const staffCall = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffCall.data));
      const invoicesCall = await InvoiceService.getAllInvoices();
      const invoices = invoicesCall.data;

      const todayInvoices = invoices.filter((invoice) =>
        isAfter(new Date(invoice.createdAt), today),
      );

      const previousDayInvoices = invoices.filter(
        (invoice) =>
          isAfter(new Date(invoice.createdAt), previousDay) &&
          isBefore(new Date(invoice.createdAt), today),
      );

      setTodayInvoices(todayInvoices);
      setPreviousDayInvoices(previousDayInvoices);

      const returnInvoicesCall =
        await ReturnInvoiceService.getAllReturnInvoices();
      const todayReturns = returnInvoicesCall.data
        .filter((invoice) => isAfter(new Date(invoice.createdAt), today))
      const previousDayReturns = returnInvoicesCall.data
        .filter(
          (invoice) =>
            isAfter(new Date(invoice.createdAt), previousDay) &&
            isBefore(new Date(invoice.createdAt), today),
        )
      setTodayReturnInvoices(todayReturns);
      setPreviousDayReturnInvoices(previousDayReturns);

      const activityCall = await ActivityLogService.getAllActivityLogs();
      setActivityLogs(activityCall.data);
      const saleProfitReportCall = await ReportService.getSaleProfitByDayReport(
        previousDay,
        today,
      );
      const reportData = saleProfitReportCall.data;
      const filledDataReport = {
        costPrice: 0,
        revenue: 0,
        date: "",
        profit: 0,
      };
      if (reportData.length === 0) {
        reportData.push({ ...filledDataReport });
        reportData.push();
      } else if (reportData.length === 1) {
        if (
          new Date(reportData[0].date).setHours(0, 0, 0, 0) ===
          today.setHours(0, 0, 0, 0)
        )
          reportData.unshift({ ...filledDataReport });
        else reportData.push({ ...filledDataReport });
      }
      setSaleProfitReport(saleProfitReportCall.data);
    };

    fetchData()
      .catch((err) => {
        axiosUIErrorHandler(err, toast, router);
      })
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    // if we change 832px to another value, we must change it again in styles.module.css
    // and change the value of mediaquery of notification-board in the same folder
    // to make it work correctly
    <div className="flex flex-col min-[832px]:flex-row">
      <div className="flex min-w-0 flex-1 flex-col rounded-sm bg-white px-4 py-2">
        <div className="flex flex-row justify-between">
          <h2 className="my-4 text-start text-2xl font-semibold">Overview</h2>
          {/* <Popover>
            <PopoverTrigger className="mr-4 h-[20px] w-[20px] self-center">
              <div className="relative">
                <Bell size={20} />
                <p className="absolute -right-2 -top-2 rounded-full bg-blue-500 p-[2px] text-center text-xs">
                  10
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={
                "mr-8 max-h-[300px] overflow-auto p-2 " +
                scrollbar_style.scrollbar
              }
            >
              {notifications.map((notification) => (
                <Notification {...notification} key={notification!.id} />
              ))}
            </PopoverContent>
          </Popover> */}
        </div>
        {saleProfitReport.length > 0 ? (
          <div className={styles.overview_cards}>
            <div
              className={
                styles.overview_card_1 +
                " rounded-lg border-t p-4 text-start shadow-md"
              }
            >
              <h4 className="text-xs text-gray-500">Total orders</h4>
              <h2 className="my-2 text-3xl font-bold">{todayInvoices.length}</h2>
              <p className="text-xs text-gray-500">
                <span
                  className={cn(
                    todayInvoices.length > previousDayInvoices.length
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {todayInvoices.length >= previousDayInvoices.length ? "+" : "-"}
                  {Math.abs(
                    ((todayInvoices.length - previousDayInvoices.length) /
                      Math.max(previousDayInvoices.length, 1)) *
                      100,
                  ).toFixed(2)}
                  %
                </span>{" "}
                compare to last day
              </p>
            </div>
            <div
              className={
                styles.overview_card_2 +
                " rounded-lg border-t p-4 text-start shadow-md"
              }
            >
              <h4 className="text-xs text-gray-500">Revenue</h4>
              <h2 className="my-2 text-3xl font-bold">
                {saleProfitReport[1].revenue} VND
              </h2>
              <p className="text-xs text-gray-500">
                <span
                  className={cn(
                    saleProfitReport[1].revenue > saleProfitReport[0].revenue
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {saleProfitReport[1].revenue >= saleProfitReport[0].revenue
                    ? "+"
                    : "-"}
                  {Math.abs(
                    ((saleProfitReport[1].revenue -
                      saleProfitReport[0].revenue) /
                      Math.max(saleProfitReport[0].revenue, 1)) *
                      100,
                  ).toFixed(2)}
                  %
                </span>{" "}
                compare to last day
              </p>
            </div>
            <div
              className={
                styles.overview_card_3 +
                " rounded-lg border-t p-4 text-start shadow-md"
              }
            >
              <h4 className="text-xs text-gray-500">Refunds</h4>
              <h2 className="my-2 text-3xl font-bold">
                {todayReturnsValue} VND
              </h2>
              <p className="text-xs text-gray-500">
                <span
                  className={cn(
                    todayReturnsValue <= previousDayReturnsValue
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {todayReturnsValue <= previousDayReturnsValue
                    ? "-"
                    : "+"}
                  {Math.abs(
                    ((todayReturnsValue - previousDayReturnsValue) /
                      Math.max(previousDayReturnsValue, 1)) *
                      100,
                  ).toFixed(2)}
                  %
                </span>{" "}
                compare to last month
              </p>
            </div>
            <div
              className={
                styles.overview_card_4 +
                " rounded-lg border-t p-4 text-start shadow-md"
              }
            >
              <h4 className="text-xs text-gray-500">Cost</h4>
              <h2 className="my-2 text-3xl font-bold">
                {saleProfitReport[1].costPrice} VND
              </h2>
              <h2 className="my-2 text-3xl font-bold">
                {saleProfitReport[1].costPrice} VND
              </h2>
              <p className="text-xs text-gray-500">
                <span
                  className={cn(
                    saleProfitReport[1].costPrice <=
                      saleProfitReport[0].costPrice
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {saleProfitReport[1].costPrice <=
                  saleProfitReport[0].costPrice
                    ? "-"
                    : "+"}
                  {Math.abs(
                    ((saleProfitReport[1].costPrice -
                      saleProfitReport[0].costPrice) /
                      Math.max(saleProfitReport[0].costPrice, 1)) *
                      100,
                  ).toFixed(2)}
                  %
                </span>{" "}
                compare to last month
              </p>
            </div>
          </div>
        ) : null}
        <div
          className={
            " my-4 flex flex-col items-center justify-center rounded-lg border-t p-4 text-start shadow-md"
          }
        >
          <div className="flex w-full flex-row items-center">
            <h3 className="start font-bold uppercase">
              Doanh thu thuần hôm nay
            </h3>
            {/* <ArrowRightCircle
              size={16}
              fill="rgb(148 163 184)"
              className="mx-2"
            />
            <h3 className="mr-2 font-bold uppercase">2.245.500VND</h3> */}
            <div className="flex-1"></div>
            <Select value={chartType} onValueChange={(e) => setChartType(e as "order" | "revenue" | "refund" | "customer")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="order">Order by hour</SelectItem>
                  <SelectItem value="revenue">Revenue by hour</SelectItem>
                  <SelectItem value="refund">Refund by hour</SelectItem>
                  <SelectItem value="customer">Customer by hour</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Charts.BarChart label={getChartLabel()} data={getChartData()} />
        </div>
        {/* <div
          className={
            " rounded-lg shadow-md text-start p-4 border-t flex items-center justify-center mb-4"
          }
        >
          <OverviewChart />
        </div> */}
      </div>
      <div className={styles["notification-board"]}>
        <h3 className="my-2 font-semibold uppercase">Recent activities</h3>
        <div
          className={cn(
            "h-full overflow-hidden pr-2 hover:overflow-auto",
            scrollbar_style.scrollbar,
          )}
        >
          {activityLogs.map((activity) => {
            const staff = staffs.find(
              (staff) => staff.id === activity.staffId,
            )!;
            return (
              <RecentActivityItem
                key={activity.id}
                id={activity.id}
                staffId={activity.staffId}
                staffName={staff.name}
                staffAvatar={staff.avatar}
                description={activity.description}
                createdDate={format(
                  new Date(activity.time),
                  "MM/dd/yyyy HH:mm:ss",
                )}
              ></RecentActivityItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}
