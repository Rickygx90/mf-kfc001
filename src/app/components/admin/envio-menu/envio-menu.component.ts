import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { MenuService } from '../../../services/menu.service';
import { multiSelectI } from '../../../models/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { CanalEnvioComponent } from '../canal-envio/canal-envio.component';

@Component({
  selector: 'app-envio-menu',
  standalone: true,
  imports: [
    SidebarComponent,
    MatCheckboxModule,
    FormsModule,
    NavbarComponent,
    MatButtonModule,
  ],
  templateUrl: './envio-menu.component.html',
  styleUrl: './envio-menu.component.css',
})
export class EnvioMenuComponent {
  constructor(public dialog: MatDialog) {}
  menuService = inject(MenuService);

  allCompleteMenu: boolean = false;
  allCompleteCategoria: boolean = false;
  subCategoriasSelected: Array<any> = [];
  subProductoSelected: Array<any> = [];

  allCompleteProducto: boolean = false;

  showCategorias: boolean = false;
  showProductos: boolean = false;
  btnCanalEnvioDisabled: boolean = true;

  listSelectableMenu: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableCategories: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableProducts: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  restartCategoriasProductos(panel: string) {
    if (panel === 'menu') {
      this.showCategorias =
        this.listSelectableCategories.children.length > 0 ? true : false;
      this.subCategoriasSelected = [];
      this.listSelectableProducts.children = [];
      this.showProductos =
        this.listSelectableCategories.children.length > 0 &&
        this.listSelectableProducts.children.length > 0
          ? true
          : false;
    } else if (panel === 'categoria') {
      this.showProductos =
        this.listSelectableProducts.children.length > 0 ? true : false;
    }
    this.subProductoSelected = [];
    this.btnCanalEnvioDisabled = true;
  }

  updateAllCompleteSubOptions(obj: any, panel: string) {
    obj.allCompleteSubCategoria =
      obj.children != null && obj.children.every((obj: any) => obj.select);
    obj.children.map((subobj: any) => {
      if (panel === 'categoria') {
        if (subobj.select) {
          if (
            this.subCategoriasSelected.filter(
              (subcategoriaselected) => subcategoriaselected === subobj
            ).length === 0
          ) {
            this.subCategoriasSelected.push(subobj);
          }
        } else {
          this.subCategoriasSelected = this.subCategoriasSelected.filter(
            (subcategoriaselected) => subcategoriaselected != subobj
          );
        }
      } else if (panel === 'producto') {
        if (subobj.select) {
          if (
            this.subProductoSelected.filter(
              (subproductoselected) => subproductoselected === subobj
            ).length === 0
          ) {
            this.subProductoSelected.push(subobj);
          }
        } else {
          this.subProductoSelected = this.subProductoSelected.filter(
            (subproductoselected) => subproductoselected != subobj
          );
        }
      }
    });
  }

  setAllSubOptions(obj: any, panel: string, select: boolean) {
    obj.allCompleteSubCategoria = select;
    if (obj.children == null) {
      return;
    }
    obj.children.forEach((subobj: any) => {
      subobj.select = select;
      if (panel === 'categoria') {
        if (select) {
          if (
            this.subCategoriasSelected.filter(
              (subcategoriaselected) => subcategoriaselected === subobj
            ).length === 0
          ) {
            this.subCategoriasSelected.push(subobj);
          }
        } else {
          this.subCategoriasSelected = this.subCategoriasSelected.filter(
            (subcategoriaselected) => subcategoriaselected != subobj
          );
        }
      } else if (panel === 'producto') {
        if (select) {
          if (
            this.subProductoSelected.filter(
              (subproductoselected) => subproductoselected === subobj
            ).length === 0
          ) {
            this.subProductoSelected.push(subobj);
          }
        } else {
          this.subProductoSelected = this.subProductoSelected.filter(
            (subproductoselected) => subproductoselected != subobj
          );
        }
      }
    });
  }

  updateAllCompleteMenu() {
    this.allCompleteMenu =
      this.listSelectableMenu.children != null &&
      this.listSelectableMenu.children.every((t) => t.select);
    const menusSelected = this.listSelectableMenu.children.filter(
      (menu) => menu.select
    );
    this.listSelectableCategories.children =
      this.menuService.getCategoriasMenu(menusSelected);
    this.restartCategoriasProductos('menu');
  }

  someCompleteMenu(): boolean {
    if (this.listSelectableMenu.children == null) {
      return false;
    }
    return (
      this.listSelectableMenu.children.filter((t) => t.select).length > 0 &&
      !this.allCompleteMenu
    );
  }

