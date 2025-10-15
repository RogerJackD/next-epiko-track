
export interface Task {
  id: number;
  title: string;
  status: 'por_hacer' | 'en_proceso' | 'en_revision' | 'completado';
  description?: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
  startDate?: Date;
  dueDate?: Date;
  assignedUsers?: AssignedUsers[];
}
export interface User {
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

export interface AssignedUsers {
  id: number;
  assignedAt: string;
  user: User;
}

export interface Column {
  name: string;
  tasks: Task[];
}

export interface Columns {
  por_hacer?: Column;
  en_proceso?: Column;
  en_revision?: Column;
  completado?: Column;
}

export interface KanbanBoardResponse {
  board_id: number;
  board_name: string;
  columns: Columns; 
}