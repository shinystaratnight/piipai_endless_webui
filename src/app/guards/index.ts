import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';
import { SubdomainGuard } from './subdomain-guard';
import { PermissionGuard } from './permission.guard';
import { LogoutGuard } from './logout.guard';

export * from './auth-guard';
export * from './not-authorized-guard';
export * from './subdomain-guard';
export * from './permission.guard';
export * from './logout.guard';

export const guards = [
  AuthGuard,
  NotAuthorizedGuard,
  SubdomainGuard,
  PermissionGuard,
  LogoutGuard
];
