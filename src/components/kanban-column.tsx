// components/kanban-column.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Task } from '@/types/kanbanResponse'
import TaskCard from './task-card'
import { useDroppable } from '@dnd-kit/core'
import CreateTaskDialog from './create-task-dialog'
import { Badge } from './ui/badge'

interface KanbanColumnProps {
  id: string
  title: string
  status: string
  tasks: Task[]
  totalTasks: number
  currentBoardId: string | null
}

export default function KanbanColumn({ 
  id, 
  title, 
  tasks, 
  totalTasks,
  currentBoardId 
}: KanbanColumnProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const columnStyles = {
    por_hacer: "border-t-blue-500",
    en_proceso: "border-t-yellow-500",
    en_revision: "border-t-purple-500",
    completado: "border-t-green-500",
  }

  return (
    <>
      <Card 
        ref={setNodeRef}
        className={`flex flex-col h-full border-t-4 transition-all duration-200 ${
          columnStyles[id as keyof typeof columnStyles]
        } ${isOver ? 'bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-300/50 dark:ring-blue-700/50' : ''}`}
      >
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge variant="secondary" className="h-6 px-2">
                {totalTasks}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {tasks.length === 0 ? (
            <div className={`flex items-center justify-center h-32 text-sm transition-colors duration-200 ${
              isOver ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
            }`}>
              {isOver ? 'Suelta aquí' : totalTasks === 0 ? 'No hay tareas' : 'Sin tareas visibles'}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                currentBoardId={currentBoardId}
              />
            ))
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog 
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        currentBoardId={currentBoardId}
      />
    </>
  )
}