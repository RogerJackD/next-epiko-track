import { DndContext } from '@dnd-kit/core'
import React from 'react'

const columns = [
  { id: "pendiente", title: "Pendiente" },
  { id: "en-progreso", title: "En Progreso" },
  { id: "en-revision", title: "En Revisión" },
  { id: "completado", title: "Completado" },
]

export default function KanbanBoard() {
  return (
    <DndContext>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            {columns.map((column) => {
                return (
                    <span key={column.id}>{column.title}</span>
                )
            })}
        </div>
    </DndContext>
  )
}
