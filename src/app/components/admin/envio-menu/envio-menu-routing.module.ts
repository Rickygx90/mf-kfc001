import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EnvioMenuComponent} from "./envio-menu.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: EnvioMenuComponent
    },
  ])],
  exports: [RouterModule]
})
export class EnvioMenuRoutingModule {
}
