import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto, BookSearchDto } from './dto/book-query.dto';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() payload: CreateBookDto) {
    return this.booksService.create(payload);
  }

  @Get()
  findAll(@Query() query: BookQueryDto) {
    return this.booksService.findAll(query);
  }

  @Get('search')
  search(@Query() query: BookSearchDto) {
    return this.booksService.search(query.q);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.booksService.update(id, payload);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.booksService.softDelete(id);
  }
}
