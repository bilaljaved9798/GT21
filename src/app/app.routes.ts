import { Routes } from '@angular/router';
import { Login } from './Page/login/login';
import { Markets } from './Page/markets/markets';
import { Layout } from './layout/layout';
import { authGuard } from './Services/auth-guard';

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
      { path: 'market', component: Markets }
    ]
  },

  // Fallback route
  { path: '**', redirectTo: '' }
];