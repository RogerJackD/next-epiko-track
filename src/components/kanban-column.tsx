// components/kanban-column.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Task } from '@/types/kanbanResponse'
import TaskCard from './task-card'
import { useDroppable } from '@dnd-kit/core'
import CreateTaskDialog from './create-task-dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
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
        className={`flex flex-col h-full border-t-4 transition-all ${
          columnStyles[id as keyof typeof columnStyles]
        } ${isOver ? 'ring-2 ring-primary bg-accent/50' : ''}`}
      >
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge variant="secondary" className="h-6 px-2">
                {totalTasks}
              </Badge>
            </div>
            {id === 'por_hacer' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setOpenCreateDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              {totalTasks === 0 ? 'No hay tareas' : 'Sin tareas visibles'}
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