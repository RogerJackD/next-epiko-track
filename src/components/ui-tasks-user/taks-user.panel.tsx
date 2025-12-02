'use client'

import React, { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { UserTask } from '@/types/task-socket'
import { Skeleton } from '../ui/skeleton'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { useUserTasksContext } from '@/contexts/UserTasksContext'

const priorityConfig = {
  ALTA: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Alta' },
  MEDIA: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Media' },
  BAJA: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Baja' },
}

const statusConfig = {
  1: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
  2: { color: 'bg-blue-100 text-blue-800', icon: Loader2 },
  3: { color: 'bg-purple-100 text-purple-800', icon: Clock },
  4: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
}

export default function TasksUserPanel() {
  const { tasks, taskCount, isLoading, isConnected } = useUserTasksContext()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.taskStatusId.toString() === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesStatus && matchesPriority
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Tareas</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza tus tareas asignadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Indicador de conexión */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
          <Badge variant="outline" className="text-base px-4 py-1.5">
            {taskCount} {taskCount === 1 ? 'tarea' : 'tareas'}
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="1">Por Hacer</SelectItem>
            <SelectItem value="2">En Proceso</SelectItem>
            <SelectItem value="3">En Revisión</SelectItem>
            <SelectItem value="4">Completado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            <SelectItem value="ALTA">Alta</SelectItem>
            <SelectItem value="MEDIA">Media</SelectItem>
            <SelectItem value="BAJA">Baja</SelectItem>
          </SelectContent>
        </Select>

        {(filterStatus !== 'all' || filterPriority !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterStatus('all')
              setFilterPriority('all')
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
            <p className="text-muted-foreground">
              {filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No se encontraron tareas con los filtros seleccionados'
                : 'No tienes tareas asignadas en este momento'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

// Componente de tarjeta de tarea
function TaskCard({ task }: { task: UserTask }) {
  const StatusIcon = statusConfig[task.taskStatusId as keyof typeof statusConfig]?.icon || AlertCircle

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`
  }

  const getFirstName = (firstName: string) => {
    return firstName
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={`${priorityConfig[task.priority].color} shrink-0`}
          >
            {priorityConfig[task.priority].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Descripción */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        {/* Estado */}
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          <Badge className={statusConfig[task.taskStatusId as keyof typeof statusConfig]?.color}>
            {task.taskStatus.title}
          </Badge>
        </div>

        {/* Fechas */}
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

        {/* Tablero */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">Tablero</p>
          <p className="text-sm font-medium">{task.board.title}</p>
          <p className="text-xs text-muted-foreground">{task.board.area.name}</p>
        </div>

        {/* Colaboradores - Desktop: Tooltips compactos | Mobile: Lista completa visible */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {task.tasksUsers.length} colaborador{task.tasksUsers.length !== 1 ? 'es' : ''}
            </p>
          </div>
          
          {/* Versión Desktop - Avatares compactos con Tooltips */}
          <TooltipProvider delayDuration={300}>
            <div className="hidden md:flex -space-x-2">
              {task.tasksUsers.slice(0, 4).map((taskUser) => (
                <Tooltip key={taskUser.id}>
                  <TooltipTrigger asChild>
                    <Avatar 
                      className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                    >
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(taskUser.user.firstName, taskUser.user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <p className="font-medium">
                      {getFullName(taskUser.user.firstName, taskUser.user.lastName)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {task.tasksUsers.length > 4 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center cursor-pointer hover:z-10 hover:scale-110 transition-transform">
                      <span className="text-xs font-medium">
                        +{task.tasksUsers.length - 4}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50">
                    <div className="space-y-1">
                      {task.tasksUsers.slice(4).map((taskUser) => (
                        <p key={taskUser.id} className="text-sm">
                          {getFullName(taskUser.user.firstName, taskUser.user.lastName)}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          {/* Versión Mobile - Lista visible con nombres */}
          <div className="md:hidden space-y-2">
            {task.tasksUsers.slice(0, 3).map((taskUser) => (
              <div 
                key={taskUser.id}
                className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {getInitials(taskUser.user.firstName, taskUser.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium truncate">
                  {getFullName(taskUser.user.firstName, taskUser.user.lastName)}
                </span>
              </div>
            ))}
            {task.tasksUsers.length > 3 && (
              <div className="text-xs text-muted-foreground pl-8">
                +{task.tasksUsers.length - 3} más
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}