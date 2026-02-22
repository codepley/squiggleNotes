export interface CalendarTask {
    id: string;
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD format
    completed: boolean;
    createdAt: number;
}
