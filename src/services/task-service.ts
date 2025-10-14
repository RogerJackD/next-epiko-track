import { Board } from "@/types/board";


const API_BASE_URL = 'http://localhost:3030/api';

interface TaskFormData {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    priority: 'BAJA' | 'MEDIA' | 'ALTA';
}

export const taskService = {

    async createTasksByBoard(idBoard: string, data: TaskFormData): Promise<Board[]> {
            const response = await fetch(`${API_BASE_URL}/boards/${idBoard}/tasks`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...data, userId : "52361e50-45a2-40a0-95e4-c283eb010d11"}), // Añadir userId temporalmente
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