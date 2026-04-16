import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, { eager: true, onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;
}
