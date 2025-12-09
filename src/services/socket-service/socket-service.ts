// services/socket-service.ts
import { io, Socket } from 'socket.io-client';
import { UserTasksResponse } from '@/types/task-socket';
import { 
  SocketError, 
  TaskCreatedEvent, 
  TaskDeletedEvent, 
  TaskUpdatedEvent 
} from '@/types/socket-events';
import { KanbanBoardResponse } from '@/types/kanbanResponse';

interface BoardUpdatedEvent {
  boardId: number;
  board_id: number;
  board_name: string;
  columns: any;
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL_SOCKET;
  private isConnecting = false;

  connect(): Socket {
    // Evitar múltiples conexiones
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      console.log('Conexión en proceso...');
      return this.socket;
    }

    this.isConnecting = true;

    // Siempre crear un socket si no existe
    if (!this.socket) {
      this.socket = io(this.SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket desconectado. Razón:', reason);
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error.message);
        this.isConnecting = false;
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('Desconectando socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  // ============================================
  // MÉTODOS PARA TABLERO KANBAN 
  // ============================================

  /**
   * Suscribirse a un tablero específico
   * Recibe datos iniciales y escucha actualizaciones en tiempo real
   */
  subscribeToBoard(
    boardId: number,
    userId: string,
    onBoardData: (data: KanbanBoardResponse) => void,
    onBoardUpdate: (data: BoardUpdatedEvent) => void
  ) {
    if (!this.socket?.connected) {
      this.connect();
    }

    // Limpiar listeners anteriores
    this.socket?.off('board-data');
    this.socket?.off('board-updated');

    // Emitir suscripción
    this.socket?.emit('subscribe-board', { boardId, userId });

    // Escuchar datos iniciales
    this.socket?.on('board-data', (data) => {
      if (!data) {
        return;
      }
      
      // Si viene envuelto en un objeto response
      const boardData = data.data || data;
      
      onBoardData(boardData);
    });

    // Escuchar actualizaciones en tiempo real
    this.socket?.on('board-updated', (data) => {
      console.log('🔄 Actualización del tablero recibida:', data);
      
      if (!data) {
        console.error('Datos de actualización son undefined o null');
        return;
      }
      
      onBoardUpdate(data);
    });

  }

  /**
   * Desuscribirse de un tablero
   */
  unsubscribeFromBoard(boardId: number) {
    if (!this.socket?.connected) return;

    this.socket?.emit('unsubscribe-board', { boardId });
    this.socket?.off('board-data');
    this.socket?.off('board-updated');
  }

  // ============================================
  //  MÉTODOS PARA NOTIFICACIONES DE USUARIO
  // ============================================

  getUserTasks(userId: string, callback: (data: UserTasksResponse) => void) {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket?.off('user-tasks');
    this.socket?.emit('get-user-tasks', { userId });
    this.socket?.once('user-tasks', callback);
  }

  subscribeToUserTasks(userId: string, callback: (data: UserTasksResponse) => void) {
    if (!this.socket?.connected) {
      console.warn('Socket no conectado, conectando...');
      this.connect();
    }

    this.socket?.off('user-tasks');
    this.socket?.emit('subscribe-user-tasks', { userId });
    this.socket?.on('user-tasks', callback);
  }

  onTaskCreated(callback: (data: TaskCreatedEvent) => void) {
    this.socket?.off('task-created');
    this.socket?.on('task-created', callback);
  }

  onTaskUpdated(callback: (data: TaskUpdatedEvent) => void) {
    this.socket?.off('task-updated');
    this.socket?.on('task-updated', callback);
  }

  onTaskDeleted(callback: (data: TaskDeletedEvent) => void) {
    this.socket?.off('task-deleted');
    this.socket?.on('task-deleted', callback);
  }

  onError(callback: (data: SocketError) => void) {
    this.socket?.off('error');
    this.socket?.on('error', callback);
  }

  removeListener(event: string) {
    this.socket?.off(event);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket?.connected || false;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();