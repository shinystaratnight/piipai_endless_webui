import { CheckPermissionService } from './check-permission';
import { ErrorsService } from './errors.service';

export * from './check-permission';
export * from './errors.service';

export const services = [
  CheckPermissionService,
  ErrorsService,
];
