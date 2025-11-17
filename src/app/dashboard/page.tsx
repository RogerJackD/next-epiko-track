'use client'

import AdminPanel from "@/components/ui-user-managent/user-managent-panel";
import KanbanBoard from "@/components/kanban-board";
import KanbanHeader from "@/components/kanban-header";
import Notifications from "@/components/ui-notifications/notifications";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { areasData } from "@/data/area.data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { TokenService } from "@/services/auth/tokens";
import AuthGuard from "@/components/auth/auth-guard";
import AppSidebar from "@/components/app-sidebar";
import BoardManagementPanel from "@/components/ui-board-managent/board-managent-panel";
import TasksUserPanel from "@/components/ui-tasks-user/taks-user.panel";
import { useAuth } from "@/hooks/useAuth";
import { TaskFilters } from '@/components/kanban-header';
function DashboardContent() {
const router = useRouter()
  const { user } = useAuth()
  const [activeArea, setActiveArea] = useState<string>("");
  const [boardId, setBoardId] = useState<string | null>(null); 
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: 'ALL',
    assignedToMe: false,
  });
  // Establecer el área inicial según el área del usuario
  useEffect(() => {
    if (user?.area?.id) {
      setActiveArea(user.area.id.toString());
      console.log("Área inicial del usuario:", user.area.id);
    }
  }, [user?.area?.id]);

  // Resetear boardId cuando cambia el área
  useEffect(() => {
    setBoardId(null);
  }, [activeArea]);

  const handleLogout = () => {
    TokenService.clearAll() 
    router.push('/login')
  }

  const renderContent = () => {
    if (activeArea === "userManagement") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <AdminPanel />
        </main>
      );
    }
    if (activeArea === "boardManagement") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <BoardManagementPanel />
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

    if (activeArea === "myTasks") {
      return (
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <TasksUserPanel />
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
          totalTasks={progress.total}
          completedTasks={progress.completed}
          onFiltersChange={setFilters}
        />
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {boardId ? (
            <KanbanBoard 
              boardIdValue={boardId} 
              activeArea={activeArea} 
              key={refreshTrigger}
              onProgressChange={(total, completed) => setProgress({ total, completed })}
              filters={filters}
            />
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
          <div className="flex items-center justify-between border-b px-4 py-2">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}