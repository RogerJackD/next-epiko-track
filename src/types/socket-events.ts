export interface TaskCreatedEvent {
  task: {
    id: number;
    title: string;
    description: string;
    priority: 'BAJA' | 'MEDIA' | 'ALTA';
    board?: {
      id: string;
      title: string;
    };
    tasksUsers?: Array<{
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
    }>;
  };
}

export interface TaskUpdatedEvent {
  task: {
    id: number;
    title: string;
    description: string;
    priority: 'BAJA' | 'MEDIA' | 'ALTA';
    board?: {
      id: string;
      title: string;
    };
    taskStatus?: {
      id: string;
      title: string;
    };
    tasksUsers?: Array<{
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
    }>;
  };
}

export interface TaskDeletedEvent {
  taskId: number;
  message: string;
}

export interface SocketError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface GetUserTasksPayload {
  userId: string;
}

export interface SubscribeUserTasksPayload {
  userId: string;
}