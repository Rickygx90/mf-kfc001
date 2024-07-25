import { Component, inject, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuService } from '../../../services/menu.service';
import {
  CadenaI,
  multiSelect2I,
  multiSelectI,
} from '../../../models/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-canal-envio',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MultiSelectModule,
    CommonModule,
    MatDialogContent,
    MatDialogClose,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './canal-envio.component.html',
  styleUrl: './canal-envio.component.css',
})
export class CanalEnvioComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CanalEnvioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService
  ) {}

  showCanales: boolean = false;
  menuService = inject(MenuService);
  allCompleteCanales: boolean = false;
  allCompleteRestaurante: boolean = false;
  btnEnviarAhoraDisabled: boolean = true;
  menusSeleccionados: Array<any> = [];
  listSelectableCanalesVenta: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableRestaurantes: multiSelect2I = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  ngOnInit(): void {
    this.getCanalesVenta();
    console.log(this.data);
    if (this.data && this.data.menusSeleccionados) {
      console.log(this.data.menusSeleccionados);

      this.menusSeleccionados = this.data.menusSeleccionados.map(
        (menusSeleccionado: any) => {
          return {
            title: menusSeleccionado[0].menus[0].title,
            sincrosId: menusSeleccionado[0].syncrosId,
            checksum: menusSeleccionado[0].checksum,
          };
        }
      );
    }

    //menusSeleccionados

    //menusSeleccionados
  }

  getCanalesVenta() {
    this.menuService.requestAggregators().subscribe({
      next: (response) => {
        if (response && response.aggregators) {
          this.showCanales = true;
          this.listSelectableCanalesVenta.children = response.aggregators;
        }
      },
      error: (err) => {},
    });
  }

  getCanalesRestaurantesSelected(): any {
    const canalesVentaSelected =
      this.listSelectableCanalesVenta.children.filter(
        (canalVenta) => canalVenta.select
      );
    const restaurantesSelected =
      this.listSelectableRestaurantes.children.filter(
        (restaurante: any) => restaurante.select
      );
    return { canalesVentaSelected, restaurantesSelected };
  }

  toggleBtnEnviarAhoraDisabled(): void {
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();
    this.btnEnviarAhoraDisabled =
      canalesVentaSelected.length > 0 && restaurantesSelected.length > 0
        ? false
        : true;
  }

  updateAllCompleteCanales(): void {
    this.allCompleteCanales =
      this.listSelectableCanalesVenta.children != null &&
      this.listSelectableCanalesVenta.children.every((t) => t.select);
    this.toggleBtnEnviarAhoraDisabled();
  }

  someCompleteCanales(): boolean {
    if (this.listSelectableCanalesVenta.children == null) {
      return false;
    }
    return (
      this.listSelectableCanalesVenta.children.filter((t) => t.select).length >
        0 && !this.allCompleteCanales
    );
  }

  setAllCanales(select: boolean): void {
    this.allCompleteCanales = select;
    if (this.listSelectableCanalesVenta.children == null) {
      return;
    }
    this.listSelectableCanalesVenta.children.forEach(
      (t) => (t.select = select)
    );
    this.toggleBtnEnviarAhoraDisabled();
  }

  updateAllCompleteRestaurantes(): void {
    this.allCompleteRestaurante =
      this.listSelectableRestaurantes.children != null &&
      this.listSelectableRestaurantes.children.every(
        (restaurante: any) => restaurante.select
      );
    this.toggleBtnEnviarAhoraDisabled();
  }

  someCompleteRestaurantes(): boolean {
    if (this.listSelectableRestaurantes.children == null) {
      return false;
    }
    return (
      this.listSelectableRestaurantes.children.filter(
        (restaurante: any) => restaurante.select
      ).length > 0 && !this.allCompleteRestaurante
    );
  }

  setAllRestaurantes(select: boolean): void {
    this.allCompleteRestaurante = select;
    if (this.listSelectableRestaurantes.children == null) {
      return;
    }
    this.listSelectableRestaurantes.children.forEach(
      (restaurante: any) => (restaurante.select = select)
    );
    this.toggleBtnEnviarAhoraDisabled();
  }

  /* onPanelHideCadenas(): void {
    this.menuService
      .getRestaurantesToSelect(this.cadenasSeleccionadas)
      .subscribe({
        next: (restaurantes) => {
          this.listSelectableRestaurantes.children = restaurantes;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  } */

  enviarAhora() {
    this.btnEnviarAhoraDisabled = true;
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();

    const aux = {
      request_menu: [
        {
          id: '01ef4966-e131-6ddd-8f2f-da6cf2af338a',
          sync_id: '01ef4966-cf22-6798-8f2f-da6cf2af338a',
          checksum:
            '2efff4c1fdd09748356520e66ee46134cc04c87afe668fe989a3fe38e5bb272b',
          metadata: {
            platforms: ['platform1', 'platform2'],
            restaurant: [
              { id: '879', chain_id: '37' },
              { id: '795', chain_id: '22' },
            ],
          },
          categories: [
            '24B5DE5C-2EE2-EE11-8076-C896655094A7',
            '1CAD2867-6BCB-E911-80E5-000D3A019254',
          ],
          products: ['33869', '33877'],
        },
      ],
    };





    
    this.menuService
      .sendManualSync({
        canalesVentaSelected,
        restaurantesSelected,
        products: this.data,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'La configuración se guardo exitosamente!',
          });
          //this.dialogRef.close();
        },
      });
  }
}
