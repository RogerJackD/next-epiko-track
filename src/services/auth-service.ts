
const API_BASE_URL = 'http://localhost:3030/api';

interface Credentials {
    email: string,
    password: string,
}

export const boardService = {

    async sendCredentials(credentials: Credentials) {
            const response = await fetch(`${API_BASE_URL}/auth/login`,{
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