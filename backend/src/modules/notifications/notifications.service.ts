import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationLog } from './entities/notification-log.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationLog)
    private readonly logsRepository: Repository<NotificationLog>,
  ) {}

  findAll() {
    return this.logsRepository.find({ order: { createdAt: 'DESC' }, take: 200 });
  }
}
