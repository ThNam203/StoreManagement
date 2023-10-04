"use client";

import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/datepicker";
import { Bell } from "lucide-react";

export default function StaffLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="w-full h-screen">
        <div className="w-full h-16 bg-white flex flex-row items-center justify-between px-20">
          <div>
            <span className="text-slate-500 text-xl">Staff Group</span>
          </div>
          <div className="flex flex-row items-center">
            <DatePicker />
            <div className="relative hover:opacity-70 ease-linear duration-200 cursor-pointer">
              <Bell className="ml-6 " />
              <span className="absolute -top-2 -right-2 w-5 h-5 leading-[1.25rem] rounded-full bg-blue-800 text-white text-xs flex items-center justify-center">
                10
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white m-6 p-6 rounded-lg">{children}</div>
      </div>
    </section>
  );
}
