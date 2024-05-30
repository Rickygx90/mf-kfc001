import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { multiSelectI } from '../../../models/interfaces';
import { MenuService } from '../../../services/menu.service';
import { catchError, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './sincronizacion-automatica.component.html',
  styleUrl: './sincronizacion-automatica.component.css',
})
export class SincronizacionAutomaticaComponent {
  allCompleteAgregadores: boolean = false;
  btnSincronizarDisabled: boolean = true;
  showLoading: boolean = true;
  listSelectableAgregadores: multiSelectI = {
    name: 'Sincronizar desde maxpoint',
    select: false,
    time: '',
    children: [],
  };
  menuService = inject(MenuService);

  constructor() {
    this.menuService
      .requestLastConfiguration()
      .pipe(
        switchMap((lastConfiguration) => {
          return this.menuService.requestAggregators(lastConfiguration);
        })
        //catchError((error) => console.error(error))
      )
      .subscribe({
        next: (newConfiguration) => {
          this.listSelectableAgregadores.time = newConfiguration.syncTime;
          this.listSelectableAgregadores.children =
            newConfiguration.newAggregators;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.info('complete');
          this.showLoading = false;
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
    this.allCompleteAgregadores = select;
    this.listSelectableAgregadores.select = select;
    if (this.listSelectableAgregadores.children == null) {
      return;
    }
    this.listSelectableAgregadores.children.forEach((t) => {
      t.select = select;
      if (select) t.time = this.listSelectableAgregadores.time;
    });
    this.btnSincronizarDisabled =
      this.getAgregadoresSelected().length > 0 ? false : true;
  }

  changeMainSync() {
    console.log('changeMainSync!!!!');
    if (this.allCompleteAgregadores) {
      console.log(this.listSelectableAgregadores.time);
      this.listSelectableAgregadores.children.map((agg) => {
        console.log(agg);
        agg.time = this.listSelectableAgregadores.time;
      });
    }
  }

  formatearHora(hora: string = '') {
    if (hora.length === 5) {
      return hora + ':00';
    }
    return hora;
  }

  enviarSincronizacionAutomatica() {
    Swal.fire({
      title: '<div class="loader"></div>',
      showConfirmButton: false,
      width: 110,
      heightAuto: false,
    });

    const agregadoresSelected = this.getAgregadoresSelected();
    const aggregators = agregadoresSelected.map((agregador: any) => ({
      code: agregador.code,
      syncTime: this.formatearHora(agregador.time),
    }));
    const req = {
      syncMaxPoint: this.listSelectableAgregadores.select,
      syncTime: this.formatearHora(this.listSelectableAgregadores.time),
      aggregators,
    };

    this.menuService.sendAutomaticSync(req).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: 'Error al momento de enviar la sincronizacion',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
      },
      complete: () => {
        Swal.fire({
          title: 'Exito!',
          text: 'La informacion se envio correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
      },
    });
  }
}
