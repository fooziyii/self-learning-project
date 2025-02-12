import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  message: string;
}
