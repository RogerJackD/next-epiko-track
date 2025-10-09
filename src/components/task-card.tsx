import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Task } from '@/types/kanbanResponse'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({task} : TaskCardProps) {
  return (
    <Card>

        <div className="cursor-pointer">
            <CardHeader>
                <div className="flex items-start justify-between gap-2 pr-6">
                    <h3 className="font-medium text-sm leading-tight text-card-foreground">{task.title}</h3>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{task.startDate}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{task.dueDate}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{task.priority}</p>

            </CardContent>
        </div>
    </Card>
  )
}
