import { io, Socket } from 'socket.io-client';
import { UserTasksResponse } from '@/types/task-socket';
import { SocketError, TaskCreatedEvent, TaskDeletedEvent, TaskUpdatedEvent } from '@/types/socket-events';

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
    console.log('conexion en proceso...');
    return this.socket;
  }

  this.isConnecting = true;

  // Siempre crear un socket si no existe
  if (!this.socket) {
    console.log('Creando nueva conexion WebSocket...');
    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado. Razón:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      this.isConnecting = false;
    });
  }

  return this.socket;
}

  disconnect() {
    if (this.socket) {
      console.log('🔌 Desconectando socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  getUserTasks(userId: string, callback: (data: UserTasksResponse) => void) {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket no conectado, conectando...');
      this.connect();
    }

    // Remover listener anterior si existe
    this.socket?.off('user-tasks');

    // Emitir evento
    this.socket?.emit('get-user-tasks', { userId });

    // Escuchar respuesta
    this.socket?.once('user-tasks', callback);
  }

  subscribeToUserTasks(userId: string, callback: (data: UserTasksResponse) => void) {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket no conectado, conectando...');
      this.connect();
    }

    // Remover listener anterior si existe
    this.socket?.off('user-tasks');

    // Suscribirse
    this.socket?.emit('subscribe-user-tasks', { userId });

    // Escuchar respuesta y actualizaciones
    this.socket?.on('user-tasks', callback);
  }

  onTaskCreated(callback: (data: TaskCreatedEvent) => void) {
    this.socket?.off('task-created'); // Limpiar listener anterior
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