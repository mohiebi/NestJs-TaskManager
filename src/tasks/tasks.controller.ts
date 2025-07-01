import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { updateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Get()
    public async findAll(@Query() filters: FindTaskParams): Promise<Task[]> {
        return await this.tasksService.findAll(filters);
    }

    @Get(':id')
    public async findOne(@Param() params: FindOneParams): Promise<Task> {
        return await this.findOneOrFail(params.id);
    }

    @Post()
    public async create(@Body() creatTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksService.createTask(creatTaskDto);
    }

    @Patch('/:id/status')
    public async updateTaskStatus(
        @Param() params: FindOneParams,
        @Body() body: updateTaskStatusDto,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        task.status = body.status;
       return task;
    }

    @Put('/:id')
    public async updateTask(
        @Param() params: FindOneParams,
        @Body() UpdateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        return await this.tasksService.updateTask(task, UpdateTaskDto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteTask(@Param() params: FindOneParams): Promise<void> {
        const task = await this.findOneOrFail(params.id);
        await this.tasksService.deleteTask(task);
    }

    @Post('/:id/labels')
    public async addLabels(
        @Param() params: FindOneParams,
        @Body() labelDtos: CreateTaskLabelDto[],
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        return await this.tasksService.addLabels(task, labelDtos);
    }

    @Delete('/:id/labels')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeLabels(
        @Param() { id }: FindOneParams,
        @Body() labelDtos: CreateTaskLabelDto[],
    ): Promise<void> {
        const task = await this.findOneOrFail(id);
        await this.tasksService.removeLabels(task, labelDtos);
    }

    private async findOneOrFail(id: string): Promise<Task> {
        const task = await this.tasksService.findOne(id);
        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }
}
