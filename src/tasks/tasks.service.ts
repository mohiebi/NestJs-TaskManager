import { Injectable } from '@nestjs/common';
import { Itask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TasksService {
    private tasks: Itask[] = [];

    findAll(): Itask[] {
        return this.tasks;
    }

    findOne(id: string): Itask | undefined {
        return this.tasks.find((task) => task.id == id);
    }

    create(createTaskDto: CreateTaskDto) : Itask {
        const task: Itask = {
            id: randomUUID(),
            ...createTaskDto,
        };

        this.tasks.push(task);
        return task;
    }
}
