import { CrmComponent } from './crm.component';

export const routes = [
  { path: '', children: [
    { path: '', component: CrmComponent }
  ]}
];
