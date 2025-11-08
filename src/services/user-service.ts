import { CreateUserDTO, UpdateUserDTO, User } from "@/types/user";

const API_BASE_URL = 'http://localhost:3030/api';


export const userService = {

    async getUsers(): Promise<User[]> {
            const response = await fetch(`${API_BASE_URL}/auth/users`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if( !response.ok){
                let errorMessage = `Error ${response.status}: ${response.statusText}`
                try {
                    const errorData = await response.json();
                    //usando mensaje especifico de mi servidor
                    errorMessage = errorData.message || errorData;
                } catch {
                    console.log("error unexpected, check servers logs");
                }

                throw new Error(errorMessage)
            }
            return await response.json()
    },

    async createUser(createUserData: CreateUserDTO) {
        const response = await fetch(`${API_BASE_URL}/auth/users`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createUserData),
        })
        if( !response.ok){
            let errorMessage = `Error ${response.status}: ${response.statusText}`
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData;
            } catch {
                console.log("error unexpected, check servers logs");
            }
            throw new Error(errorMessage)
        }
        return await response.json()
    },
    async updateUser(updateUserData: UpdateUserDTO, userId : string) {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateUserData),
        })
        if( !response.ok){
            let errorMessage = `Error ${response.status}: ${response.statusText}`
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData;
                console.log(errorMessage)
            } catch {
                console.log("error unexpected, check servers logs");
            }
            throw new Error(errorMessage)
        }
        return await response.json()
    }
}