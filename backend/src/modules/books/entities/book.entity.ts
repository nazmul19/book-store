import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
}

@Entity('books')
@Index(['author'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ type: 'int' })
  publishedYear: number;

  @Column({
    type: 'enum',
    enum: BookAvailabilityStatus,
    default: BookAvailabilityStatus.AVAILABLE,
  })
  availabilityStatus: BookAvailabilityStatus;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
