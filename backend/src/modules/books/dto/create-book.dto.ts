import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

const currentYear = new Date().getFullYear();

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @Min(1000)
  @Max(currentYear)
  publishedYear: number;
}
