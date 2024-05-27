import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EnvioMenuComponent } from '../envio-menu/envio-menu.component';
import { HomeComponent } from './home.component';
import { SincronizacionAutomaticaComponent } from '../sincronizacion-automatica/sincronizacion-automatica.component';

export const HOME_ROUTES: Routes = [
    { 
        path: '', 
        component: HomeComponent, 
        children: [
            { path: '', component: DashboardComponent},
            { path: 'dashboard', component: DashboardComponent},
            { path: 'enviomenu', component: EnvioMenuComponent},
            { path: 'sincronizacionauto', component: SincronizacionAutomaticaComponent}
        ]
    },
];
