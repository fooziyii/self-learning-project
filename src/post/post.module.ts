import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), SocketModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
