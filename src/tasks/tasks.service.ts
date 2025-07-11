import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from './find-task.params';
import { PaginationsParams } from 'src/common/pagination.params';
import { FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(TaskLabel)
        private readonly labelsRepository: Repository<TaskLabel>,
    ) {}

    public async findAll(
        filters: FindTaskParams,
        pagination: PaginationsParams,
        userId: string,
    ): Promise<[Task[], number]> {
        const query = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.labels', 'labels')
            .where('task.userId = :userId', { userId });

        if (filters.status) {
            query.andWhere('task.status = :status', { status: filters.status });
        }

        if (filters.search) {
            query.andWhere(
                '(task.title ILIKE :search OR task.description ILIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        if (filters.labels?.length) {
            const subQuery = query
                .subQuery()
                .select('labels.taskId')
                .from(TaskLabel, 'labels')
                .where('labels.name IN (:...names)', { names: filters.labels })
                .getQuery();

            query.andWhere(`task.id IN ${subQuery}`);

            query.andWhere('labels.name IN (:...names)', {
                names: filters.labels,
            });
        }

        query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

        query.skip(pagination.offset).take(pagination.limit);

        return await query.getManyAndCount();
    }

    public async findOne(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOne({
            where: { id },
            relations: ['labels'],
        });
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        if (createTaskDto.labels) {
            createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
        }

        return await this.tasksRepository.save(createTaskDto);
    }

    public async updateTask(
        task: Task,
        UpdateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        if (UpdateTaskDto.labels) {
            UpdateTaskDto.labels = this.getUniqueLabels(UpdateTaskDto.labels);
        }
        Object.assign(task, UpdateTaskDto);

        return await this.tasksRepository.save(task);
    }

    public async deleteTask(task: Task): Promise<void> {
        await this.tasksRepository.delete(task.id);
    }

    public async addLabels(
        task: Task,
        labelDtos: CreateTaskLabelDto[],
    ): Promise<Task> {
        const exitingLabels = new Set(task.labels.map((label) => label.name));
        const labels = this.getUniqueLabels(labelDtos)
            .filter((dtoLabels) => !exitingLabels.has(dtoLabels.name))
            .map((label) => this.labelsRepository.create(label));

        if (labels.length > 0) {
            task.labels = [...task.labels, ...labels];
            return await this.tasksRepository.save(task);
        }

        return task;
    }

    public async removeLabels(
        task: Task,
        labelsToRemove: CreateTaskLabelDto[],
    ): Promise<Task> {
        const labelsToRemoveNames = this.getUniqueLabels(labelsToRemove).map(
            (label) => label.name,
        );
        task.labels = task.labels.filter(
            (label) => !labelsToRemoveNames.includes(label.name),
        );

        return await this.tasksRepository.save(task);
    }

    private getUniqueLabels(
        labelDtos: CreateTaskLabelDto[],
    ): CreateTaskLabelDto[] {
        const uniqueLabels = [...new Set(labelDtos.map((label) => label.name))];

        return uniqueLabels.map((name) => ({ name }));
    }
}
