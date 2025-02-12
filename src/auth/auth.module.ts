import { Module } from '@nestjs/common';
import { RbacService } from './guards/service/rbac.service';
import { UserModule } from '../user/user.module';
import { CoreRelationResolver } from './guards/relation-resolver/core.relation-resolver';
import { PostRelationResolver } from './guards/relation-resolver/post-relation-resolver';
import { PostModule } from '../post/post.module';

@Module({
  imports: [UserModule, PostModule],
  controllers: [],
  providers: [RbacService, CoreRelationResolver, PostRelationResolver],
  exports: [RbacService],
})
export class AuthModule {}
