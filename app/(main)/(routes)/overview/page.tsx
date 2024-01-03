"use client";
import Notification from "@/components/ui/notification";
import Charts from "@/components/ui/overview/overview_chart";
import RecentActivityItem from "@/components/ui/overview/overview_recent_activity_item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { ArrowRightCircle, Bell } from "lucide-react";
import { use, useEffect, useState } from "react";
import scrollbar_style from "../../../../styles/scrollbar.module.css";
import styles from "./styles.module.css";
import { ActivityLog } from "@/entities/ActivityLog";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import ActivityLogService from "@/services/activityLogService";
import { format, isAfter, isBefore, set } from "date-fns";
import { SaleProfitByDayReport } from "@/entities/Report";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import ReportService from "@/services/reportService";
import InvoiceService from "@/services/invoiceService";
import { setInvoices } from "@/reducers/invoicesReducer";
import ReturnInvoiceService from "@/services/returnInvoiceService";
import { cn } from "@/lib/utils";

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
  const [todayInvoiceAmount, setTodayInvoiceAmount] = useState<number>(0);
  const [previousDayInvoiceAmount, setPreviousDayInvoiceAmount] = useState(0);
  const [todayTotalReturnValue, setTodayTotalReturnValue] = useState(0);
  const [previousDayTotalReturnValue, setPreviousDayTotalReturnValue] =
    useState(0);
  const [saleProfitReport, setSaleProfitReport] =
    useState<SaleProfitByDayReport>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

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

      const todayInvoices = invoices.filter(
        (invoice) => isAfter(new Date(invoice.createdAt), today));

      const previousDayInvoices = invoices.filter(
        (invoice) => isAfter(new Date(invoice.createdAt), previousDay) && isBefore(new Date(invoice.createdAt), today));

      setTodayInvoiceAmount(todayInvoices.length);
      setPreviousDayInvoiceAmount(previousDayInvoices.length);

      const returnInvoicesCall = await ReturnInvoiceService.getAllReturnInvoices();
      const todayReturnsValue = returnInvoicesCall.data.filter(
        (invoice) => isAfter(new Date(invoice.createdAt), today)).map((v) => v.total).reduce((a, b) => a + b, 0);
      const previousDayReturnValue = returnInvoicesCall.data.filter(
        (invoice) => isAfter(new Date(invoice.createdAt), previousDay) && isBefore(new Date(invoice.createdAt), today)).map((v) => v.total).reduce((a, b) => a + b, 0);
      setTodayTotalReturnValue(todayReturnsValue);
      setPreviousDayTotalReturnValue(previousDayReturnValue);

      const activityCall = await ActivityLogService.getAllActivityLogs();
      setActivityLogs(activityCall.data);
      const saleProfitReportCall = await ReportService.getSaleProfitByDayReport(
        today,
        previousDay,
      );
      const reportData = saleProfitReportCall.data;
      if (reportData.length === 0) {
        reportData.push({
          costPrice: 0,
          revenue: 0,
          date: "",
          profit: 0,
        });
      }
      if (reportData.length === 1) {
        reportData.push({
          costPrice: 0,
          revenue: 0,
          date: "",
          profit: 0,
        });
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
          <Popover>
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
          </Popover>
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
              <h2 className="my-2 text-3xl font-bold">{todayInvoiceAmount}</h2>
              <p className="text-xs text-gray-500">
                <span className={cn(todayInvoiceAmount > previousDayInvoiceAmount ? "text-green-500" : "text-red-500")}>{todayInvoiceAmount >= previousDayInvoiceAmount
                    ? "+"
                    : "-"}
                    {Math.abs(
                        ((todayInvoiceAmount - previousDayInvoiceAmount) /
                          Math.max(previousDayInvoiceAmount, 1)) *
                          100
                      ).toFixed(2)}
                  %</span> compare to last day
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
                <span className={cn(saleProfitReport[1].revenue > saleProfitReport[0].revenue ? "text-green-500" : "text-red-500")}>
                  {saleProfitReport[1].revenue >= saleProfitReport[0].revenue
                    ? "+"
                    : "-"}
                  {Math.abs(
                        ((saleProfitReport[1].revenue - saleProfitReport[0].revenue) /
                          Math.max(saleProfitReport[0].revenue, 1)) *
                          100
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
              <h2 className="my-2 text-3xl font-bold">{todayTotalReturnValue} VND</h2>
              <p className="text-xs text-gray-500">
                <span className={cn(todayTotalReturnValue <= previousDayTotalReturnValue ? "text-green-500" : "text-red-500")}>{todayTotalReturnValue <= previousDayTotalReturnValue ? "-" : "+"}
                  {Math.abs(
                        ((todayTotalReturnValue - previousDayTotalReturnValue) /
                          Math.max(previousDayTotalReturnValue, 1)) *
                          100
                      ).toFixed(2)}%</span> compare to last month
              </p>
            </div>
            <div
              className={
                styles.overview_card_4 +
                " rounded-lg border-t p-4 text-start shadow-md"
              }
            >
              <h4 className="text-xs text-gray-500">Cost</h4>
              <h2 className="my-2 text-3xl font-bold">{saleProfitReport[1].costPrice}{" "}VND</h2>
              <p className="text-xs text-gray-500">
                <span className={cn(saleProfitReport[1].costPrice <= saleProfitReport[0].costPrice ? "text-green-500" : "text-red-500")}>
                  {saleProfitReport[1].costPrice <= saleProfitReport[0].costPrice ? "-" : "+"}
                  {Math.abs(
                        ((saleProfitReport[1].costPrice - saleProfitReport[0].costPrice) /
                          Math.max(saleProfitReport[0].costPrice, 1)) *
                          100
                      ).toFixed(2)
                    }%
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
            <Select defaultValue="apple">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Charts.BarChart />
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
        <ScrollArea scrollHideDelay={100}>
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
        </ScrollArea>
      </div>
    </div>
  );
}
