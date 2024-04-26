import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EnvioMenuComponent } from '../envio-menu/envio-menu.component';
import { HomeComponent } from './home.component';

export const HOME_ROUTES: Routes = [
    { 
        path: '', 
        component: HomeComponent, 
        children: [
            { path: 'dashboard', component: DashboardComponent},
            { path: 'enviomenu', component: EnvioMenuComponent}
        ]
    },
];
