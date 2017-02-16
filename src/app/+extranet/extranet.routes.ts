import { ExtranetComponent } from './extranet.component';

export const routes = [
  { path: '', children: [
    { path: '', component: ExtranetComponent }
  ]}
];
