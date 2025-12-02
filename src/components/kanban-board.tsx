'use client'

import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  MouseSensor,
  TouchSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import KanbanColumn from './kanban-column'
import { kanbanService } from '@/services/kanban-service'
import { KanbanBoardResponse, Task } from '@/types/kanbanResponse'
import { taskService } from '@/services/task-service'
import TaskCard from './task-card'
import { usePermissions } from '@/hooks/usePermissions'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { TaskFilters } from './kanban-header'
import { socketService } from '@/services/socket-service/socket-service'
import { UserRole } from '@/types/permissions'

const columns = [
  { id: "por_hacer", title: "Por Hacer", statusId: 1 },
  { id: "en_proceso", title: "En Progreso", statusId: 2 },
  { id: "en_revision", title: "En Revisión", statusId: 3 },
  { id: "completado", title: "Completado", statusId: 4 },
]

interface KanbanBoardProps {
    boardIdValue: string;
    activeArea: string;
    onProgressChange?: (total: number, completed: number) => void;
    filters?: TaskFilters;
}

export default function KanbanBoard({ 
  boardIdValue, 
  activeArea, 
  onProgressChange,
  filters 
}: KanbanBoardProps) {
    const [kanbanData, setKanbanData] = useState<KanbanBoardResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const { user } = useAuth();
    
    const { canMoveTask } = usePermissions();
    
    const prevProgressRef = useRef({ total: 0, completed: 0 });
    const isSubscribedRef = useRef(false);

    const sensors = useSensors(
    useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,      // Aumentado a 250ms
            tolerance: 8,    // Aumentado a 8px
        },
    })
    );

    // Filtrar tareas
    const filterTasks = useCallback((tasks: Task[]): Task[] => {
      if (!filters) return tasks;

      return tasks.filter(task => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        if (filters.priority !== 'ALL' && task.priority !== filters.priority) {
          return false;
        }

        if (filters.assignedToMe && user) {
          const isAssignedToMe = task.assignedUsers?.some(
            au => au.user.id === user.id
          );
          if (!isAssignedToMe) return false;
        }

        return true;
      });
    }, [filters, user]);

    // Calcular progreso
    const progress = useMemo(() => {
      if (!kanbanData) return { total: 0, completed: 0 };

      let total = 0;
      let completed = 0;

      Object.values(kanbanData.columns).forEach(column => {
        const filteredTasks = filterTasks(column.tasks);
        total += filteredTasks.length;
      });

      const completedColumn = kanbanData.columns.completado;
      if (completedColumn) {
        completed = filterTasks(completedColumn.tasks).length;
      }

      return { total, completed };
    }, [kanbanData, filterTasks]);

    // Solo llamar onProgressChange cuando realmente cambió el progreso
    useEffect(() => {
      const { total, completed } = progress;
      const prev = prevProgressRef.current;
      
      if (prev.total !== total || prev.completed !== completed) {
        prevProgressRef.current = { total, completed };
        onProgressChange?.(total, completed);
      }
    }, [progress.total, progress.completed, onProgressChange]);

    //Configurar WebSocket para actualizaciones en tiempo real
    useEffect(() => {
      if (!user?.id || !boardIdValue || isSubscribedRef.current) return;

      console.log(`🔌 Configurando WebSocket para tablero ${boardIdValue}`);

      // Conectar socket
      socketService.connect();

      // Suscribirse al tablero
      socketService.subscribeToBoard(
        Number(boardIdValue),
        user.id,
        // Callback para datos iniciales
        (initialData) => {
          
          if (!initialData) {
            //fetchKanbanData();
            return;
          }
          
          setKanbanData(initialData);
          setIsLoading(false);
        },
        // Callback para actualizaciones en tiempo real
        (updatedData) => {
          if (!updatedData) {
            return;
          }
          
          //Actualizar estado sin importar quién hizo el cambio
          setKanbanData({
            board_id: updatedData.board_id,
            board_name: updatedData.board_name,
            columns: updatedData.columns,
          });
        }
      );

      isSubscribedRef.current = true;

      // Cleanup: desuscribirse al desmontar o cambiar de tablero
      return () => {
        console.log(`🔌 Desuscribiendo del tablero ${boardIdValue}`);
        socketService.unsubscribeFromBoard(Number(boardIdValue));
        isSubscribedRef.current = false;
      };
    }, [user?.id, boardIdValue]);
    
    //Resetear suscripción cuando cambia de área
    useEffect(() => {
      if (isSubscribedRef.current) {
        socketService.unsubscribeFromBoard(Number(boardIdValue));
        isSubscribedRef.current = false;
        setIsLoading(true);
      }
    }, [activeArea, boardIdValue]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const taskId = active.id;
        
        for (const column of columns) {
            const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
            const task = columnData?.tasks.find(t => t.id === taskId);
            if (task) {
                const taskUserIds = task.assignedUsers?.map(au => au.user.id) || [];
                
                if (!canMoveTask(taskUserIds)) {
                    toast.error(
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Lock className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Acceso denegado</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            No tienes permiso para mover esta tarea
                          </p>
                        </div>
                      </div>,
                      {
                        duration: 3000,
                        className: 'bg-white border-l-4 border-l-red-500',
                      }
                    );
                    return;
                }
                
                setActiveTask(task);
                break;
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!activeTask) {
            return;
        }

        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as number;
        const newColumnId = over.id as string;

        const targetColumn = columns.find(col => col.id === newColumnId);
        if (!targetColumn) return;

        let currentColumnId: string | null = null;
        for (const column of columns) {
            const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
            if (columnData?.tasks.some(t => t.id === taskId)) {
                currentColumnId = column.id;
                break;
            }
        }

        if (currentColumnId === newColumnId) return;

        const taskUserIds = activeTask.assignedUsers?.map(au => au.user.id) || [];
        if (!canMoveTask(taskUserIds)) {
            toast.error('No tienes permiso para mover esta tarea');
            return;
        }

        // ✅ NUEVA VALIDACIÓN: Usuarios con rol USER no pueden mover a "completado"
        const userRole = user?.role?.name?.toLowerCase() as UserRole;
        if (userRole === UserRole.USER && newColumnId === 'completado') {
            toast.error(
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Acción no permitida</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Solo administradores y managers pueden marcar tareas como completadas
                  </p>
                </div>
              </div>,
              {
                duration: 4000,
                className: 'bg-white border-l-4 border-l-orange-500',
              }
            );
            return;
        }

        // ✨ Actualización optimista
        setKanbanData(prevData => {
          if (!prevData) return prevData;

          const newColumns = { ...prevData.columns };
          
          // Remover de columna actual
          if (currentColumnId) {
            const currentColumn = newColumns[currentColumnId as keyof typeof newColumns];
            if (currentColumn) {
              newColumns[currentColumnId as keyof typeof newColumns] = {
                ...currentColumn,
                tasks: currentColumn.tasks.filter(t => t.id !== taskId)
              };
            }
          }

          // Agregar a nueva columna
          const targetColumnData = newColumns[newColumnId as keyof typeof newColumns];
          if (targetColumnData) {
            const updatedTask = { ...activeTask, status: newColumnId as any };
            newColumns[newColumnId as keyof typeof newColumns] = {
              ...targetColumnData,
              tasks: [...targetColumnData.tasks, updatedTask]
            };
          }

          return {
            ...prevData,
            columns: newColumns
          };
        });

        try {
            await taskService.updateTaskStatus(taskId, targetColumn.statusId);
            toast.success('Tarea movida correctamente', {
              description: `Movida a ${targetColumn.title}`,
              duration: 2000,
            });
        } catch (error) {
            toast.error('Error al mover la tarea');
            console.log(error)
            // Revertir cambio optimista - forzar recarga desde WebSocket
            const refreshData = await kanbanService.getKanbanBoardById(boardIdValue);
            setKanbanData(refreshData);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Cargando tablero...</p>
            </div>
        );
    }

    return (
        <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {columns.map((column) => {
                    const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
                    const allTasks = columnData?.tasks ?? [];
                    const filteredTasks = filterTasks(allTasks);
                    
                    return (
                        <KanbanColumn 
                            key={column.id} 
                            id={column.id}
                            title={column.title} 
                            status={column.id} 
                            tasks={filteredTasks}
                            totalTasks={allTasks.length}
                            currentBoardId={boardIdValue} 
                        />
                    )
                })}
            </div>
            
            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-3 opacity-80">
                        <TaskCard 
                            task={activeTask} 
                            currentBoardId={boardIdValue}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}