import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Itask } from './task.model';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Get()
    public findAll(): Itask[] {
        return this.tasksService.findAll();
    }

    @Get(':id')
    public findOne(@Param('id') id: string): Itask {
        const task = this.tasksService.findOne(id);

        if(!task) {
            throw new NotFoundException;
        }
    
        return task;
    }

    @Post()
    public create(@Body() creatTaskDto: CreateTaskDto): Itask {
        return this.tasksService.create(creatTaskDto);
    }
}
