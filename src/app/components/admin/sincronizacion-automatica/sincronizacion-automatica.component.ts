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
          console.log(lastConfiguration)
          return this.menuService.requestAggregators(lastConfiguration);
        }),
        //catchError((error) => console.error(error))
      )
      .subscribe({
        next: (newConfiguration) => {
          this.listSelectableAgregadores.time = newConfiguration.syncTime;
          this.listSelectableAgregadores.children = newConfiguration.newAggregators;
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
    //this.btnSincronizarDisabled = agregadoresSelected.length > 0 ? false : true;
  }

  updateAllCompleteAgregadores(): void {
    /* this.allCompleteAgregadores =
      this.listSelectableAgregadores.children != null &&
      this.listSelectableAgregadores.children.every((t) => t.select); */
    this.btnSincronizarDisabled =
      this.getAgregadoresSelected().length > 0 ? false : true;
  }

  /*someCompleteAgregadores(): boolean {
    console.log('someCompleteAgregadores!!!');
    if (this.listSelectableAgregadores.children == null) {
      return false;
    }
    return (
      this.listSelectableAgregadores.children.filter((t) => t.select).length >
        0 && !this.allCompleteAgregadores
    );
  } */

  setAllAgregadores(select: boolean): void {
    this.allCompleteAgregadores = select;
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

  enviarSincronizacionAutomatica() {
    console.log('enviarSincronizacionAutomatica!!!');
    console.log(this.getAgregadoresSelected());

    const agregadoresSelected = this.getAgregadoresSelected();

    const aggregators = agregadoresSelected.map((agregador: any) => ({
      code: agregador.id,
      syncTime: agregador.time,
    }));

    console.log(aggregators);

    const req = {
      syncMaxPoint: true,
      syncTime: '18:00:00',
      aggregators: [
        {
          aggregator: {
            id: '66452dbab8e206bc1dc6ab6d',
            code: 0,
            name: 'Uber',
            active: true,
          },
          syncTime: '15:00:00',
        },
      ],
    };
  }
}
