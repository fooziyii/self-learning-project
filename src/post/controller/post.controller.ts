import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { User } from '../../user/decorators/user.decorator';
import { UserEntity } from '../../user/entity/user.entity';
import { PostDto } from '../dtos/post.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { SocketGateway } from '../../socket/gateway/socket.gateway';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private socketGateway: SocketGateway,
  ) {}

  @Get('/:id')
  @Serialize(PostDto)
  getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Post()
  @Serialize(PostDto)
  async createPost(@Body() body: CreatePostDto, @User() user: UserEntity) {
    const post = await this.postService.create(
      body.message,
      new Date().getMilliseconds(),
      user,
    );

    this.socketGateway.server.send('new post added');
    return post;
  }

  @Patch('/:id')
  @Serialize(PostDto)
  updatePost(@Param('id') id: number, @Body() body: UpdatePostDto) {
    return this.postService.update(id, body, new Date().getMilliseconds());
  }
}
