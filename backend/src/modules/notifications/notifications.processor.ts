import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import {
  BOOK_AVAILABLE_JOB,
  NOTIFICATION_QUEUE,
} from './notification.constants';
import { WishlistService } from '../wishlist/wishlist.service';
import { NotificationLog } from './entities/notification-log.entity';
import { Book } from '../books/entities/book.entity';

@Processor(NOTIFICATION_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  constructor(
    private readonly wishlistService: WishlistService,
    @InjectRepository(NotificationLog)
    private readonly logsRepository: Repository<NotificationLog>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {
    super();
  }

  async process(job: Job<{ bookId: string }>) {
    if (job.name !== BOOK_AVAILABLE_JOB) return;

    const book = await this.booksRepository.findOne({
      where: { id: job.data.bookId, deleted: false },
    });
    if (!book) return;

    const wishlistItems = await this.wishlistService.findByBook(book.id);
    for (const item of wishlistItems) {
      const userName = item.user.name?.trim() || 'Reader';
      const message = `Hi ${userName}, "${book.title}" by ${book.author} is now available in the library.`;
      const log = this.logsRepository.create({
        userId: item.user.id,
        bookId: book.id,
        message,
      });
      await this.logsRepository.save(log);
    }
  }
}
