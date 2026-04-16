import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Book } from './entities/book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { NOTIFICATION_QUEUE } from '../notifications/notification.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule],
})
export class BooksModule {}
