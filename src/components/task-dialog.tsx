import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { taskService } from '@/services/task-service';
import { userService } from '@/services/user-service';
import { X } from 'lucide-react';
import { Task } from '@/types/kanbanResponse';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBoardId: string | null;
  onTaskCreated: () => void; 
  taskToEdit?: Task | null; 
}

interface TaskFormData {
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
  userIds?: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export default function TaskDialog({ open, onOpenChange, currentBoardId, onTaskCreated, taskToEdit }: TaskDialogProps) {
  const { register, handleSubmit, setValue, reset } = useForm<TaskFormData>(); 
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const isEditMode = !!taskToEdit; 

  
  useEffect(() => {
    if (open && taskToEdit) {
      // Formatear fechas de "YYYY-MM-DD HH:MM:SS" a "YYYY-MM-DD"
      const formatDateForInput = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        return dateStr.split(' ')[0]; // Toma solo la parte de fecha
      };

      setValue('title', taskToEdit.title);
      setValue('description', taskToEdit.description || '');
      setValue('startDate', formatDateForInput(taskToEdit.startDate));
      setValue('dueDate', formatDateForInput(taskToEdit.dueDate));
      setValue('priority', taskToEdit.priority);

      // Cargar usuarios asignados
      if (taskToEdit.assignedUsers) {
        const assignedUsers = taskToEdit.assignedUsers.map(au => ({
          id: au.user.id,
          firstName: au.user.firstName,
          lastName: au.user.lastName
        }));
        setSelectedUsers(assignedUsers);
      }
    } else if (!open) {
      
      reset();
      setSelectedUsers([]);
    }
  }, [open, taskToEdit, setValue, reset]);

  const onSubmit = async (data: TaskFormData) => { 
    const formatDateTime = (date: string, isStartDate: boolean = false) => {
      if (!date) return '';
      const time = isStartDate ? '00:00:00' : '23:59:59';
      return `${date} ${time}`;
    };

    const payload = {
      title: data.title,
      description: data.description || 'sin descripción',
      startDate: formatDateTime(data.startDate, true),
      dueDate: formatDateTime(data.dueDate, false),
      priority: data.priority,
      userIds: selectedUsers.map(u => u.id)
    };

    try {
      if (isEditMode) {
        await taskService.updateTask(taskToEdit!.id, payload);
        console.log("Tarea actualizada exitosamente");
      } else {
        await taskService.createTasksByBoard(currentBoardId!, payload);
        console.log("Tarea creada exitosamente");
      }
      
      setSelectedUsers([]);
      reset();
      onOpenChange(false);
      onTaskCreated(); 
    } catch (error) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} tarea:`, error);
    }
  };

  const handleAddUser = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    if (user && !selectedUsers.find(u => u.id === userId)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSelectedUserId('');
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  useEffect(() => {
    userService.getUsers().then(setUsers);
    return () => {
      setUsers([]);
    };
  }, []);

  const availableUsers = users?.filter(
    user => !selectedUsers.find(su => su.id === user.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle> 
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Título</label>
            <Input id="title" placeholder="Nombre de la tarea" {...register("title", { required: true })} />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descripción</label>
            <textarea 
              id="description" 
              placeholder="Descripción de la tarea"
              rows={3}
              className='border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 w-full rounded-md p-2 text-sm'
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Fecha Inicio</label>
              <Input id="startDate" type="date" {...register("startDate")} /> 
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Fecha Límite</label>
              <Input id="dueDate" type="date" {...register("dueDate")} /> 
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">Prioridad</label>
            <Select onValueChange={(value) => setValue("priority", value as 'BAJA' | 'MEDIA' | 'ALTA')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAJA">Baja</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="assignee" className="text-sm font-medium">Asignar a</label>
            
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30 min-h-[44px]">
                {selectedUsers.map((user) => (
                  <span 
                    key={user.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm"
                  >
                    {user.firstName} {user.lastName}
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <Select 
              value={selectedUserId}
              onValueChange={handleAddUser}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  availableUsers && availableUsers.length > 0 
                    ? "Agregar usuario..." 
                    : "Todos los usuarios asignados"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableUsers && availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No hay más usuarios disponibles
                  </div>
                )}
              </SelectContent>
            </Select>
            
            <p className="text-xs text-muted-foreground">
              {selectedUsers.length === 0 
                ? "Ningún usuario asignado" 
                : `${selectedUsers.length} usuario(s) asignado(s)`
              }
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type='button' variant="outline" onClick={() => {
              setSelectedUsers([]);
              reset(); 
              onOpenChange(false);
            }}>
              Cancelar
            </Button>
            <Button type='submit' className="bg-green-800 hover:bg-green-900">
              {isEditMode ? 'Actualizar' : 'Crear'} 
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}