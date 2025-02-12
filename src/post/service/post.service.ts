import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entity/post.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private repo: Repository<PostEntity>,
  ) {}

  create(message: string, timestamp: number, user: UserEntity) {
    const post = this.repo.create({ message: message, timestamp: timestamp });
    post.user = user;
    return this.repo.save(post);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ where: { id: id }, relations: ['user'] });
  }

  find(message: string) {
    return this.repo.find({ where: { message }, relations: ['user'] });
  }

  async update(id: number, attrs: Partial<PostEntity>, timestamp: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    Object.assign(post, { ...attrs, timestamp });
    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return this.repo.remove(post);
  }
}
