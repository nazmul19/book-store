import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Book, BookAvailabilityStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto } from './dto/book-query.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  BOOK_AVAILABLE_JOB,
  NOTIFICATION_QUEUE,
} from '../notifications/notification.constants';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
  ) {}

  async create(payload: CreateBookDto): Promise<Book> {
    const existing = await this.bookRepository.findOne({
      where: { isbn: payload.isbn },
    });
    if (existing && !existing.deleted) {
      throw new ConflictException('ISBN already exists');
    }

    const entity = this.bookRepository.create(payload);
    return this.bookRepository.save(entity);
  }

  async findAll(query: BookQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Record<string, unknown> = { deleted: false };
    if (query.author) where.author = ILike(`%${query.author}%`);
    if (query.year) where.publishedYear = query.year;

    const [data, total] = await this.bookRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async search(q: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: [
        { title: ILike(`%${q}%`), deleted: false },
        { author: ILike(`%${q}%`), deleted: false },
      ],
      take: 50,
      order: { updatedAt: 'DESC' },
    });
  }

  async update(id: string, payload: UpdateBookDto): Promise<Book> {
    const existing = await this.bookRepository.findOne({ where: { id } });
    if (!existing || existing.deleted) {
      throw new NotFoundException('Book not found');
    }

    const previousStatus = existing.availabilityStatus;
    Object.assign(existing, payload);
    const saved = await this.bookRepository.save(existing);

    if (
      previousStatus === BookAvailabilityStatus.BORROWED &&
      saved.availabilityStatus === BookAvailabilityStatus.AVAILABLE
    ) {
      await this.notificationQueue.add(BOOK_AVAILABLE_JOB, { bookId: saved.id });
    }

    return saved;
  }

  async softDelete(id: string) {
    const existing = await this.bookRepository.findOne({ where: { id } });
    if (!existing || existing.deleted) {
      throw new NotFoundException('Book not found');
    }
    existing.deleted = true;
    await this.bookRepository.save(existing);
    return { message: 'Book deleted successfully' };
  }
}
