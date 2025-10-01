import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SearchByNameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Company name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'Company name must not exceed 100 characters',
  })
  name!: string;
}
