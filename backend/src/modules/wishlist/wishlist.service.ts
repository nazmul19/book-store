import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(payload: CreateWishlistDto) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    const book = await this.booksRepository.findOne({
      where: { id: payload.bookId, deleted: false },
    });
    if (!user || !book) {
      throw new NotFoundException('User or book not found');
    }

    const duplicate = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, book: { id: book.id } },
    });
    if (duplicate) throw new ConflictException('Already in wishlist');

    const entity = this.wishlistRepository.create({ user, book });
    return this.wishlistRepository.save(entity);
  }

  findByUser(userId: string) {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  findByBook(bookId: string) {
    return this.wishlistRepository.find({ where: { book: { id: bookId } } });
  }

  async remove(id: string) {
    const existing = await this.wishlistRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistRepository.delete(id);
    return { message: 'Wishlist item deleted successfully' };
  }
}
