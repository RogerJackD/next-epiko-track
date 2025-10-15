'use client'

import { DndContext } from '@dnd-kit/core'
import React, { useCallback, useEffect, useState } from 'react'
import KanbanColumn from './kanban-column'
import { kanbanService } from '@/services/kanban-service'
import { KanbanBoardResponse } from '@/types/kanbanResponse'

const columns = [
  { id: "por_hacer", title: "Pendiente" },
  { id: "en_proceso", title: "En Progreso" },
  { id: "en_revision", title: "En Revisión" },
  { id: "completado", title: "Completado" },
]

interface KanbanBoardProps {
    boardIdValue: string;
    activeArea: string; 
}

export default function KanbanBoard({ boardIdValue, activeArea }: KanbanBoardProps) {

    const [kanbanData, setKanbanData] = useState<KanbanBoardResponse>();
    const [isLoading, setIsLoading] = useState(false);


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
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Cargando tablero...</p>
            </div>
        );
    }

    return (
        <DndContext>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {columns.map((column) => {
                    const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
                    const tasks = columnData?.tasks ?? []; 
                    return (
                        <KanbanColumn key={column.id} title={column.title} status={column.id} tasks={tasks} onTaskDeleted={fetchKanbanData} currentBoardId={boardIdValue} />
                    )
                })}
            </div>
        </DndContext>
    )
}