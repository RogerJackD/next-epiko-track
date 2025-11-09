import { Credentials, LoginResponse } from "@/types/loginResponse";



export const AuthService = {

    async sendCredentials(credentials: Credentials): Promise<LoginResponse> {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
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

