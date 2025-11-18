import { Routes } from '@angular/router';
import {WeddingInvitation} from './features/wedding-invitation/wedding-invitation';
import {Home} from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: ':coupleName',
    component: WeddingInvitation
  }
];
