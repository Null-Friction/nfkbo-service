import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SearchByNumberDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'Enterprise number must be exactly 10 digits',
  })
  number!: string;
}
