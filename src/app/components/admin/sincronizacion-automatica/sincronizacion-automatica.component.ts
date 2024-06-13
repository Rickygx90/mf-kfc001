import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { multiSelectI } from '../../../models/interfaces';
import { MenuService } from '../../../services/menu.service';
import { catchError, of, switchMap } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-sincronizacion-automatica',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    ToastModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './sincronizacion-automatica.component.html',
  styleUrl: './sincronizacion-automatica.component.css',
})
export class SincronizacionAutomaticaComponent {
  allCompleteAgregadores: boolean = false;
  btnSincronizarDisabled: boolean = true;
  checkSincronizarDisabled: boolean = false;
  showLoading: boolean = true;
  listSelectableAgregadores: multiSelectI = {
    name: 'Sincronizar desde maxpoint',
    select: false,
    time: new Date(),
    children: [],
  };
  menuService = inject(MenuService);

  getLastConfiguration() {
    this.menuService
      .requestLastConfiguration()
      .pipe(
        switchMap((lastConfiguration) => {
          return this.menuService.requestAggregators(lastConfiguration);
        }),
        catchError((error) => of(console.error(error)))
      )
      .subscribe({
        next: (newConfiguration) => {
          console.log(newConfiguration);
          this.allCompleteAgregadores = false;
          this.listSelectableAgregadores.time = this.formatearHoraAFecha(
            newConfiguration.syncTime
          );
          this.listSelectableAgregadores.children =
            newConfiguration.aggregators.map((aggregator: any) => ({
              ...aggregator,
              time: this.formatearHoraAFecha(aggregator.time),
            }));
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.showLoading = false;
        },
      });
  }

  constructor(private messageService: MessageService) {
    this.getLastConfiguration();
  }

  getAgregadoresSelected(): any {
    const agregadoresSelected = this.listSelectableAgregadores.children.filter(
      (agregador: any) => agregador.select
    );
    return agregadoresSelected;
  }

  updateAllCompleteAgregadores(): void {
    this.btnSincronizarDisabled =
      this.getAgregadoresSelected().length > 0 ? false : true;
  }

  setAllAgregadores(select: boolean): void {
    this.allCompleteAgregadores = select;
    this.listSelectableAgregadores.select = select;
    if (this.listSelectableAgregadores.children == null) {
      return;
    }
    this.listSelectableAgregadores.children.forEach((aggregator) => {
      aggregator.select = select;
      if (select) aggregator.time = this.listSelectableAgregadores.time;
    });
    this.updateAllCompleteAgregadores();
  }

  changeMainSync() {
    if (this.allCompleteAgregadores) {
      this.listSelectableAgregadores.children.map((aggregator) => {
        aggregator.time = this.listSelectableAgregadores.time;
      });
    }
  }

  closeCalendar() {
    if (this.allCompleteAgregadores) {
      this.listSelectableAgregadores.children.map((aggregator) => {
        aggregator.time = this.listSelectableAgregadores.time;
      });
    }
  }

  addZero(value: number): string {
    if (value <= 9) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  formatearFechaAHora(hora: Date = new Date()): string {
    return (
      this.addZero(hora.getHours()) +
      ':' +
      this.addZero(hora.getMinutes()) +
      ':' +
      this.addZero(hora.getSeconds())
    );
  }

  formatearHoraAFecha(hora: string = ''): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const [hour, minutes] = hora.split(':').map(Number);
    const dateWithTime = new Date(year, month, day, hour, minutes);
    return dateWithTime;
  }

  enviarSincronizacionAutomatica() {
    this.btnSincronizarDisabled = true;
    this.checkSincronizarDisabled = true;
    /* Swal.fire({
      title: '<div class="loader"></div>',
      showConfirmButton: false,
      width: 110,
      heightAuto: false,
    }); */

    const agregadoresSelected = this.getAgregadoresSelected();
    const aggregators = agregadoresSelected.map((agregador: any) => ({
      code: agregador.code,
      syncTime: this.formatearFechaAHora(agregador.time),
    }));
    const req = {
      syncMaxPoint: this.listSelectableAgregadores.select,
      syncTime: this.formatearFechaAHora(this.listSelectableAgregadores.time),
      aggregators,
    };
    console.log(req);
    this.menuService.sendAutomaticSync(req).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        this.checkSincronizarDisabled = false;
        console.log(err);
        /* Swal.fire({
          title: 'Error',
          text: 'Error al momento de enviar la sincronizacion',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        }); */
      },
      complete: () => {
        /* Swal.fire({
          title: 'Exito!',
          text: 'La informacion se envio correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false,
        }); */
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'La configuración se guardo exitosamente!',
        });
        this.checkSincronizarDisabled = false;
        this.getLastConfiguration();
      },
    });
  }
}
