import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RelationRole } from './role/relation-roles.enum';
import { RbacService } from './service/rbac.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHandler = context.getHandler();
    const request = context.switchToHttp().getRequest();

    const requestedRelationRoles = this.reflector.get<RelationRole[]>(
      'relation-roles',
      contextHandler,
    );

    return this.rbacService.authorize(request, requestedRelationRoles);
  }
}
