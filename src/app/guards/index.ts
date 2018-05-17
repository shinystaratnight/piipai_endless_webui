import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';

export * from './auth-guard';
export * from './not-authorized-guard';

export const guards = [
  AuthGuard,
  NotAuthorizedGuard,
];
