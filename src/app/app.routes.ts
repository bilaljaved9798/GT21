import { Routes } from '@angular/router';
import { Login } from './Page/login/login';
import { Markets } from './Page/markets/markets';
import { authGuard } from './Services/auth-guard';
import { Layout } from './layout/layout';
import { Pl } from './Page/pl/pl';
import { Ledger } from './Page/ledger/ledger';

export const routes: Routes = [
  // Login route (no layout)
  { path: '', component: Login },

  // Routes inside Layout (header/sidebar)
  {
    path: '',
    component: Layout,
    canActivate: [authGuard], // uncomment if needed
    children: [
      // Dashboard (lazy-loaded)
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../app/Page/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },

      // Market (direct component, same layout)
      { path: 'market', component: Markets },
      { path: 'pl', component: Pl },
      { path: 'ledger', component: Ledger }
    ]
  },

  // Fallback route
  { path: '**', redirectTo: '' }
];