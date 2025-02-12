import { Injectable } from '@nestjs/common';
import { RelationRole } from '../role/relation-roles.enum';
import { UserEntity } from '../../../user/entity/user.entity';
import { IRelationResolver } from './i-relation-resolver';
import { PostRelationResolver } from './post-relation-resolver';

@Injectable()
export class CoreRelationResolver {
  private relationResolvers: IRelationResolver<UserEntity, unknown>[];

  constructor(private postRelationAuthorization: PostRelationResolver) {
    this.relationResolvers = [this.postRelationAuthorization];
  }

  async getRelationRoles(
    user: UserEntity,
    requiredRelations: RelationRole[],
    request: any,
  ): Promise<RelationRole[]> {
    let relationRoles = [];

    const relationResolver = await this.findRelationResolver(requiredRelations);

    if (relationResolver) {
      const relatedObject = await relationResolver.getRelatedObject(request);

      if (relatedObject) {
        relationRoles = await relationResolver.getRelations(
          user,
          relatedObject,
        );
      }
    }

    return relationRoles;
  }

  async findRelationResolver(
    requiredRelations: RelationRole[],
  ): Promise<IRelationResolver<UserEntity, unknown>> {
    let result = null;

    for (const relationResolver of this.relationResolvers) {
      const supportedRelations = await relationResolver.getSupportedRelations();

      const matches = supportedRelations.filter((sr) => {
        return !!requiredRelations.find((rr) => rr === sr);
      });

      if (matches.length) {
        result = relationResolver;
        break;
      }
    }

    return result;
  }
}
