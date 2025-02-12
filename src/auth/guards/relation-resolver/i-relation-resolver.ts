import { RelationRole } from '../role/relation-roles.enum';

/**
 * T - Type of user
 * U - Type of relatedObject
 */
export interface IRelationResolver<T, U> {
  /**
   * Return RelationRoles that this resolver is responsible to handle.
   */
  getSupportedRelations(): Promise<RelationRole[]>;

  /**
   * Retrieve related object from the request data.
   */
  getRelatedObject(request: any): Promise<U>;

  /**
   * Calculate and provide relation between user and related object.
   */
  getRelations(user: T, relatedObject: U): Promise<RelationRole[]>;
}
