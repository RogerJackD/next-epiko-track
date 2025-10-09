export interface Task {
  id: number;
  title: string;
  status: 'por_hacer' | 'en_proceso' | 'en_revision' | 'completado';
  description?: string;
  priority?: 'BAJA' | 'MEDIA' | 'ALTA';
  startDate?: string;
  dueDate?: string;
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