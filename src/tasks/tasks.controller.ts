import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { updateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationsParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { CurrentUserID } from './../Users/decorators/current-user-id.decorator';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Get()
    public async findAll(
        @Query() filters: FindTaskParams,
        @Query() pagination: PaginationsParams,
    ): Promise<PaginationResponse<Task>> {
        const [items, total] = await this.tasksService.findAll(
            filters,
            pagination,
        );

        return {
            data: items,
            meta: {
                total,
                ...pagination,
            },
        };
    }

    @Get(':id')
    public async findOne(
        @Param() params: FindOneParams,
        @CurrentUserID() userId: string,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnerShip(task, userId);
        return task;
    }

    @Post()
    public async create(
        @Body() createTaskDto: CreateTaskDto,
        @CurrentUserID() userId: string,
    ): Promise<Task> {
        return await this.tasksService.createTask({
            ...createTaskDto,
            userId,
        });
    }

    @Patch('/:id/status')
    public async updateTaskStatus(
        @Param() params: FindOneParams,
        @Body() body: updateTaskStatusDto,
        @CurrentUserID() userId: string,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnerShip(task, userId);
        task.status = body.status;
        return task;
    }

    @Put('/:id')
    public async updateTask(
        @Param() params: FindOneParams,
        @Body() UpdateTaskDto: UpdateTaskDto,
        @CurrentUserID() userId: string,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnerShip(task, userId);
        return await this.tasksService.updateTask(task, UpdateTaskDto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteTask(
        @Param() params: FindOneParams,
        @CurrentUserID() userId: string,
    ): Promise<void> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnerShip(task, userId);
        await this.tasksService.deleteTask(task);
    }

    @Post('/:id/labels')
    public async addLabels(
        @Param() params: FindOneParams,
        @Body() labelDtos: CreateTaskLabelDto[],
        @CurrentUserID() userId: string,
    ): Promise<Task> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnerShip(task, userId);
        return await this.tasksService.addLabels(task, labelDtos);
    }

    @Delete('/:id/labels')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeLabels(
        @Param() { id }: FindOneParams,
        @Body() labelDtos: CreateTaskLabelDto[],
        @CurrentUserID() userId: string,
    ): Promise<void> {
        const task = await this.findOneOrFail(id);
        this.checkTaskOwnerShip(task, userId);
        await this.tasksService.removeLabels(task, labelDtos);
    }

    private async findOneOrFail(id: string): Promise<Task> {
        const task = await this.tasksService.findOne(id);
        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }

    private checkTaskOwnerShip(task: Task, userId: string): void {
        if (task.userId !== userId) {
            throw new ForbiddenException('You can only access your own token');
        }
    }
}
