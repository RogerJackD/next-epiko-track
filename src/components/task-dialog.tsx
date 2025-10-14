import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { taskService } from '@/services/task-service';
import { userService } from '@/services/user-service';

const priorityColors = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBoardId: string | null;
}

interface TaskFormData {
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
  userId? : string;
}

export default function TaskDialog({ open, onOpenChange, currentBoardId }: TaskDialogProps) {


  const { register, handleSubmit, setValue } = useForm<TaskFormData>();

  const [users, setUsers] = React.useState<null | {id: string; firstName: string; lastName: string}[]>(null);

  const onSubmit = (data: TaskFormData) => {
    console.log("Datos del formulario:", data);
    taskService.createTasksByBoard(currentBoardId!, data)
  }

  useEffect(() => {
    userService.getUsers().then(setUsers);

    return () => {
      setUsers([]);
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="title">Título</label>
            <Input id="title" placeholder="Nombre de la tarea" {...register("title")} />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description" 
              placeholder="Descripción de la tarea"
              rows={3}
              className='border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 w-full rounded-md p-2'
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate">Fecha Inicio</label>
              <Input id="startDate" type="datetime-local" {...register("startDate")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate">Fecha Límite</label>
              <Input id="dueDate" type="datetime-local" {...register("dueDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority">Prioridad</label>
            <Select onValueChange={(value) => setValue("priority", value as 'BAJA' | 'MEDIA' | 'ALTA')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAJA">Baja</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
              <label htmlFor="assignee">Asignar a:</label>
            <Select onValueChange={(value) => setValue("userId", value)}>
              <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type='button' variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type='submit' className="bg-green-800 hover:bg-green-900">
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
