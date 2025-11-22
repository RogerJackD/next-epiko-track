'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { taskService } from '@/services/task-service'
import { userService } from '@/services/user-service'
import { X, Loader2 } from 'lucide-react'
import { Task } from '@/types/kanbanResponse'
import { toast } from 'sonner'

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  // ✨ Ya NO necesitamos onTaskUpdated para refrescar datos
}

interface TaskFormData {
  title: string
  description: string
  startDate: string
  dueDate: string
  priority: 'BAJA' | 'MEDIA' | 'ALTA'
}

interface User {
  id: string
  firstName: string
  lastName: string
}

interface UpdateTaskPayload {
  title: string
  description: string
  priority: 'BAJA' | 'MEDIA' | 'ALTA'
  userIds: string[]
  startDate?: string
  dueDate?: string
}

export default function EditTaskDialog({ 
  open, 
  onOpenChange, 
  task
}: EditTaskDialogProps) {
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<TaskFormData>()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [currentPriority, setCurrentPriority] = useState<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA')

  const formatDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) return ''
    
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr
      }
      
      if (dateStr.includes('T')) {
        return dateStr.split('T')[0]
      }
      
      if (dateStr.includes(' ')) {
        return dateStr.split(' ')[0]
      }
      
      return dateStr
    } catch (error) {
      console.error('Error al formatear fecha:', error)
      return ''
    }
  }

  const formatDateTimeForBackend = (date: string, isStartDate: boolean = false): string | undefined => {
    if (!date || date.trim() === '') {
      return undefined
    }
    
    const time = isStartDate ? '00:00:00' : '23:59:59'
    return `${date} ${time}`
  }

  useEffect(() => {
    if (open && task) {
      loadUsers()
      
      console.log('📋 Tarea a editar:', task)
      
      setValue('title', task.title)
      setValue('description', task.description || '')
      
      const formattedStartDate = formatDateForInput(task.startDate)
      const formattedDueDate = formatDateForInput(task.dueDate)
      
      console.log('📅 Fecha inicio formateada:', formattedStartDate)
      console.log('📅 Fecha límite formateada:', formattedDueDate)
      
      setValue('startDate', formattedStartDate)
      setValue('dueDate', formattedDueDate)
      setValue('priority', task.priority)
      setCurrentPriority(task.priority)

      if (task.assignedUsers && task.assignedUsers.length > 0) {
        const assignedUsers = task.assignedUsers.map(au => ({
          id: au.user.id,
          firstName: au.user.firstName,
          lastName: au.user.lastName
        }))
        setSelectedUsers(assignedUsers)
      } else {
        setSelectedUsers([])
      }
    } else if (!open) {
      reset()
      setSelectedUsers([])
      setSelectedUserId('')
      setCurrentPriority('MEDIA')
    }
  }, [open, task, setValue, reset])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Error al cargar usuarios', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const onSubmit = async (data: TaskFormData) => {
    if (!task) return

    console.log('📝 Data del formulario:', data)

    const payload: UpdateTaskPayload = {
      title: data.title,
      description: data.description || 'sin descripción',
      priority: data.priority,
      userIds: selectedUsers.map(u => u.id)
    }

    const startDate = formatDateTimeForBackend(data.startDate, true)
    const dueDate = formatDateTimeForBackend(data.dueDate, false)
    
    if (startDate) {
      payload.startDate = startDate
    }
    
    if (dueDate) {
      payload.dueDate = dueDate
    }

    console.log('📦 Payload final:', payload)

    try {
      await taskService.updateTask(task.id, payload)
      
      toast.success('¡Tarea actualizada!', {
        description: 'Los cambios se sincronizarán automáticamente'
      })
      
      reset()
      setSelectedUsers([])
      onOpenChange(false)
      
      // ✨ YA NO llamamos onTaskUpdated() - WebSocket se encarga de actualizar el tablero
    } catch (error) {
      console.error('❌ Error:', error)
      
      toast.error('Error al actualizar tarea', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleAddUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user && !selectedUsers.find(u => u.id === userId)) {
      setSelectedUsers([...selectedUsers, user])
    }
    setSelectedUserId('')
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId))
  }

  const availableUsers = users.filter(
    user => !selectedUsers.find(su => su.id === user.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la tarea
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título <span className="text-destructive">*</span>
            </label>
            <Input 
              id="title" 
              placeholder="Nombre de la tarea" 
              {...register("title", { required: true })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descripción</label>
            <textarea 
              id="description" 
              placeholder="Descripción de la tarea"
              rows={3}
              className='border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 w-full rounded-md p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isSubmitting}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Fecha Inicio</label>
              <Input 
                id="startDate" 
                type="date" 
                disabled={isSubmitting}
                {...register("startDate")} 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Fecha Límite</label>
              <Input 
                id="dueDate" 
                type="date" 
                disabled={isSubmitting}
                {...register("dueDate")} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Prioridad <span className="text-destructive">*</span>
            </label>
            <Select 
              value={currentPriority}
              onValueChange={(value) => {
                const priority = value as 'BAJA' | 'MEDIA' | 'ALTA'
                setValue("priority", priority)
                setCurrentPriority(priority)
              }}
              disabled={isSubmitting}
            >
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
                      disabled={isSubmitting}
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
              disabled={isSubmitting || isLoadingUsers}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingUsers 
                    ? "Cargando usuarios..." 
                    : availableUsers.length > 0 
                      ? "Agregar usuario..." 
                      : "Todos los usuarios asignados"
                } />
              </SelectTrigger>
              <SelectContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : availableUsers.length > 0 ? (
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
            <Button 
              type='button' 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type='submit' 
              className="bg-green-800 hover:bg-green-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}