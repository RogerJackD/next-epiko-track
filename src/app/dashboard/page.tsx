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
      console.log("Área inicial del usuario:", user.area.id);
    }
  }, [user?.area?.id]);

  // Log cada vez que cambian activeArea o boardId
  useEffect(() => {
    console.log('📊 [Estado] activeArea:', activeArea, '| boardId:', boardId);
  }, [activeArea, boardId]);

  const handleNavigateToBoard = useCallback((board: Project) => {
    console.log('🔴 [Dashboard] handleNavigateToBoard EJECUTADO');
    console.log('🔴 [Dashboard] Board recibido:', board);
    console.log('🔴 [Dashboard] Board ID:', board.id, 'tipo:', typeof board.id);
    console.log('🔴 [Dashboard] Area ID:', board.area.id, 'tipo:', typeof board.area.id);
    
    const targetAreaId = board.area.id.toString();
    const targetBoardId = board.id.toString();
    
    console.log('🔴 [Dashboard] Convirtiendo a strings:', {targetAreaId, targetBoardId});
    console.log('🔴 [Dashboard] Llamando setActiveArea con:', targetAreaId);
    console.log('🔴 [Dashboard] Llamando setBoardId con:', targetBoardId);
    
    setActiveArea(targetAreaId);
    setBoardId(targetBoardId);
    
    console.log('🔴 [Dashboard] Estados actualizados (pending)');
    
    toast.success('Tablero cargado', {
      description: `${board.title} - ${board.area.name}`,
      duration: 2000,
    });
  }, []);

  const handleAreaChange = useCallback((newArea: string) => {
    console.log('🔄 [Dashboard] Cambio manual de área a:', newArea);
    setActiveArea(newArea);
    setBoardId(null);
  }, []);

  const renderContent = () => {
    console.log('🎨 [Render] Renderizando - activeArea:', activeArea, 'boardId:', boardId);
    
    if (activeArea === "userManagement") {
      return (
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          <AdminPanel />
        </main>
      );
    }
    
    if (activeArea === "boardManagement") {
      console.log('🎨 [Render] Renderizando BoardManagementPanel');
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

    const area = areasData.find(area => area.id === activeArea);

    if (!area) {
      console.log('⚠️ [Render] Área no encontrada:', activeArea);
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground text-center">
            Seleccione un área para ver su contenido.
          </p>
        </div>
      );
    }

    console.log('🎨 [Render] Renderizando Kanban - área encontrada:', area);

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
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
          {boardId ? (
            <>
              {console.log('✅ [Render] Renderizando KanbanBoard con boardId:', boardId)}
              <KanbanBoard 
                boardIdValue={boardId} 
                activeArea={activeArea} 
                key={`${boardId}-${refreshTrigger}`}
                onProgressChange={(total, completed) => setProgress({ total, completed })}
                filters={filters}
              />
            </>
          ) : (
            <>
              {console.log('❌ [Render] No hay boardId, mostrando placeholder')}
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center px-4">
                  Seleccione un tablero para visualizar
                </p>
              </div>
            </>
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
