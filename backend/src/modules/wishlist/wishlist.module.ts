import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Book])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}
