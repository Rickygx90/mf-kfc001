import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)},
    { path: 'home', loadChildren: () => import('./components/admin/home/home.routes').then(m => m.HOME_ROUTES)},
    { path: '', redirectTo: '/home/dashboard', pathMatch: 'full'},
    { path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)}
    //{ path: 'dashboard', loadChildren: () => import('./components/admin/home/home.routes').then(m => )}
];
 