"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Notification from "@/components/ui/notification";
import SideBar from "@/components/ui/overview_sidebar";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./styles.module.css";
import OverviewChart from "@/components/ui/overview_chart";
import { useApp } from "@/helpers/planby/useApp";
import { Timeline } from "@/components/ui/overview_timeline";
import { ChannelItem } from "@/components/ui/overview_channel_item";
import { ProgramItem } from "@/components/ui/overview_program_item";
import { Epg, Layout } from "planby";

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

export default function Home() {
  // const [pageContent, setPageContent] = useState<string>("Overview")
  const [calendarDate, setCalenderDate] = useState(new Date());
  const { isLoading, getEpgProps, getLayoutProps } = useApp();

  return (
    <section className="flex flex-row h-screen w-screen">
      <SideBar />
      <div className="text-center flex flex-col bg-slate-100 h-screen max-h-screen px-12 py-2 overflow-hidden">
        <h2 className="text-start font-semibold text-3xl my-4">Overview</h2>
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
          <div
            className={
              styles.overview_card_5 +
              " rounded-lg shadow-md text-start p-4 border-t flex items-center justify-center"
            }
          >
            {OverviewChart()}
          </div>
        </div>
        <div className="h-full overflow-hidden">
          <Epg isLoading={isLoading} {...getEpgProps()}>
            <Layout
              {...getLayoutProps()}
              renderTimeline={(props) => <Timeline {...props} />}
              renderProgram={({ program, ...rest }) => (
                <ProgramItem
                  key={program.data.id}
                  program={program}
                  {...rest}
                />
              )}
              renderChannel={({ channel }) => (
                <ChannelItem key={channel.uuid} channel={channel} />
              )}
            />
          </Epg>
        </div>
      </div>
      <div className="bg-slate-100 w-[280px] hidden xl:flex xl:flex-col items-center pr-4">
        <Calendar
          mode="single"
          selected={calendarDate}
          onSelect={(date) => {
            if (date != null) setCalenderDate(date);
          }}
        />
        <div className="flex flex-col mt-4 overflow-hidden">
          <div className="font-semibold items-baseline justify-between flex flex-row">
            <h3 className="items-baseline text-lg">Notifications</h3>
            <Link
              href={"/notifications"}
              className="text-xs text-blue-400 hover:text-blue-600 hover:font-semibold"
            >
              Show all
              <ArrowRight width={12} height={12} className="inline-block" />
            </Link>
          </div>
          <Tabs
            defaultValue="today"
            className="mb-4 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2 bg-blue-300">
              <TabsTrigger
                value="today"
                className="data-[state=inactive]:text-white"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="last_7_days"
                className="data-[state=inactive]:text-white"
              >
                Last 7 days
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="today"
              className={
                "shadow-xl rounded-sm border border-gray-200 overflow-y-scroll " +
                styles.scrollbar
              }
            >
              {notifications.map((notification) => (
                <Notification {...notification} key={notification!.id} />
              ))}
            </TabsContent>
            <TabsContent
              value="last_7_days"
              className={
                "shadow-xl rounded-sm border border-gray-200 overflow-y-scroll " +
                styles.scrollbar
              }
            >
              {notifications.map((notification) => (
                <Notification {...notification} key={notification!.id} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
