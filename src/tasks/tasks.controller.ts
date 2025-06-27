import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Itask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { updateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Get()
    public findAll(): Itask[] {
        return this.tasksService.findAll();
    }

    @Get(':id')
    public findOne(@Param() params: FindOneParams): Itask {
        return this.findOneOrFail(params.id);
    }

    @Post()
    public create(@Body() creatTaskDto: CreateTaskDto): Itask {
        return this.tasksService.create(creatTaskDto);
    }

    //@Patch('/:id/status')
    //public updateTaskStatus(
    //    @Param() params: FindOneParams,
    //    @Body() body: updateTaskStatusDto,
    //): Itask {
    //    const task = this.findOneOrFail(params.id);
    //    task.status = body.status;
    //   return task;
    //}

    @Put('/:id')
    public updateTask(
        @Param() params: FindOneParams,
        @Body() UpdateTaskDto: UpdateTaskDto,
    ): Itask {
        const task = this.findOneOrFail(params.id);
        return this.tasksService.updateTask(task, UpdateTaskDto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public deleteTask(@Param() params: FindOneParams): void {
        const task = this.findOneOrFail(params.id);
        this.tasksService.deleteTask(task);

    }

    private findOneOrFail(id: string) :Itask {
        const task = this.tasksService.findOne(id);

        if(!task) {
            throw new NotFoundException;
        }
    
        return task;

    }
}
