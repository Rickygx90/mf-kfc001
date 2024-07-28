import { Component, inject, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuService } from '../../../services/menu.service';
import { multiSelect2I, multiSelectI } from '../../../models/interfaces';
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
    MatRadioModule,
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
  showRestaurantes: Boolean = false;
  menuService = inject(MenuService);
  allCompleteCanales: boolean = false;
  allCompleteRestaurante: boolean = false;
  btnEnviarAhoraDisabled: boolean = true;
  menusSeleccionados: Array<any> = [];

  menuSeleccionado: any;
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
    if (this.data && this.data.menusSeleccionados) {
      console.log(this.data);
      this.menusSeleccionados = this.data.menusSeleccionados.map(
        (menusSeleccionado: any) => {
          return {
            title: menusSeleccionado[0].menus[0].title,
            sincrosId: menusSeleccionado[0].syncrosId,
            checksum: menusSeleccionado[0].checksum,
            checked: false,
          };
        }
      );
      this.menusSeleccionados[0].checked = true;
      this.menuSeleccionado = this.menusSeleccionados[0];
      this.getRestaurantesbyMenus(this.menusSeleccionados[0]);
    }
  }

  getRestaurantesbyMenus(primerMenu: any) {
    this.menuService.getRestaurantesbyMenus(primerMenu).subscribe({
      next: (restaurantes) => {
        if (restaurantes) {
          this.showRestaurantes = true;
          const aux = restaurantes.map((restaurante: any) => {
            return {
              ...restaurante,
              select: false,
            };
          });
          this.listSelectableRestaurantes.children = aux;
        }
      },
      error: (err) => {},
    });
  }

  radioChange($event: any) {
    this.showRestaurantes = false;
    this.menuService.getRestaurantesbyMenus($event.value).subscribe({
      next: (restaurantes) => {
        console.log(restaurantes);
        if (restaurantes) {
          this.showRestaurantes = true;
          const aux = restaurantes.map((restaurante: any) => {
            return {
              ...restaurante,
              select: false,
            };
          });
          this.listSelectableRestaurantes.children = aux;
        }
      },
      error: (err) => {},
    });
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

  enviarAhora() {
    console.log(' ---------------- enviarAhora ---------------- ');
    this.btnEnviarAhoraDisabled = true;
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();

    console.log(canalesVentaSelected);
    console.log(restaurantesSelected);
    console.log(this.menuSeleccionado);
    console.log(this.data.productosSeleccionados);

    const productosPorCategorias: Array<any> = [];
    
    this.data.productosSeleccionados.forEach((productoSeleccionado: any) => {
      if (productoSeleccionado.sincroId === this.menuSeleccionado.sincrosId) {
        if (
          productosPorCategorias.filter(
            (e: any) => e.id === productoSeleccionado.catId
          ).length === 0
        ) {
          productosPorCategorias.push({
            id: productoSeleccionado.catId,
            products: [productoSeleccionado[0].id],
          });
        } else {
          productosPorCategorias.forEach((e: any) => {
            if (e.id === productoSeleccionado.catId)
              e.products.push(productoSeleccionado[0].id);
          });
        }
      }
    });

    console.log(productosPorCategorias);

    const request = {
      request_menu: [
        {
          sync_id: this.menuSeleccionado.sincrosId,
          checksum: this.menuSeleccionado.checksum,
          metadata: {
            platforms: canalesVentaSelected.map(
              (canalVenta: any) => canalVenta.name
            ),
            restaurant: restaurantesSelected.map((restaurante: any) => {
              return {
                id: restaurante.id.toString(),
                chain_id: restaurante.idChain.toString(),
              };
            }),
          },
          categories: productosPorCategorias,
        },
      ],
    };

    this.menuService.sendManualSync(request).subscribe({
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
