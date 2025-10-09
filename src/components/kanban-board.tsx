import { DndContext } from '@dnd-kit/core'
import React from 'react'

const columns = [
  { id: "pendiente", title: "Pendiente" },
  { id: "en-progreso", title: "En Progreso" },
  { id: "en-revision", title: "En Revisión" },
  { id: "completado", title: "Completado" },
]

interface KanbanBoardProps {
    boardIdValue : string
}

export default function KanbanBoard({ boardIdValue }: KanbanBoardProps) {
  return (
    <DndContext>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            {columns.map((column) => {
                return (
                    <span key={column.id}>{column.title} el id del board actual es {boardIdValue}</span>
                )
            })}
        </div>
    </DndContext>
  )
}
