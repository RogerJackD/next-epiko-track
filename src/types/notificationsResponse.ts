export interface NotificationTaskResponse {
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
  tasksUsers?: TaskUserResponse[];
  board: BoardResponse;
  taskStatus: TaskStatusResponse;
  taskStatusId: number;
}

export interface TaskUserResponse {
  id: number;
  assignedAt: string;
  user: UserResponse;
}

export interface UserResponse {
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
}

export interface area {
  id: number;
  name: string;
  description: string;
}

export interface BoardResponse {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  area: area;
}

export interface TaskStatusResponse {
  id: number;
  title: string;
  description: string;
  sort_order: number;
}
