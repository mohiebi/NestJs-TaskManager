import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Task } from "./task.entity";

@Entity()
@Unique(['name', 'taskId'])
export class TaskLabel {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    name: string;
    
    @Column({
        type: 'uuid',
        nullable: false
    })
    @Index()
    taskId: string;

    @ManyToOne(() => Task, task => task.labels, { onDelete: 'CASCADE' })
    task: Task;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    createdAt: Date;
    
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    updatedAt: Date;
    
}
