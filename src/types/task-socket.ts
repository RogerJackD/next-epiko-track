// types/task-socket.ts
export interface TaskUser {
  id: number;
  assignedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    createdAt: string;
    updatedAt: string;
    contractDate: string | null;
    status: boolean;
    job_title: string;
    phoneNumber: string;
    address: string;
    roleId: number;
  };
}

export interface TaskBoard {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  area: {
    id: number;
    name: string;
    descripcion: string;
  };
}

export interface TaskStatus {
  id: number;
  title: string;
  description: string;
  sort_order: number;
}

export interface UserTask {
  id: number;
  title: string;
  description: string;
  startDate: string | null;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  updatedAt: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
  deleteAt: string | null;
  tasksUsers: TaskUser[];
  board: TaskBoard;
  taskStatus: TaskStatus;
  taskStatusId: number;
}

export interface UserTasksResponse {
  userId: string;
  tasks: UserTask[];
  timestamp: string;
}