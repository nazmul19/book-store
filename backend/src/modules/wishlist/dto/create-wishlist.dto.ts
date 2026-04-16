import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookId: string;
}
