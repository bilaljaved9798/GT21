import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { Markets } from '../markets/markets';


export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: Dashboard },
  {path:'market',component:Markets}

];
