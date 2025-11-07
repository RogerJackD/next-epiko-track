export interface Board {
  id: string;
  title?: string;
  description?: string;
}


export interface Project {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  area: Area;
}

export interface Area {
  id: number;
  name: string;
  descripcion: string;
}

export interface CreateBoardDTO {
  title: string;
  description: string;
  areaId: number;
}

export interface UpdateBoardDTO {
  title?: string;
  description?: string;
  isActive?: boolean;
}