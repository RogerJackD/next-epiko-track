import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Task } from '@/types/kanbanResponse'
import { Badge } from './ui/badge'
import { Calendar, Clock, Edit, MoreVertical, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { taskService } from '@/services/task-service'

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
}

const formatDate = (date: Date | string | number) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // Evita errores si fecha no es validaa
  return d.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};


const handleDelete = (taskId: number) => {
   taskService.deleteTask(taskId)
    .then(response => {
      console.log(response.message);
      // Aquí puedes actualizar el estado de tu aplicación para reflejar la eliminación
    })
  }

export default function TaskCard({task} : TaskCardProps) {
  return (
    <Card className="bg-card group relative">

        <div className='absolute top-2 right-2 group-hover:opacity-100 transition-opacity z-10  '>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-3 w-3 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
              <Trash2 className="h-3 w-3 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

        <div className="cursor-pointer">
            <CardHeader>
                <div className="flex items-start justify-between gap-2 pr-6">
                    <h3 className="font-medium text-sm leading-tight text-card-foreground">{task.title}</h3>
                     <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]} shrink-0`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                

                {(task.startDate || task.dueDate) && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {task.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.startDate)}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                )}

            </CardContent>
        </div>
    </Card>
  )
}
