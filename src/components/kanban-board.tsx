'use client'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import React, { useCallback, useEffect, useState } from 'react'
import KanbanColumn from './kanban-column'
import { kanbanService } from '@/services/kanban-service'
import { KanbanBoardResponse, Task } from '@/types/kanbanResponse'
import { taskService } from '@/services/task-service'
import TaskCard from './task-card'

const columns = [
  { id: "por_hacer", title: "Pendiente", statusId: 1 },
  { id: "en_proceso", title: "En Progreso", statusId: 2 },
  { id: "en_revision", title: "En Revisión", statusId: 3 },
  { id: "completado", title: "Completado", statusId: 4 },
]

interface KanbanBoardProps {
    boardIdValue: string;
    activeArea: string; 
}

export default function KanbanBoard({ boardIdValue, activeArea }: KanbanBoardProps) {

    const [kanbanData, setKanbanData] = useState<KanbanBoardResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Configurar sensores para el drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, 
            },
        })
    );

    const fetchKanbanData = useCallback(async () => {
        setIsLoading(true);
        try {
            const BoardKanbanResponse: KanbanBoardResponse = await kanbanService.getKanbanBoardById(boardIdValue);
            console.log("Kanban data cargada:", BoardKanbanResponse);
            setKanbanData(BoardKanbanResponse);
        } catch (error) {
            console.error("Error al cargar el kanban:", error);
        } finally {
            setIsLoading(false);
        }
    }, [boardIdValue]);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData, activeArea]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const taskId = active.id;
        
        // Buscar la tarea en todas las columnas
        for (const column of columns) {
            const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
            const task = columnData?.tasks.find(t => t.id === taskId);
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as number;
        const newColumnId = over.id as string;

        // Encontrar el statusId correspondiente a la columna
        const targetColumn = columns.find(col => col.id === newColumnId);
        if (!targetColumn) return;

        // Encontrar la columna actual de la tarea
        let currentColumnId: string | null = null;
        for (const column of columns) {
            const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
            if (columnData?.tasks.some(t => t.id === taskId)) {
                currentColumnId = column.id;
                break;
            }
        }

        // Si no cambió de columna entoncess no hacer nada
        if (currentColumnId === newColumnId) return;

        try {
            await taskService.updateTaskStatus(taskId, targetColumn.statusId);
            console.log(`Tarea ${taskId} movida a ${newColumnId} (status ${targetColumn.statusId})`);
            
            await fetchKanbanData();
        } catch (error) {
            console.error("Error al mover la tarea:", error);
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
                    const tasks = columnData?.tasks ?? []; 
                    return (
                        <KanbanColumn 
                            key={column.id} 
                            id={column.id}
                            title={column.title} 
                            status={column.id} 
                            tasks={tasks} 
                            onTaskDeleted={fetchKanbanData} 
                            currentBoardId={boardIdValue} 
                        />
                    )
                })}
            </div>
            
            {/* Overlay para mostrar la tarea mientras se arrastra */}
            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-3 opacity-80">
                        <TaskCard 
                            task={activeTask} 
                            onDeleted={() => {}} 
                            currentBoardId={boardIdValue}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}