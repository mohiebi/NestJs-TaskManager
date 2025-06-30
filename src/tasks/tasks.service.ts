import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(TaskLabel)
        private readonly labelsRepository: Repository<TaskLabel>,
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

    public async addLabels(task: Task, labelDtos: CreateTaskLabelDto[]): Promise<Task> {
        const labels = labelDtos.map((label) => this.labelsRepository.create(label));
        task.labels = [...task.labels, ...labels];
        return await this.tasksRepository.save(task);
    }
}
