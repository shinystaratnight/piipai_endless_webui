import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';
import { SubdomainGuard } from './subdomain-guard';

export * from './auth-guard';
export * from './not-authorized-guard';
export * from './subdomain-guard';

export const guards = [
  AuthGuard,
  NotAuthorizedGuard,
  SubdomainGuard
];
