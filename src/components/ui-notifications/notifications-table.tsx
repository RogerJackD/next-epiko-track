import { NotificationTaskResponse } from '@/types/notificationsResponse';
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';


interface NotificationsTableProps {
  notifications: NotificationTaskResponse[];
}

export const NotificationsTable = ({ notifications }: NotificationsTableProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'BAJA':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return '🔴';
      case 'MEDIA':
        return '🟡';
      case 'BAJA':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
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

  const capitalizeWords = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Título</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vence en</TableHead>
              <TableHead>Asignados</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Área</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay notificaciones disponibles
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">
                    {capitalizeWords(notification.title)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {getPriorityEmoji(notification.priority)} {capitalizeWords(notification.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {notification.taskStatus.title}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(notification.dueDate)}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {notification.tasksUsers && notification.tasksUsers.length > 0 ? (
                        <>
                          {notification.tasksUsers.slice(0, 3).map((taskUser) => (
                            <Avatar key={taskUser.id} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {getInitials(taskUser.user.firstName, taskUser.user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {notification.tasksUsers.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                              +{notification.tasksUsers.length - 3}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin asignar</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{capitalizeWords(notification.board.title)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {capitalizeWords(notification.board.area.name)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
