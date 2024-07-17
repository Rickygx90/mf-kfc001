import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {SelectButtonModule} from "primeng/selectbutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {PaginatorModule} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import {AutoFocusModule} from "primeng/autofocus";
import {DividerModule} from "primeng/divider";
import {TimelineModule} from "primeng/timeline";
import {ToastModule} from "primeng/toast";
import {SincronizacionAutomaticaComponent} from "./sincronizacion-automatica.component";
import {SincronizacionAutomaticaRoutingModule} from "./sincronizacion-automatica-routing.module";
import {MatCheckbox} from "@angular/material/checkbox";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    StyleClassModule,
    ButtonModule,
    SincronizacionAutomaticaRoutingModule,
    SelectButtonModule,
    RippleModule,
    TooltipModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    ProgressBarModule,
    PaginatorModule,
    DialogModule,
    AutoFocusModule,
    DividerModule,
    TimelineModule,
    ToastModule,
    MatCheckbox,
    CalendarModule,
  ],
  declarations: [SincronizacionAutomaticaComponent]
})
export class SincronizacionAutomaticaModule {
}
