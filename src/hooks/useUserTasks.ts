import { useEffect, useState, useCallback, useRef } from 'react';
import { UserTask, UserTasksResponse } from '@/types/task-socket';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { socketService } from '@/services/socket-service/socket-service';
import { TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent, SocketError } from '@/types/socket-events';

export function useUserTasks() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  
  const isInitialized = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const refreshTasks = useCallback(() => {
    const currentUserId = userIdRef.current;
    if (currentUserId) {
      console.log('🔄 Solicitando actualización de tareas...');
      socketService.getUserTasks(currentUserId, (data: UserTasksResponse) => {
        console.log('📦 Tareas actualizadas:', data);
        setTasks(data.tasks);
        setTaskCount(data.tasks.length);
      });
    }
  }, []);

  useEffect(() => {
    // Evitar re-inicialización
    if (isLoadingUser || !user?.id || isInitialized.current) {
      if (isLoadingUser) {
        setIsLoading(true);
      }
      return;
    }

    console.log('🚀 Conectando socket para usuario:', user.id);
    isInitialized.current = true;
    userIdRef.current = user.id;

    // Conectar socket
    const socket = socketService.connect();

    // Verificar que socket no sea null
    if (!socket) {
      console.error('❌ No se pudo establecer conexión con WebSocket');
      setIsLoading(false);
      return;
    }

    const handleConnect = () => {
      setIsConnected(true);
      console.log('✅ WebSocket conectado');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('⚠️ WebSocket desconectado');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Suscribirse a las tareas del usuario
    socketService.subscribeToUserTasks(user.id, (data: UserTasksResponse) => {
      console.log('📦 Tareas recibidas:', data);
      setTasks(data.tasks);
      setTaskCount(data.tasks.length);
      setIsLoading(false);
    });

    // ✅ Escuchar cuando se crea una nueva tarea - Sin any
    const handleTaskCreated = (data: TaskCreatedEvent) => {
      console.log('✨ Nueva tarea creada:', data);
      
      // Verificar si el usuario está asignado a la tarea
      const isAssigned = data.task.tasksUsers?.some(
        (tu) => tu.user.id === user.id
      );

      if (isAssigned) {
        toast.success('Nueva tarea asignada', {
          description: data.task.title,
          duration: 4000,
        });
        
        // Refrescar todas las tareas para mantener consistencia
        setTimeout(refreshTasks, 100);
      }
    };

    // ✅ Escuchar cuando se actualiza una tarea - Sin any
    const handleTaskUpdated = (data: TaskUpdatedEvent) => {
      console.log('🔄 Tarea actualizada:', data);
      
      // Verificar si la tarea pertenece al usuario
      const isUserTask = data.task.tasksUsers?.some(
        (tu) => tu.user.id === user.id
      );

      if (isUserTask) {
        toast.info('Tarea actualizada', {
          description: data.task.title,
          duration: 3000,
        });
        
        // Refrescar todas las tareas
        setTimeout(refreshTasks, 100);
      }
    };

    // ✅ Escuchar cuando se elimina una tarea - Sin any
    const handleTaskDeleted = (data: TaskDeletedEvent) => {
      console.log('🗑️ Tarea eliminada:', data);
      
      // Verificar si la tarea eliminada estaba en la lista
      const taskExists = tasks.some(task => task.id === data.taskId);
      
      if (taskExists) {
        toast.info('Tarea eliminada', {
          description: 'Una de tus tareas ha sido eliminada',
          duration: 3000,
        });
        
        // Refrescar todas las tareas
        setTimeout(refreshTasks, 100);
      }
    };

    // ✅ Escuchar errores - Sin any
    const handleError = (data: SocketError) => {
      console.error('❌ Error del socket:', data);
      // No mostrar toasts de error en el inicio
      if (!data.message.includes('Cannot read properties of null')) {
        toast.error('Error en tiempo real', {
          description: data.message,
        });
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);
    socketService.onTaskDeleted(handleTaskDeleted);
    socketService.onError(handleError);

    // Cleanup
    return () => {
      console.log('🧹 Limpiando listeners del socket');
      isInitialized.current = false;
      userIdRef.current = null;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [user?.id, isLoadingUser, refreshTasks, tasks]);

  return {
    tasks,
    taskCount,
    isLoading,
    isConnected,
    refreshTasks,
  };
}