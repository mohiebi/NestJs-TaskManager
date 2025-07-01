import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatus } from "./task.model";
import { User } from "src/Users/user.entity";
import { TaskLabel } from "./task-label.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    title: string;

    @Column({
        type: 'text',
        nullable: false
    })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.OPEN
    })
    status : TaskStatus;

    @Column({
        type: 'uuid',
        nullable: false
    })
    userId: string;

    @OneToMany(() => TaskLabel, label => label.task, { cascade: true })
    labels: TaskLabel[];

    @ManyToOne(() => User, user => user.tasks, { nullable: false })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}