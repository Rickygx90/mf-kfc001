import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SincronizacionAutomaticaComponent} from "./sincronizacion-automatica.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: SincronizacionAutomaticaComponent
    },
  ])],
  exports: [RouterModule]
})
export class SincronizacionAutomaticaRoutingModule {
}
