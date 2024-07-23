import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard.component';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DashboardsRoutingModule} from './dashboard-routing.module';
import {SelectButtonModule} from "primeng/selectbutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {SliderModule} from "primeng/slider";
import {PaginatorModule} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import {AutoFocusModule} from "primeng/autofocus";
import {TagModule} from "primeng/tag";
import {FieldsetModule} from "primeng/fieldset";
import {DividerModule} from "primeng/divider";
import {TimelineModule} from "primeng/timeline";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SidebarComponent} from "../../../layout/sidebar.component";
import {NavbarComponent} from "../../../layout/navbar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    StyleClassModule,
    ButtonModule,
    DashboardsRoutingModule,
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
    NavbarComponent],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
