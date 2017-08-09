import { LoginService } from './login.service';
import { ContactRegistrationService } from './contact-registration.service';
import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
import { AuthGuard } from './auth-guard';
import { NotAuthorizedGuard } from './not-authorized-guard';

export const services = [
  LoginService,
  ContactRegistrationService,
  NavigationService,
  UserService,
  AuthGuard,
  NotAuthorizedGuard
];
