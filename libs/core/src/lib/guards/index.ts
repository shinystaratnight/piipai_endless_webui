import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';
import { SubdomainGuard } from './subdomain-guard';
import { PermissionGuard } from './permission.guard';
import { LogoutGuard } from './logout.guard';
import { CandidateGuard } from './candidate-guard';
import { ClientGuard } from './client-guard';
import { ManagerGuard } from './manager-guard'

export * from './auth-guard';
export * from './not-authorized-guard';
export * from './subdomain-guard';
export * from './permission.guard';
export * from './logout.guard';
export * from './candidate-guard';
export * from './client-guard';
export * from './manager-guard';

export const guards = [
  AuthGuard,
  NotAuthorizedGuard,
  SubdomainGuard,
  PermissionGuard,
  LogoutGuard,
  CandidateGuard,
  ClientGuard,
  ManagerGuard
];
