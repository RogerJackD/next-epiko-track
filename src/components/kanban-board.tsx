'use client'

import { DndContext } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
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
    boardIdValue : string
}

export default function KanbanBoard({ boardIdValue }: KanbanBoardProps) {

    const [kanbanData, setKanbanData] = useState<KanbanBoardResponse>();

    useEffect(() => {
        const handleFetchKanbanById = async () => {
            const BoardKanbanResponse: KanbanBoardResponse = await kanbanService.getKanbanBoardById(boardIdValue);
            console.log(BoardKanbanResponse);
            setKanbanData(BoardKanbanResponse);
        }
        handleFetchKanbanById();
    }, [boardIdValue])
    
  return (
    <DndContext>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            {columns.map((column) => {
                const columnData = kanbanData?.columns[column.id as keyof typeof kanbanData.columns];
                const tasks = columnData?.tasks ?? []; 
                return (
                    <>
                        <KanbanColumn key={column.id} title={column.title} status={column.id} tasks={tasks}/>
                    </>
                )
            })}
        </div>
    </DndContext>
  )
}
