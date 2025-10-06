import React from 'react'

export default function KanbanHeader() {
  return (
    <div className="border-b bg-background px-6 py-4">
       <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-stretch-75% text-foreground">
            Tablero kanban - Epiko
          </h1>
          <p className="text-muted-foreground">Gestiona las tareas de tu equipo</p>
        </div>
      </div>
    </div>
  )
}
