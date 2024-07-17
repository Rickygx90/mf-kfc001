import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: AppLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./components/admin/dashboard/dashboard.module').then(m => m.DashboardModule)
          }
          /*          {
                      path: '',
                      loadChildren: () => import('./grupokfc/components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                    {
                      path: 'uikit',
                      loadChildren: () => import('./grupokfc/components/uikit/uikit.module').then(m => m.UIkitModule)
                    },*/
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
