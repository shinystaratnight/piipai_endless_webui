import { Role } from './role.interface';

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
    },
    is_primary: boolean;
    user: string;
    roles: Role[];
    end_trial_date?: string;
    country_code?: string;
    country_phone_prefix?: string;
    timezone?: string;
  };
  currentRole: Role;
}
