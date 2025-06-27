import { Injectable } from '@nestjs/common';
import { Itask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'node:crypto';

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

    public deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id != id);
    }
}
