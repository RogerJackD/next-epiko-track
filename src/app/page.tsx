'use client'

import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

export default function Home() {

  const [activeArea, setActiveArea] = useState("marketing")

  return (
    <SidebarProvider>
      <h1>asd</h1>
      <div className="flex h-screen w-full p-4">
        <AppSidebar activeArea={activeArea} onAreaChange={setActiveArea}/>
      </div>
    </SidebarProvider>
  );
}
