import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from '@angular/forms';

import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {CommonModule} from "@angular/common";
import {LoginRoutingModule} from "./login-routing.module";

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
}
