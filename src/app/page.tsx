'use client'

import AdminPanel from "@/components/admin-panel";
import AppSidebar from "@/components/app-sidebar";
import KanbanBoard from "@/components/kanban-board";
import KanbanHeader from "@/components/kanban-header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { areasData } from "@/data/area.data";
import { useEffect, useState } from "react";


export default function Home() {

  const [activeArea, setActiveArea] = useState("1"); // id por defecto "1" = tecnologia

  const [boardId, setBoardId] = useState("1") //id board 1 por = defecto primer tablero de tecnlogia
  
  useEffect(() => {
    console.log(boardId)
  }, [boardId])
  

  const renderContent = () => {
    console.log(activeArea)
    if (activeArea === "admin") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <AdminPanel />
        </main>
      )
    }

    return (
      <>
        {(() => {
          const area = areasData.find(area => area.id === activeArea);

          return area ? (
            <>
              <KanbanHeader activeArea={area} onBoardChange={setBoardId} />
              <main className="flex-1 overflow-auto bg-muted/30 p-6">
                <KanbanBoard boardIdValue={boardId}/>
              </main>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Seleccione un área para ver su contenido.</p>
            </div>
          );
        })()}
      </>   
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
