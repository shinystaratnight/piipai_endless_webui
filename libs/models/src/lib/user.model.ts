import { Language } from './language.model';
import { Role } from './role.model';

export interface User {
  status: string;
  data: {
    contact: {
      company: string;
      picture: {
        origin: string;
        thumb: string;
      },
      email: string;
      contact_id: string;
      contact_type: string;
      company_id: string;
      candidate_contact: string;
      id: string;
      name: string;
      __str__: string;
      default_language: Language;
    },
    is_primary: boolean;
    user: string;
    roles: Role[];
    end_trial_date?: string;
    country_code: string;
    country_phone_prefix?: string;
    timezone?: string;
    allow_job_creation?: boolean;
  };
  currentRole: Role;
}
