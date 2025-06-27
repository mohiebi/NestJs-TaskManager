import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "./task.model";

export class updateTaskStatusDto {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status : TaskStatus;
}