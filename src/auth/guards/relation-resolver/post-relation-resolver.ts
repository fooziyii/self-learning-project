import { Injectable } from '@nestjs/common';
import { IRelationResolver } from './i-relation-resolver';
import { UserEntity } from '../../../user/entity/user.entity';
import { PostEntity } from '../../../post/entity/post.entity';
import { PostService } from '../../../post/service/post.service';
import { RelationRole } from '../role/relation-roles.enum';

@Injectable()
export class PostRelationResolver
  implements IRelationResolver<UserEntity, PostEntity>
{
  constructor(private postService: PostService) {}

  async getSupportedRelations(): Promise<RelationRole[]> {
    return [RelationRole.PostAuthor];
  }

  async getRelatedObject(request: any): Promise<PostEntity> {
    const postId: string = request.params.postId;

    return await this.postService.findOne(parseInt(postId));
  }

  async getRelations(
    user: UserEntity,
    relatedObject: PostEntity,
  ): Promise<RelationRole[]> {
    const relations = [];

    if (relatedObject.user.id === user.id) {
      relations.push(RelationRole.PostAuthor);
    }

    return relations;
  }
}
