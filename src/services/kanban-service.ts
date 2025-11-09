import { KanbanBoardResponse } from '../types/kanbanResponse';


export const kanbanService = {

    async getKanbanBoardById(idBoard: string): Promise<KanbanBoardResponse> {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/${idBoard}/tasks`,{
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