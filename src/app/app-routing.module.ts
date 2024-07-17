import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {AuthGuard} from "./guards/authguard.service";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: "",
        redirectTo: "home/dashboard",
        pathMatch: "full"
      },
      {
        path: 'home', component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'dashboard',
            loadChildren: () => import('./components/admin/dashboard/dashboard.module').then(m => m.DashboardModule)
          },
          {
            path: 'enviomenu',
            loadChildren: () => import('./components/admin/envio-menu/envio-menu.module').then(m => m.EnvioMenuModule)
          },
          {
            path: 'sincronizacionauto',
            loadChildren: () => import('./components/admin/sincronizacion-automatica/sincronizacion-automatica.module').then(m => m.SincronizacionAutomaticaModule)
          }
        ]
      },
      {path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)},
      {path: 'notfound', component: PageNotFoundComponent},
      {path: '**', redirectTo: '/notfound'},
    ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
