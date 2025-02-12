import { Injectable } from '@nestjs/common';
import { RelationRole } from '../role/relation-roles.enum';
import { UserService } from '../../../user/service/user.service';
import { UUID } from 'crypto';
import { CoreRelationResolver } from '../relation-resolver/core.relation-resolver';

@Injectable()
export class RbacService {
  constructor(
    private userService: UserService,
    private coreRelationResolver: CoreRelationResolver,
  ) {}

  // NOTE: This method should be implemented however token to user mapping is done - based on business requirement.
  async getUserByIdToken(id: UUID) {
    return await this.userService.findOne(id);
  }

  async authorize(request: any, requestedRelationRoles: RelationRole[]) {
    const user = await this.getUserByIdToken(request.headers['token']);

    if (!user) {
      return false;
    }

    // Relation roles handling (user is not ADMIN - for example - but is author of post)
    if (requestedRelationRoles) {
      const relationRoles = await this.coreRelationResolver.getRelationRoles(
        user,
        requestedRelationRoles,
        request,
      );
      return this.isAllowed(requestedRelationRoles, relationRoles);
    }

    return false;
  }

  isAllowed(
    requestedRelationRoles: RelationRole[],
    containingRelationRoles: RelationRole[],
  ) {
    const matches = containingRelationRoles.filter((sr) => {
      return !!requestedRelationRoles.find((rr) => rr === sr);
    });

    return !!matches.length;
  }

  async filterList(
    request: any,
    entities: any[],
    requestedRelationRoles: RelationRole[],
  ): Promise<any[]> {
    const user = await this.getUserByIdToken(request.headers['token']);

    if (!user) {
      return [];
    }

    const result = [];
    const relationResolver =
      await this.coreRelationResolver.findRelationResolver(
        requestedRelationRoles,
      );

    for (const entity of entities) {
      const singleEntityRelations = await relationResolver.getRelations(
        user,
        entity,
      );
      if (this.isAllowed(requestedRelationRoles, singleEntityRelations)) {
        result.push(entity);
      } else {
        console.warn(
          "WARNING: Check next entity and query that responds with it. It shouldn't be here!",
        );
        console.warn(entity);
      }
    }

    return result;
  }
}
