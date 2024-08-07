import {Component, OnInit, inject} from '@angular/core';
import {multiSelectI} from '../../../models/interfaces';
import {MenuService} from '../../../services/menu.service';
import {MessageService} from 'primeng/api';
import {
  formatearFechaAHora,
  formatearHoraAFecha,
  validateResponse,
} from '../../../shared/utils';

@Component({
  selector: 'app-sincronizacion-automatica',
  providers: [MessageService],
  templateUrl: './sincronizacion-automatica.component.html',
  styleUrl: './sincronizacion-automatica.component.css',
})
export class SincronizacionAutomaticaComponent implements OnInit {
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

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLastConfiguration();
  }

  getLastConfiguration() {
    this.menuService.requestLastConfiguration().subscribe({
      next: (newConfiguration) => {
        if (newConfiguration) {
          this.allCompleteAgregadores = newConfiguration.syncMaxPoint;
          this.listSelectableAgregadores.select = newConfiguration.syncMaxPoint
          this.listSelectableAgregadores.time = formatearHoraAFecha(
            newConfiguration.syncTime
          );
          this.listSelectableAgregadores.children =
            newConfiguration.aggregators.map((aggregator: any) => ({
              ...aggregator,
              syncTime: formatearHoraAFecha(aggregator.syncTime),
            }));
          this.showLoading = false;
        }
      },
      error: (err) => {
        //this.validateErrorResponse(err);
        this.messageService.add(validateResponse(err));
        this.showLoading = false;
      },
      complete: () => {
        this.btnSincronizarDisabled = false;
      },
    });
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
    //this.allCompleteAgregadores = select;
    this.listSelectableAgregadores.select = select;
    // if (this.listSelectableAgregadores.children == null) {
    //   return;
    // }
    // this.listSelectableAgregadores.children.forEach((aggregator) => {
    //   aggregator.select = select;
    //   if (select) aggregator.syncTime = this.listSelectableAgregadores.time;
    // });
    // this.updateAllCompleteAgregadores();
  }

  changeMainSync() {
    this.listSelectableAgregadores.time = this.dateIsNotNull(
      this.listSelectableAgregadores.time
    );
  }

  dateIsNotNull(time: any): Date {
    if (!time) {
      return (time = new Date());
    }
    return time;
  }

  /* guardarSincronizacionAutomatica(req: any) {
    localStorage.setItem('sincronizacionAutomatica', JSON.stringify(req));
    this.messageService.add({
      severity: 'success',
      summary: 'Exito',
      detail: 'La configuración se guardo exitosamente!',
    });
  } */

  onFocus(select: any): void {
    console.log('onFocus');
    console.log(select);
    if (select) this.btnSincronizarDisabled = false;
  }

  enviarSincronizacionAutomatica() {
    this.showLoading = true;
    this.btnSincronizarDisabled = true;
    this.checkSincronizarDisabled = true;
    const agregadoresSelected = this.getAgregadoresSelected();
    const aggregators = agregadoresSelected.map((agregador: any) => ({
      code: agregador.code,
      syncTime: formatearFechaAHora(agregador.syncTime),
    }));
    const req = {
      syncMaxPoint: this.listSelectableAgregadores.select,
      syncTime: formatearFechaAHora(this.listSelectableAgregadores.time),
      aggregators,
    };
    console.log(JSON.stringify(req));
    //this.guardarSincronizacionAutomatica(req);
    this.menuService.sendAutomaticSync(req).subscribe({
      next: (response) => {
        console.log(response);
        //this.messageService.add(validateResponse(err));
      },
      error: (err) => {
        //this.validateErrorResponse(err);
        this.messageService.add(validateResponse(err));
      },
      complete: () => {
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
