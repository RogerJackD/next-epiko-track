import { User } from "@/types/user";

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
        }
}