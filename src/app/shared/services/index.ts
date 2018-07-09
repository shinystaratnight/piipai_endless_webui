import { CheckPermissionService } from './check-permission';
import { ErrorsService } from './errors.service';
import { ToastrService } from './toastr.service';

export * from './check-permission';
export * from './errors.service';
export * from './toastr.service';

export const services = [
  CheckPermissionService,
  ErrorsService,
  ToastrService,
];
