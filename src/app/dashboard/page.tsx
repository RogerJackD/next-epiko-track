'use client'

import AdminPanel from "@/components/admin-panel";
import AppSidebar from "@/components/app-sidebar";
import KanbanBoard from "@/components/kanban-board";
import KanbanHeader from "@/components/kanban-header";
import Notifications from "@/components/ui-notifications/notifications";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { areasData } from "@/data/area.data";
import { useEffect, useState } from "react";


export default function Dashboard() {

  const [activeArea, setActiveArea] = useState("1");
  const [boardId, setBoardId] = useState<string | null>(null); 
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Resetear boardId cuando cambia el área
  useEffect(() => {
    setBoardId(null); // Resetea el boardId al cambiar de area
  }, [activeArea]);

  useEffect(() => {
    console.log("boardId actual:", boardId);
  }, [boardId]);

  const renderContent = () => {
    console.log("activeArea:", activeArea);
    
    if (activeArea === "admin") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <AdminPanel />
        </main>
      );
    }

    if (activeArea === "notifications") {
      return (
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <Notifications />
        </div>
      );
    }

    const area = areasData.find(area => area.id === activeArea);

    if (!area) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Seleccione un área para ver su contenido.</p>
        </div>
      );
    }

    return (
      <>
        <KanbanHeader 
          activeArea={area} 
          onBoardChange={setBoardId}
          currentBoardId={boardId}
          onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
        />
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {boardId ? (
            <KanbanBoard boardIdValue={boardId} activeArea={activeArea} key={refreshTrigger}/>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Seleccione un tablero para visualizar</p>
            </div>
          )}
        </main>
      </>
    );
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