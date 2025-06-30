import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTaskLabelDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;
}
