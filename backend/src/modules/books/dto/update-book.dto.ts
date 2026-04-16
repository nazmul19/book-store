import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BookAvailabilityStatus } from '../entities/book.entity';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsEnum(BookAvailabilityStatus)
  availabilityStatus?: BookAvailabilityStatus;
}
