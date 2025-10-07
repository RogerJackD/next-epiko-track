import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { TableIcon } from 'lucide-react'
import React from 'react'

export default function KanbanHeader() {

  const statuses = [
  { value: "all", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en-progreso", label: "En Progreso" },
  { value: "en-revision", label: "En Revisión" },
  { value: "completado", label: "Completado" },
]

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

      <div className="flex items-center gap-2">
        <TableIcon/>
        <Select
            value={""}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
      
    </div>
  )
}
