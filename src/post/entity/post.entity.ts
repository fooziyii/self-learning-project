import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({
  name: 'post',
})
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  timestamp: number;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;
}
