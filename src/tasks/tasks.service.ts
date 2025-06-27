import { Injectable } from '@nestjs/common';
import { Itask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'node:crypto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TasksService {
    private tasks: Itask[] = [];

    public findAll(): Itask[] {
        return this.tasks;
    }

    public findOne(id: string): Itask | undefined {
        return this.tasks.find((task) => task.id == id);
    }

    public create(createTaskDto: CreateTaskDto) : Itask {
        const task: Itask = {
            id: randomUUID(),
            ...createTaskDto,
        };

        this.tasks.push(task);
        return task;
    }

    public updateTask(task: Itask , UpdateTaskDto: UpdateTaskDto) : Itask {
        Object.assign(task, UpdateTaskDto);
        return task;
    }

    public deleteTask(task: Itask): void {
        this.tasks = this.tasks.filter((filteredTask) => filteredTask.id != task.id);
    }
}
