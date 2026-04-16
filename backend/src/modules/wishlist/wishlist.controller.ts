import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('api/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() payload: CreateWishlistDto) {
    return this.wishlistService.create(payload);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.wishlistService.findByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }
}
