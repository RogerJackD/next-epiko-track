import { NotificationTaskResponse } from '@/types/notificationsResponse';
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface NotificationsTableProps {
  notifications: NotificationTaskResponse[];
}

export const NotificationsTable = ({ notifications }: NotificationsTableProps) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return { 
          color: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500'
        };
      case 'MEDIA':
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'BAJA':
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      default:
        return { 
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-teal-500',
    ];
    const index = parseInt(id.split('-')[0], 16) % colors.length;
    return colors[index];
  };

  const capitalizeWords = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">Título</TableHead>
              <TableHead className="font-semibold text-gray-700">Prioridad</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              <TableHead className="font-semibold text-gray-700">Vence</TableHead>
              <TableHead className="font-semibold text-gray-700">Asignados</TableHead>
              <TableHead className="font-semibold text-gray-700">Proyecto</TableHead>
              <TableHead className="font-semibold text-gray-700">Área</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm font-medium">No hay notificaciones</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => {
                const priorityConfig = getPriorityConfig(notification.priority);
                return (
                  <TableRow key={notification.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      <div className="max-w-xs">
                        <p className="truncate">{capitalizeWords(notification.title)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${priorityConfig.color} border font-normal px-2.5 py-0.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot} mr-1.5`}></span>
                        {capitalizeWords(notification.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {notification.taskStatus.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(notification.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex -space-x-2">
                          {notification.tasksUsers && notification.tasksUsers.length > 0 ? (
                            <>
                              {notification.tasksUsers.slice(0, 3).map((taskUser) => (
                                <Tooltip key={taskUser.id}>
                                  <TooltipTrigger asChild>
                                    <Avatar className={`h-8 w-8 border-2 border-white cursor-pointer hover:z-10 hover:scale-110 transition-transform ${getAvatarColor(taskUser.user.id)}`}>
                                      <AvatarFallback className={`text-xs font-medium text-white ${getAvatarColor(taskUser.user.id)}`}>
                                        {getInitials(taskUser.user.firstName, taskUser.user.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-gray-900 text-white">
                                    <div className="text-sm">
                                      <p className="font-semibold">{taskUser.user.firstName} {taskUser.user.lastName}</p>
                                      <p className="text-xs text-gray-300">{taskUser.user.job_title}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                              {notification.tasksUsers.length > 3 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors">
                                      +{notification.tasksUsers.length - 3}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-gray-900 text-white">
                                    <div className="text-sm max-w-xs">
                                      {notification.tasksUsers.slice(3).map((taskUser) => (
                                        <p key={taskUser.id} className="py-0.5">
                                          {taskUser.user.firstName} {taskUser.user.lastName}
                                        </p>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Sin asignar</span>
                          )}
                        </div>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {capitalizeWords(notification.board.title)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal">
                        {capitalizeWords(notification.board.area.name)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};