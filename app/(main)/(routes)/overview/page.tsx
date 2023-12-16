"use client";
import Notification from "@/components/ui/notification";
import { ArrowRightCircle, Bell } from "lucide-react";
import styles from "./styles.module.css";
import scrollbar_style from "../../../../styles/scrollbar.module.css";
import OverviewChart from "@/components/ui/overview/overview_chart";
import React, { useEffect } from "react";
import RecentActivityItem from "@/components/ui/overview/overview_recent_activity_item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Charts from "@/components/ui/overview/overview_chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/hooks";
import { disablePreloader } from "@/reducers/preloaderReducer";

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

const recentActivities = [
  {
    id: 1,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Nam",
    actionDetail: " created a new page",
    target: " in New Zealand",
    createdAt: "Now",
  },
  {
    id: 2,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Alex",
    actionDetail: " made ",
    target: "a purchase",
    createdAt: "Now",
  },
  {
    id: 3,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Jessica",
    actionDetail: " restocked ",
    target: "the shelves",
    createdAt: "59 seconds ago",
  },
  {
    id: 4,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "David",
    actionDetail: " updated ",
    target: "the store's opening hours",
    createdAt: "5 minutes ago",
  },
  {
    id: 5,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Linda",
    actionDetail: " processed a refund for ",
    target: "a customer",
    createdAt: "3 hours 5 minutes ago",
  },
  {
    id: 6,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Mark",
    actionDetail: " detected ",
    target: "a suspicious activity",
    createdAt: "1 day ago",
  },
  {
    id: 7,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Emily",
    actionDetail: "reported",
    target: "an unusual incident",
    createdAt: "2 days ago",
  },
  {
    id: 8,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "John",
    actionDetail: "witnessed",
    target: "a security breach",
    createdAt: "3 days ago",
  },
  {
    id: 9,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Sarah",
    actionDetail: "noted",
    target: "a potential threat",
    createdAt: "4 days ago",
  },
  {
    id: 10,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Michael",
    actionDetail: "observed",
    target: "a suspicious package",
    createdAt: "5 days ago",
  },
  {
    id: 11,
    imageUrl: "https://i.pravatar.cc/300",
    staff: "Linda",
    actionDetail: "flagged",
    target: "an unauthorized access",
    createdAt: "6 days ago",
  },
];

export default function OverviewPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(disablePreloader())
    }

    fetchData()
  })

  return (
    // if we change 832px to another value, we must change it again in styles.module.css
    // and change the value of mediaquery of notification-board in the same folder
    // to make it work correctly
    <div className="flex flex-col min-[832px]:flex-row">
      <div className="flex flex-col flex-1 px-4 py-2 rounded-sm min-w-0 bg-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-start font-semibold text-2xl my-4">Overview</h2>
          <Popover>
            <PopoverTrigger className="w-[20px] h-[20px] self-center mr-4">
              <div className="relative">
                <Bell size={20} />
                <p className="absolute bg-blue-500 rounded-full text-xs -top-2 p-[2px] text-center -right-2">
                  10
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={
                "max-h-[300px] overflow-auto mr-8 p-2 " +
                scrollbar_style.scrollbar
              }
            >
              {notifications.map((notification) => (
                <Notification {...notification} key={notification!.id} />
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className={styles.overview_cards}>
          <div
            className={
              styles.overview_card_1 +
              " rounded-lg shadow-md text-start p-4 border-t"
            }
          >
            <h4 className="text-gray-500 text-xs">Total orders</h4>
            <h2 className="font-bold text-3xl my-2">239.342</h2>
            <p className="text-gray-500 text-xs">
              <span className="text-green-500">+3%</span> compare to last month
            </p>
          </div>
          <div
            className={
              styles.overview_card_2 +
              " rounded-lg shadow-md text-start p-4 border-t"
            }
          >
            <h4 className="text-gray-500 text-xs">Revenue</h4>
            <h2 className="font-bold text-3xl my-2">150.340.340 VND</h2>
            <p className="text-gray-500 text-xs">
              <span className="text-red-500">-5%</span> compare to last month
            </p>
          </div>
          <div
            className={
              styles.overview_card_3 +
              " rounded-lg shadow-md text-start p-4 border-t"
            }
          >
            <h4 className="text-gray-500 text-xs">Refunds</h4>
            <h2 className="font-bold text-3xl my-2">2.340.500 VND</h2>
            <p className="text-gray-500 text-xs">
              <span className="text-red-500">+3%</span> compare to last month
            </p>
          </div>
          <div
            className={
              styles.overview_card_4 +
              " rounded-lg shadow-md text-start p-4 border-t"
            }
          >
            <h4 className="text-gray-500 text-xs">Cost</h4>
            <h2 className="font-bold text-3xl my-2">25.400.000 VND</h2>
            <p className="text-gray-500 text-xs">
              <span className="text-green-500">-10%</span> compare to last month
            </p>
          </div>
        </div>
        <div
          className={
            " rounded-lg shadow-md text-start p-4 border-t flex flex-col items-center justify-center my-4"
          }
        >
          <div className="flex flex-row items-center w-full">
            <h3 className="uppercase font-bold start">
              Doanh thu thuần hôm nay
            </h3>
            <ArrowRightCircle
              size={16}
              fill="rgb(148 163 184)"
              className="mx-2"
            />
            <h3 className="uppercase font-bold mr-2">2.245.500VND</h3>
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
        <h3 className="uppercase font-semibold my-2">Recent activities</h3>
        <ScrollArea scrollHideDelay={100}>
          {recentActivities.map((activity) => (
            <RecentActivityItem
              {...activity}
              key={activity.id}
            ></RecentActivityItem>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
