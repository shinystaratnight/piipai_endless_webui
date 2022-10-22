export type RoleType = 'manager' | 'client' | 'candidate';

export interface Role {
  __str__: string;
  id: string;
  domain: string;
  company_id: string;
  company_name: string;
  client_contact_id: string;
  company_contact_rel: {
    company: {
      id: string;
    },
    company_contact: {
      id: string;
      name: string;
    }
  };
  name: RoleType;
}
