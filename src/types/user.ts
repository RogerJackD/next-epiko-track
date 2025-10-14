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
