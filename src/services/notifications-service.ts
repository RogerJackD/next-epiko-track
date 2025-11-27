import { NotificationTaskResponse } from "@/types/notificationsResponse";


export const notificationService = {

    async getNotificationsTasks(): Promise<NotificationTaskResponse[]> {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/tasks/upcoming/due-date`,{
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

    async getOverDueTasks(): Promise<NotificationTaskResponse[]> {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/boards/tasks/overdue/due-date`,{
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