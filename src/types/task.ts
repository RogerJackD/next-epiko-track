export interface Task {
    title: string;
    description: string;
    startDate: string; 
    dueDate: string;   
    priority: 'BAJA' | 'MEDIA' | 'ALTA';
    userIds: string[]; // Array of user IDs assigned to the task
}