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
import { CadenaI, multiSelect2I, multiSelectI } from '../../../models/interfaces';
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

  cadenas: Array<any> = [];
  cadenasSeleccionadas: Array<CadenaI> = [];
  menuService = inject(MenuService);
  allCompleteCategoria: boolean = false;
  allCompleteRestaurante: boolean = false;
  btnEnviarAhoraDisabled: boolean = true;
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
    this.menuService.getCanalesVentaToSelectCheckbox().subscribe({
      next: (canales) => {
        this.listSelectableCanalesVenta.children = canales;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete getCanalesVentaToSelectCheckbox!!!');
      },
    });

    this.menuService.getCadenasToSelect().subscribe({
      next: (cadenas) => {
        this.cadenas = cadenas.map(cadena => ({
          name: cadena.description,
          code: cadena.id
        }));
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete getCadenasToSelect!!!');
      },
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

  updateAllCompleteCategorias(): void {
    this.allCompleteCategoria =
      this.listSelectableCanalesVenta.children != null &&
      this.listSelectableCanalesVenta.children.every((t) => t.select);
    this.toggleBtnEnviarAhoraDisabled();
  }

  someCompleteCategorias(): boolean {
    if (this.listSelectableCanalesVenta.children == null) {
      return false;
    }
    return (
      this.listSelectableCanalesVenta.children.filter((t) => t.select).length >
        0 && !this.allCompleteCategoria
    );
  }

  setAllCategorias(select: boolean): void {
    this.allCompleteCategoria = select;
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

  onPanelHideCadenas(): void {
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
  }

  enviarAhora() {
    this.btnEnviarAhoraDisabled = true;
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();

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
