import { format } from 'date-fns';


export function readableDateFormat(createdAt: string){
    const date = new Date(createdAt);
    const readableDate = format(date, "MMMM d, yyyy 'at' h:mm a");
    return readableDate;
}