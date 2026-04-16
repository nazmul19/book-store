import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationLog } from './entities/notification-log.entity';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NOTIFICATION_QUEUE } from './notification.constants';
import { WishlistModule } from '../wishlist/wishlist.module';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationLog, Book]),
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
    WishlistModule,
  ],
  providers: [NotificationsProcessor, NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
