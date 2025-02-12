import { Expose, Transform } from 'class-transformer';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  timestamp: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
