import { Request } from '@loopback/rest';
import { IAuthUserWithPermissions } from '@sourceloop/core';
import * as casbin from 'casbin';
import PostgresAdapter from "casbin-pg-adapter";

/**
 * Authorize action method interface
 */
export interface AuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (userPermissions: string[], request?: Request): Promise<boolean>;
}

/**
 * Authorize action method interface
 */
export interface CasbinAuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (user: IAuthUserWithPermissions, resVal: string): Promise<boolean>;
}
/**
 * Authorization metadata interface for the method decorator
 */
export interface AuthorizationMetadata {
  // Array of permissions required at the method level.
  // User need to have at least one of these to access the API method.
  permissions: string[];

  resource: string;

  // voters: (CasbinVoterFn[]);

  isCasbinPolicy?: boolean;
}

/**
 * Authorization config type for providing config to the component
 */
export interface AuthorizationConfig {
  /**
   * Specify paths to always allow. No permissions check needed.
   */
  allowAlwaysPaths: string[];
}

/**
 * Permissions interface to be implemented by models
 */
export interface Permissions<T> {
  permissions: T[];
}

/**
 * Override permissions at user level
 */
export interface UserPermissionsOverride<T> {
  permissions: UserPermission<T>[];
}

/**
 * User Permission model
 * used for explicit allow/deny any permission at user level
 */
export interface UserPermission<T> {
  permission: T;
  allowed: boolean;
}

/**
 * User permissions manipulation method interface.
 *
 * This is where we can add our business logic to read and
 * union permissions associated to user via role with
 * those associated directly to the user.
 *
 */
export interface UserPermissionsFn<T> {
  (userPermissions: UserPermission<T>[], rolePermissions: T[]): T[];
}

export interface CasbinEnforcerFn<T> {
  (model: T, policy: T | PostgresAdapter): Promise<casbin.Enforcer>;
}

export interface CasbinEnforcerConfigGetterFn {
  (authUser: IAuthUserWithPermissions, resource: string, isCasbinPolicy?: boolean): Promise<CasbinConfig>;
}

export interface CasbinResourceModifierFn {
  (pathParams: string[]): Promise<string>;
}

export interface CasbinConfig {
  model: string;
  policy?: string;
  allowedRes?: string[];
}
