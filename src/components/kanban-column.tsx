import React from 'react'
import { Badge } from './ui/badge'
import { Task } from '@/types/kanbanResponse'
import TaskCard from './task-card'
import { useDroppable } from '@dnd-kit/core'

interface KanbanColumnProps {
  id: string 
  title: string
  status: string
  tasks?: Task[]
  totalTasks?: number  // ✅ Agregado
  onTaskDeleted: () => void
  currentBoardId: string | null
}

export default function KanbanColumn({
  id, 
  title, 
  tasks, 
  totalTasks,  // ✅ Agregado
  onTaskDeleted, 
  currentBoardId
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const filteredCount = tasks?.length || 0;
  const total = totalTasks || filteredCount;
  const isFiltered = filteredCount !== total;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg border bg-muted/50">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-green-700">
            {filteredCount}
          </Badge>
          {isFiltered && (
            <span className="text-xs text-muted-foreground">
              de {total}
            </span>
          )}
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`pt-1 flex-1 space-y-3 overflow-y-auto px-1 rounded-lg border-2 border-dashed transition-colors ${
        isOver ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-400' : 'border-border'
        }`}
      >
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDeleted={onTaskDeleted} 
              currentBoardId={currentBoardId} 
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {isOver ? 'Suelta aquí' : isFiltered ? 'Sin tareas que coincidan' : 'No hay tareas'}
          </p>
        )}
      </div>
    </div>
  )
}