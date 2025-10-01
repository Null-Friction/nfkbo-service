import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SearchByEstablishmentNumberDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^2\d{9}$/, {
    message: 'Establishment number must be exactly 10 digits starting with 2',
  })
  establishmentNumber!: string;
}
