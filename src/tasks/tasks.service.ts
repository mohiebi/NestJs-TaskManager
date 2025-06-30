import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    public async findAll(): Promise<Task[]> {
        return await this.tasksRepository.find();
    }

    public async findOne(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOne({
            where: { id },
            relations: ['labels']
        });
    }

    public async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        return await this.tasksRepository.save(createTaskDto);
    }

    public async updateTask(task: Task , UpdateTaskDto: UpdateTaskDto) : Promise<Task> {
        Object.assign(task, UpdateTaskDto);
        return await this.tasksRepository.save(task);
    }

    public async deleteTask(task: Task): Promise<void> {
        await this.tasksRepository.remove(task);
    }
}
