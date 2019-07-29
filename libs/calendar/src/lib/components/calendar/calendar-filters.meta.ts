import { createFilter, Type } from '@webui/metadata';

export const filters = {
  client: createFilter(Type.Relared, {
    key: 'client',
    label: 'Company/Jobsite/Client contact filter',
    endpoint: '/core/companies/',
  }),
  candidate: createFilter(Type.Relared, {
    key: 'candidate',
    label: 'Candidate contact filter',
    endpoint: '/candidate/candidatecontacts/',
  }),
};
