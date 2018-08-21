import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';
import { SubdomenGuard } from './subdomen-guard';

export * from './auth-guard';
export * from './not-authorized-guard';
export * from './subdomen-guard';

export const guards = [
  AuthGuard,
  NotAuthorizedGuard,
  SubdomenGuard
];
