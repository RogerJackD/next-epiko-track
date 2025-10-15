import React from 'react'
import { Badge } from './ui/badge'
import { Task } from '@/types/kanbanResponse'
import TaskCard from './task-card'

interface KanbanColumnProps {
  title: string
  status: string
  tasks? : Task[]
  onTaskDeleted: () => void
  currentBoardId: string | null
}

export default function KanbanColumn({title, tasks, onTaskDeleted, currentBoardId}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg border bg-muted/50">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <Badge className="text-xs bg-green-700">
          {tasks ? tasks.length : 0}
        </Badge>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-1">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDeleted={onTaskDeleted} currentBoardId={currentBoardId} />
          ))
        ) : (
          <p className="text-muted-foreground">No tasks found</p>
        )}
      </div>

    </div>
  )
}
