import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  Matches,
  MinLength,
  MaxLength
} from 'class-validator';

export class EstablishmentSearchDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'Enterprise number must be exactly 10 digits',
  })
  enterpriseNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^2\d{9}$/, {
    message: 'Establishment number must be exactly 10 digits starting with 2',
  })
  establishmentNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Denomination must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'Denomination must not exceed 100 characters',
  })
  denomination?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'Zipcode must be exactly 4 digits',
  })
  zipcode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, {
    message: 'Page must be at least 1',
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, {
    message: 'Limit must be at least 1',
  })
  @Max(100, {
    message: 'Limit must not exceed 100',
  })
  limit?: number = 20;
}