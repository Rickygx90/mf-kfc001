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
import { CadenaI, multiSelectI } from '../../../models/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './canal-envio.component.html',
  styleUrl: './canal-envio.component.css',
})
export class CanalEnvioComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CanalEnvioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  cadenas: Array<CadenaI> = [];
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

  listSelectableRestaurantes: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  ngOnInit(): void {
    this.listSelectableCanalesVenta.children =
      this.menuService.getCanalesVentaToSelectCheckbox();
    this.cadenas = this.menuService.getCadenasToSelect();
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
    this.listSelectableRestaurantes.children =
      this.menuService.getRestaurantesToSelectCheckbox(
        this.cadenasSeleccionadas
      );
  }

  enviarAhora() {
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();
    console.log(canalesVentaSelected);
    console.log(restaurantesSelected);
    console.log(this.data);
    let timerInterval: any = 0;
    Swal.fire({
      width: 100,
      timer: 1000,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      Swal.fire({
        title: 'Datos',
        text: 'La informacion se envio correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  }
}
