import {inject, NgModule, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {SidebarModule} from 'primeng/sidebar';
import {BadgeModule} from 'primeng/badge';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RippleModule} from 'primeng/ripple';
import {RouterModule} from '@angular/router';
import {AppLayoutComponent} from "./app.layout.component";
import {SidebarComponent} from "./sidebar.component";
import {NavbarComponent} from "./navbar.component";
import {PaginatorModule} from "primeng/paginator";
import {UsersService} from "../services/users.service";

@NgModule({
  declarations: [
    AppLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    SidebarComponent,
    NavbarComponent,
    PaginatorModule,
  ],
  exports: [AppLayoutComponent]
})
export class AppLayoutModule implements OnInit {
  usersService = inject(UsersService);

  constructor() {
    console.log("ngOnInit layout")
    this.usersService.checkStatusAutenticacion()
      .subscribe({
        next: data => {
          if (data) {
            console.log("logged");
          }
        },
        error: err => {
          console.log("error while logging", err);
        }
      })
  }

  ngOnInit(): void {

  }

}
