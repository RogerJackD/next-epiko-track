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
  role: {
    id: number;
    name: string;
  };
  area: {
    id: number;
    name: string;
    descripcion: string;
  };
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  contractDate?: string;
  job_title: string;
  address: string;
  phoneNumber: string;
  password: string;
  areaId: number;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  contractDate?: string | null;
  job_title?: string;
  address?: string;
  phoneNumber?: string;
  password?: string;
  areaId?: number;
  status?: boolean; 
}
