import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from "../../../guards/auth-guard";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: DashboardComponent, canActivate: [AuthGuard]
    },
  ])],
  exports: [RouterModule]
})
export class DashboardsRoutingModule {
}
