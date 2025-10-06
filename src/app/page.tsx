'use client'

import AdminPanel from "@/components/admin-panel";
import AppSidebar from "@/components/app-sidebar";
import KanbanHeader from "@/components/kanban-header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

export default function Home() {

  const [activeArea, setActiveArea] = useState("marketing")

  const renderContent = () => {
    if (activeArea === "admin") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <AdminPanel />
        </main>
      )
    }

    return (
      <KanbanHeader/>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full p-4">
        <AppSidebar activeArea={activeArea} onAreaChange={setActiveArea}/>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-2">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}
