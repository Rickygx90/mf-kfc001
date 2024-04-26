import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuService } from '../../../services/menu.service';
import { Cadena, multiSelectI, Restaurantes } from '../../../models/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canal-envio',
  standalone: true,
  imports: [MatButtonModule, MatCheckboxModule, FormsModule, MultiSelectModule, CommonModule],
  templateUrl: './canal-envio.component.html',
  styleUrl: './canal-envio.component.css'
})
export class CanalEnvioComponent implements OnInit {

  cadenas!: Cadena[];
  cadenasSeleccionadas: Array<any> = [];
  menuService = inject(MenuService);
  allCompleteCategoria: boolean = false;
  allCompleteRestaurante: boolean = false;
  listSelectableCanalesVenta: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableRestaurantes: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  ngOnInit(): void {
    this.listSelectableCanalesVenta.children = this.menuService.getCanalesVenta();
    this.cadenas = this.menuService.getCadenas();
  }

  updateAllCompleteCategorias() {
    console.log('updateAllCompleteCategorias');
    this.allCompleteCategoria =
      this.listSelectableCanalesVenta.children != null &&
      this.listSelectableCanalesVenta.children.every((t) => t.select);
    const categoriasSelected = this.listSelectableCanalesVenta.children.filter((categoria) => categoria.select);
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

  setAllCategorias(select: boolean) {
    console.log('setAllCategorias');
    this.allCompleteCategoria = select;
    if (this.listSelectableCanalesVenta.children == null) {
      return;
    }
    this.listSelectableCanalesVenta.children.forEach((t) => (t.select = select));
    const categoriasSelected = this.listSelectableCanalesVenta.children.filter((categoria) => categoria.select);
  }

  updateAllCompleteRestaurantes() {
    console.log('updateAllCompleteRestaurantes');
    this.allCompleteRestaurante =
      this.listSelectableRestaurantes.children != null &&
      this.listSelectableRestaurantes.children.every((restaurante: any) => restaurante.select);
    const categoriasSelected = this.listSelectableRestaurantes.children.filter((restaurante: any) => restaurante.select);
  }

  someCompleteRestaurantes(): boolean {
    if (this.listSelectableRestaurantes.children == null) {
      return false;
    }
    return (
      this.listSelectableRestaurantes.children.filter((restaurante: any) => restaurante.select).length >
        0 && !this.allCompleteRestaurante
    );
  }

  setAllRestaurantes(select: boolean) {
    console.log('setAllRestaurantes');
    this.allCompleteRestaurante = select;
    if (this.listSelectableRestaurantes.children == null) {
      return;
    }
    this.listSelectableRestaurantes.children.forEach((restaurante: any) => (restaurante.select = select));
    const categoriasSelected = this.listSelectableRestaurantes.children.filter((restaurante: any) => restaurante.select);
  }

  onPanelHideCadenas() {
    console.log('onPanelHide');
    this.listSelectableRestaurantes.children = this.menuService.getRestaurantes(this.cadenasSeleccionadas);
  }

}
