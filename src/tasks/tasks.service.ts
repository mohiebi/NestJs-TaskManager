import { Injectable } from '@nestjs/common';
import { Itask } from './task.model';

@Injectable()
export class TasksService {
    private tasks: Itask[] = [];

    findAll(): Itask[] {
        return this.tasks;
    }

    public findOne(id: string): Itask | undefined {
        return this.tasks.find((task) => task.id == id);
    }
}
