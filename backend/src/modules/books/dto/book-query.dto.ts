import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class BookQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  author?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;
}

export class BookSearchDto {
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  q: string;
}
