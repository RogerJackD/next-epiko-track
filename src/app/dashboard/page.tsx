'use client'

import AdminPanel from "@/components/ui-user-managent/user-managent-panel";
import KanbanBoard from "@/components/kanban-board";
import KanbanHeader from "@/components/kanban-header";
import Notifications from "@/components/ui-notifications/notifications";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { areasData } from "@/data/area.data";
import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import AppSidebar from "@/components/app-sidebar";
import BoardManagementPanel from "@/components/ui-board-managent/board-managent-panel";
import TasksUserPanel from "@/components/ui-tasks-user/taks-user.panel";
import { useAuth } from "@/hooks/useAuth";
import { TaskFilters } from '@/components/kanban-header';
import { Project } from '@/types/board';
import { toast } from 'sonner';

function DashboardContent() {
  const { user } = useAuth();
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
    }
  }, [user?.area?.id]);

  const handleNavigateToBoard = useCallback((board: Project) => {
    const targetAreaId = board.area.id.toString();
    const targetBoardId = board.id.toString();
    
    // Primero cambiar área, luego boardId
    setActiveArea(targetAreaId);
    setBoardId(targetBoardId);
    
    toast.success('Tablero cargado', {
      description: `${board.title} - ${board.area.name}`,
      duration: 2000,
    });
  }, []);

  const handleAreaChange = useCallback((newArea: string) => {
    console.log('Cambio de área:', activeArea, '→', newArea);
    
    setActiveArea(newArea);
    
    // Limpiar boardId cuando cambias de área manualmente
    // Esto evita que se muestre el tablero del área anterior
    setBoardId(null);
    
  }, [activeArea]);

  const handleBoardChange = useCallback((newBoardId: string | null) => {
    console.log('[Navegación] Cambio de tablero:', boardId, ':', newBoardId);
    setBoardId(newBoardId);
  }, [boardId]);

  const renderContent = () => {
    
    // Secciones especiales (sin tableros Kanban)
    if (activeArea === "userManagement") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 md:p-6">
          <AdminPanel />
        </main>
      );
    }
    
    if (activeArea === "boardManagement") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          <BoardManagementPanel onNavigateToBoard={handleNavigateToBoard} />
        </main>
      );
    }

    if (activeArea === "notifications") {
      return (
        <div className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          <Notifications />
        </div>
      );
    }

    if (activeArea === "myTasks") {
      return (
        <div className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          <TasksUserPanel />
        </div>
      );
    }

    // Secciones de áreas con tableros Kanban
    const area = areasData.find(area => area.id === activeArea);

    if (!area) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground text-center">
            Seleccione un área para ver su contenido.
          </p>
        </div>
      );
    }

    return (
      <>
        <KanbanHeader 
          activeArea={area} 
          onBoardChange={handleBoardChange}
          currentBoardId={boardId}
          onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
          totalTasks={progress.total}
          completedTasks={progress.completed}
          onFiltersChange={setFilters}
        />
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          {boardId ? (
            <KanbanBoard 
              boardIdValue={boardId} 
              activeArea={activeArea} 
              key={`${boardId}-${refreshTrigger}`}
              onProgressChange={(total, completed) => setProgress({ total, completed })}
              filters={filters}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-lg font-medium">
                  Seleccione un tablero para comenzar
                </p>
                <p className="text-sm text-muted-foreground">
                  Use el selector de tableros en la barra superior
                </p>
              </div>
            </div>
          )}
        </main>
      </>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full p-2 md:p-4">
        <AppSidebar activeArea={activeArea} onAreaChange={handleAreaChange}/>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b px-2 md:px-4 py-2">
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