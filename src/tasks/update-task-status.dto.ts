import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "./task.model";

export class updateTaskStatus {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status : TaskStatus;
}