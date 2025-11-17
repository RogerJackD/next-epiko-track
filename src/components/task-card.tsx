import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Task } from '@/types/kanbanResponse'
import { Badge } from './ui/badge'
import { Calendar, Clock, Edit, MoreVertical, Trash2, Lock } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { taskService } from '@/services/task-service'
import EditTaskDialog from './edit-task-dialog'
import { useDraggable } from '@dnd-kit/core' 
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { usePermissions } from '@/hooks/usePermissions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface TaskCardProps {
  task: Task
  onDeleted: () => void
  currentBoardId: string | null 
}

const priorityColors = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
}

const formatDate = (date: Date | string | number) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};

export default function TaskCard({task, onDeleted} : TaskCardProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Hook de permisos
  const { canEditTask, canDeleteTask } = usePermissions();
  
  // Obtener IDs de usuarios asignados
  const taskUserIds = task.assignedUsers?.map(au => au.user.id) || [];
  
  // Verificar permisos
  const hasEditPermission = canEditTask(taskUserIds);
  const hasDeletePermission = canDeleteTask(taskUserIds);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    try {
      const response = await taskService.deleteTask(task.id);
      console.log(response.message);
      toast.success('Tarea eliminada', {
        description: 'La tarea se ha eliminado correctamente'
      })
      onDeleted();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error('Error al eliminar', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleEditClick = () => {
    if (!hasEditPermission) {
      toast.error(
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Acceso denegado</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              No tienes permiso para editar esta tarea
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          className: 'bg-white border-l-4 border-l-red-500',
        }
      );
      return;
    }
    setOpenEditDialog(true);
  }

  const handleDeleteClick = () => {
    if (!hasDeletePermission) {
      toast.error(
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Acceso denegado</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              No tienes permiso para eliminar esta tarea
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          className: 'bg-white border-l-4 border-l-red-500',
        }
      );
      return;
    }
    setOpenDeleteDialog(true);
  }

  return (
    <>
      <Card 
        ref={setNodeRef} 
        style={style}
        className={`bg-gray-50 group relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        {...attributes}
        {...listeners}
      >
        <div className='absolute top-2 right-2 group-hover:opacity-100 transition-opacity z-10'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={handleEditClick}
                disabled={!hasEditPermission}
                className={!hasEditPermission ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Edit className="h-3 w-3 mr-2" />
                Editar
                {!hasEditPermission && <Lock className="h-3 w-3 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteClick}
                disabled={!hasDeletePermission}
                className={`${!hasDeletePermission ? 'opacity-50 cursor-not-allowed' : 'text-destructive'}`}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Eliminar
                {!hasDeletePermission && <Lock className="h-3 w-3 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <CardHeader>
            <div className="flex items-start justify-between gap-2 pr-6">
              <h3 className="font-medium text-sm leading-tight text-card-foreground">{task.title}</h3>
              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]} shrink-0`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Asignado a</span>
              <div className="flex flex-wrap gap-1">
                {task.assignedUsers && task.assignedUsers.length > 0 ? (
                  task.assignedUsers.map((assigned, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      {assigned.user.firstName} {assigned.user.lastName}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">Sin asignar</span>
                )}
              </div>
            </div>

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

      {/* Modal de edición */}
      <EditTaskDialog 
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        task={task}
        onTaskUpdated={onDeleted}
      />

      {/*Modal de confirmación de eliminación */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la tarea <strong>{task.title}</strong>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}