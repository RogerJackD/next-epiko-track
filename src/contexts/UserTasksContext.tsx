'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { UserTask, UserTasksResponse } from '@/types/task-socket';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { socketService } from '@/services/socket-service/socket-service';
import { TaskNotification } from '@/components/toast-notifications';
import { TaskCreatedEvent, TaskUpdatedEvent } from '@/types/socket-events';

interface UserTasksContextType {
  tasks: UserTask[];
  taskCount: number;
  isLoading: boolean;
  isConnected: boolean;
  refreshTasks: () => void;
}

const UserTasksContext = createContext<UserTasksContextType | undefined>(undefined);

export function UserTasksProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  
  const isInitialized = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const tasksRef = useRef<UserTask[]>([]); // ✅ Ref para acceder a tasks sin causar re-render

  // ✅ Actualizar ref cuando cambian las tasks
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const refreshTasks = useCallback(() => {
    const currentUserId = userIdRef.current;
    if (currentUserId) {
      console.log('Refrescando tareas para usuario:', currentUserId);
      socketService.getUserTasks(currentUserId, (data: UserTasksResponse) => {
        console.log('Tareas actualizadas:', data.tasks.length);
        setTasks(data.tasks);
        setTaskCount(data.tasks.length);
      });
    }
  }, []);

  useEffect(() => {
    if (isLoadingUser || !user?.id || isInitialized.current) {
      if (isLoadingUser) {
        setIsLoading(true);
      }
      return;
    }

    console.log('Inicializando WebSocket para usuario:', user.id);
    isInitialized.current = true;
    userIdRef.current = user.id;

    const socket = socketService.connect();

    const handleConnect = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socketService.subscribeToUserTasks(user.id, (data: UserTasksResponse) => {
      console.log('Tareas recibidas:', data.tasks.length);
      setTasks(data.tasks);
      setTaskCount(data.tasks.length);
      setIsLoading(false);
    });

    socketService.onTaskCreated((data: TaskCreatedEvent) => {
      const isAssigned = data.task.tasksUsers?.some(
        (tu) => tu.user.id === user.id
      );

      if (isAssigned) {
        toast.success(
          <TaskNotification
            type="created"
            title={data.task.title}
            description={`Prioridad: ${data.task.priority}`}
            metadata={data.task.board?.title ? `Tablero: ${data.task.board.title}` : undefined}
          />,
          {
            duration: 5000,
            className: 'bg-white border-l-4 border-l-green-500 shadow-lg',
          }
        );
        
        setTimeout(refreshTasks, 100);
      }
    });

    socketService.onTaskUpdated((data: TaskUpdatedEvent) => {
      // ✅ Usar tasksRef.current en lugar de tasks para evitar dependencia
      const currentTasks = tasksRef.current;
      
      // Verificar si el usuario ESTÁ actualmente asignado a la tarea
      const isCurrentlyAssigned = data.task.tasksUsers?.some(
        (tu) => tu.user.id === user.id
      );

      // Verificar si el usuario ESTABA asignado (buscando en la lista actual de tareas)
      const wasAssigned = currentTasks.some(task => task.id === data.task.id);

      // Caso 1: Usuario fue REMOVIDO de la tarea (estaba asignado pero ya no)
      if (wasAssigned && !isCurrentlyAssigned) {
        toast.warning(
          <TaskNotification
            type="removed"
            title={data.task.title}
            description="Has sido removido de esta tarea"
            metadata={data.task.board?.title ? `Tablero: ${data.task.board.title}` : undefined}
          />,
          {
            duration: 5000,
            className: 'bg-white border-l-4 border-l-orange-500 shadow-lg',
          }
        );
        
        // Actualizar lista de tareas (la tarea será removida)
        setTimeout(refreshTasks, 100);
        return;
      }

      // Caso 2: Usuario SIGUE asignado a la tarea (actualización normal)
      if (isCurrentlyAssigned) {
        toast.info(
          <TaskNotification
            type="updated"
            title={data.task.title}
            description={data.task.taskStatus?.title ? `Estado: ${data.task.taskStatus.title}` : undefined}
            metadata={data.task.board?.title ? `Tablero: ${data.task.board.title}` : undefined}
          />,
          {
            duration: 4000,
            className: 'bg-white border-l-4 border-l-blue-500 shadow-lg',
          }
        );
        
        setTimeout(refreshTasks, 100);
      }
    });

    socketService.onTaskDeleted(() => {
      toast.error(
        <TaskNotification
          type="deleted"
          title="Tarea eliminada del sistema"
          description="Una de tus tareas asignadas ha sido eliminada"
        />,
        {
          duration: 4000,
          className: 'bg-white border-l-4 border-l-red-500 shadow-lg',
        }
      );
      
      setTimeout(refreshTasks, 100);
    });

    return () => {
      console.log('limpiando conexión WebSocket');
      isInitialized.current = false;
      userIdRef.current = null;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [user?.id, isLoadingUser, refreshTasks]); // ✅ Removí 'tasks' de las dependencias

  return (
    <UserTasksContext.Provider value={{ tasks, taskCount, isLoading, isConnected, refreshTasks }}>
      {children}
    </UserTasksContext.Provider>
  );
}

export function useUserTasksContext() {
  const context = useContext(UserTasksContext);
  if (context === undefined) {
    throw new Error('useUserTasksContext debe usarse dentro de UserTasksProvider');
  }
  return context;
}