import { Board, CreateBoardDTO, Project, UpdateBoardDTO } from "@/types/board";


const API_BASE_URL = 'http://localhost:3030/api';


export const boardService = {

    async getBoardsByArea(idArea: string): Promise<Board[]> {
            const response = await fetch(`${API_BASE_URL}/boards/area/${idArea}`,{
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
    async getAllBoards(): Promise<Project[]> {
            const response = await fetch(`${API_BASE_URL}/boards`,{
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
    async createBoard(createBoardDTO: CreateBoardDTO): Promise<Board> {
            const response = await fetch(`${API_BASE_URL}/boards`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createBoardDTO),
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
    async updateBoard(updateBoardDTO : UpdateBoardDTO, idBoard: string): Promise<Board> {
            const response = await fetch(`${API_BASE_URL}/boards/${idBoard}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateBoardDTO),
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
}