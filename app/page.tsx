import SideBar from "@/components/ui/sidebar";
import { useState, useCallback } from "react";

export default function Home() {
  // const [pageContent, setPageContent] = useState<string>("Overview")

  return (
    <section className="flex flex-row">
      <SideBar />
      <div className="text-center flex-1 items-center justify-center bg-green-200 h-screen">
        Store Management Website
      </div>
    </section>
  );
}
