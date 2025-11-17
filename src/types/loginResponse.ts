interface Role {
    id: number;
    name: string;
}

interface Area {
    id: number;
    name: string;
    description: string;
}

export interface LoginResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role : Role;
    area: Area;
    token: string;
}


export interface Credentials {
    email: string,
    password: string,
}