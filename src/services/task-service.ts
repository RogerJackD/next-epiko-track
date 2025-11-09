import { Board } from "@/types/board";

interface TaskFormData {
    title: string;
    description: string;
    startDate?: string;
    dueDate?: string;
    priority: 'BAJA' | 'MEDIA' | 'ALTA';
    userIds? : string[];
}

export const taskService = {

    async createTasksByBoard(idBoard: string, data: TaskFormData): Promise<Board[]> {
        
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/${idBoard}/tasks`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Añadir userId temporalmente
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
    async deleteTask(idTask: number): Promise<{message: string}> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/tasks/${idTask}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
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

    async updateTask(idTask: number, taskData: Partial<TaskFormData>): Promise<{message: string}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/tasks/${idTask}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })

    if (!response.ok) {
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

    async updateTaskStatus(idTask: number, taskStatusId: number): Promise<{message: string}> {
        
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/tasks/${idTask}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskStatusId }),
    })

    if (!response.ok) {
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
    }
}