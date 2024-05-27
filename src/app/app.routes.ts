import { Routes } from '@angular/router';
import { LoginGuard } from './guards/login-guards';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [LoginGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./components/admin/home/home.routes').then((m) => m.HOME_ROUTES),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home/dashboard', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
  //{ path: 'dashboard', loadChildren: () => import('./components/admin/home/home.routes').then(m => )}
];
