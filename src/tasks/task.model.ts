export interface Itask{
    id: string;
    title: string;
    description: string;
    status : TaskStatus;
}

export enum TaskStatus {
    OPEN = 'OPEM',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}