  setAllMenu(select: boolean) {
    this.allCompleteMenu = select;
    if (this.listSelectableMenu.children == null) {
      return;
    }
    this.listSelectableMenu.children.forEach((t) => (t.select = select));
    const menusSelected = this.listSelectableMenu.children.filter(
      (menu) => menu.select
    );
    this.listSelectableCategories.children =
      this.menuService.getCategoriasMenu(menusSelected);
    this.restartCategoriasProductos('menu');
  }

  updateAllCompleteCategorias() {
    this.allCompleteCategoria =
      this.listSelectableCategories.children != null &&
      this.listSelectableCategories.children.every(
        (categoria: any) => categoria.select
      );
  }

  someCompleteCategorias(): boolean {
    if (this.listSelectableCategories.children == null) {
      return false;
    }
    return (
      this.listSelectableCategories.children.filter(
        (categoria: any) => categoria.select
      ).length > 0 && !this.allCompleteCategoria
    );
  }

  setAllCategorias(select: boolean) {
    this.subCategoriasSelected = [];
    this.allCompleteCategoria = select;
    if (this.listSelectableCategories.children == null) {
      return;
    }
    this.listSelectableCategories.children.forEach((categoria: any) => {
      categoria.select = select;
      categoria.allCompleteSubCategoria = select;
      categoria.children.forEach(
        (subCategoria: any) => (subCategoria.select = categoria.select)
      );
    });
    this.listSelectableCategories.children.map((categoria: any) => {
      categoria.children.map((subcategoria: any) => {
        if (subcategoria.select) this.subCategoriasSelected.push(subcategoria);
      });
    });
    this.listSelectableProducts.children =
      this.menuService.getProductosCategorias(this.subCategoriasSelected);
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteSubCategorias(categoria: any) {
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    this.listSelectableProducts.children =
      this.menuService.getProductosCategorias(this.subCategoriasSelected);
    this.restartCategoriasProductos('categoria');
  }

  someCompleteSubCategorias(categoria: any): boolean {
    if (categoria.children == null) {
      return false;
    }
    return (
      categoria.children.filter((categoria: any) => categoria.select).length >
        0 && !categoria.allCompleteSubCategoria
    );
  }

  setAllSubCategorias(select: boolean, categoria: any) {
    this.setAllSubOptions(categoria, 'categoria', select);
    this.listSelectableProducts.children =
      this.menuService.getProductosCategorias(this.subCategoriasSelected);
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteProductos() {
    this.allCompleteProducto =
      this.listSelectableProducts.children != null &&
      this.listSelectableProducts.children.every(
        (producto: any) => producto.select
      );
  }

  someCompleteProductos(): boolean {
    if (this.listSelectableProducts.children == null) {
      return false;
    }
    return (
      this.listSelectableProducts.children.filter(
        (producto: any) => producto.select
      ).length > 0 && !this.allCompleteProducto
    );
  }

  setAllProductos(select: boolean) {
    this.subProductoSelected = [];
    this.allCompleteProducto = select;
    if (this.listSelectableProducts.children == null) {
      return;
    }
    this.listSelectableProducts.children.forEach((producto: any) => {
      producto.select = select;
      producto.allCompleteSubProducto = select;
      producto.children.forEach(
        (subproducto: any) => (subproducto.select = producto.select)
      );
    });
    this.listSelectableProducts.children.map((producto: any) => {
      producto.children.map((subproducto: any) => {
        if (subproducto.select) this.subProductoSelected.push(subproducto);
      });
    });
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  updateAllCompleteSubProductos(producto: any) {
    this.updateAllCompleteSubOptions(producto, 'producto');
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  someCompleteSubProductos(producto: any): boolean {
    if (producto.children == null) {
      return false;
    }
    return (
      producto.children.filter((producto: any) => producto.select).length > 0 &&
      !producto.allCompleteSubProducto
    );
  }

  setAllSubProductos(select: boolean, producto: any) {
    this.setAllSubOptions(producto, 'producto', select);
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  openFilterMenu(): void {
    const dialogRef = this.dialog.open(FilterMenuComponent, {
      height: '345px',
      width: '460px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.listSelectableMenu.children = this.menuService.menuList;
      console.log('The dialog was closed');
    });
  }

  canalEnvio() {
    console.log('canalEnvio');
    const dialogRef = this.dialog.open(CanalEnvioComponent, {
      height: '900px',
      width: '1600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
