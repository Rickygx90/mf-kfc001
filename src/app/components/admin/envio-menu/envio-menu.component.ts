import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { MenuService } from '../../../services/menu.service';
import { multiSelectI, optionsToSelectI } from '../../../models/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { CanalEnvioComponent } from '../canal-envio/canal-envio.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { validateResponse } from '../../../shared/utils';

@Component({
  selector: 'app-envio-menu',
  standalone: true,
  imports: [
    SidebarComponent,
    MatCheckboxModule,
    FormsModule,
    NavbarComponent,
    MatButtonModule,
    MatExpansionModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './envio-menu.component.html',
  styleUrl: './envio-menu.component.css',
})
export class EnvioMenuComponent implements CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.listSelectableCategories);
    if (
      this.listSelectableMenu.children.length > 0 ||
      this.listSelectableCategories.children.length > 0 ||
      this.listSelectableProducts.children.length > 0
    ) {
      const confirmacion1 = window.confirm(
        '¿Estás seguro de que deseas salir de esta página?'
      );

      if (confirmacion1) {
        const confirmacion2 = window.confirm(
          '¿Deseas guardar los cambios antes de salir?'
        );

        if (confirmacion2) {
          localStorage.setItem(
            'sincronizacionManual',
            JSON.stringify({
              configMenu: this.listSelectableMenu,
              configCategoria: this.listSelectableCategories,
              configProducto: this.listSelectableProducts,
            })
          );
        } else {
          localStorage.removeItem('sincronizacionManual');
        }
      }

      return confirmacion1;
    }
    return true;
  }

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService
  ) {
    const sincronizacionManual = localStorage.getItem('sincronizacionManual');
    if (sincronizacionManual) {
      const { configMenu, configCategoria, configProducto } =
        JSON.parse(sincronizacionManual);
      this.listSelectableMenu = configMenu;
      if (configCategoria.children.length > 0) {
        this.listSelectableCategories = configCategoria;
        this.showCategorias = true;
      }
      if (configProducto.children.length > 0) {
        this.listSelectableProducts = configProducto;
        this.showProductos = true;
      }
    }
  }
  menuService = inject(MenuService);

  allCompleteMenu: boolean = false;
  allCompleteCategoria: boolean = false;
  allCompleteProducto: boolean = false;

  subCategoriasSelected: Array<optionsToSelectI> = [];
  subProductoSelected: Array<optionsToSelectI> = [];

  showCategorias: boolean = false;
  showProductos: boolean = false;
  btnCanalEnvioDisabled: boolean = true;
  btnSincronizarMaxpointDisabled: boolean = false;

  listSelectableMenu: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableCategories: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  listSelectableProducts: multiSelectI = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  restartCategoriasProductos(panel: string): void {
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

  updateAllCompleteSubOptions(obj: optionsToSelectI, panel: string): void {
    obj.allCompleteSubCategoria =
      obj.children != null && obj.children.every((obj) => obj.select);
    obj.children?.map((subobj) => {
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

  setAllSubOptions(
    obj: optionsToSelectI,
    panel: string,
    select: boolean
  ): void {
    obj.allCompleteSubCategoria = select;
    if (obj.children == null) {
      return;
    }
    obj.children.forEach((subobj) => {
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

  updateAllCompleteMenu(): void {
    this.allCompleteMenu =
      this.listSelectableMenu.children != null &&
      this.listSelectableMenu.children.every((t) => t.select);
    const menusSelected = this.listSelectableMenu.children.filter(
      (menu) => menu.select
    );
    this.menuService
      .getCategoriasMenuToSelectCheckbox(menusSelected)
      .subscribe({
        next: (categorias) => {
          this.listSelectableCategories.children = categorias;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.restartCategoriasProductos('menu');
        },
      });
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

  setAllMenu(select: boolean): void {
    this.allCompleteMenu = select;
    if (this.listSelectableMenu.children == null) {
      return;
    }
    this.listSelectableMenu.children.forEach((t) => (t.select = select));
    const menusSelected = this.listSelectableMenu.children.filter(
      (menu) => menu.select
    );
    this.menuService
      .getCategoriasMenuToSelectCheckbox(menusSelected)
      .subscribe({
        next: (categorias) => {
          console.log(categorias);
          this.listSelectableCategories.children = categorias;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.restartCategoriasProductos('menu');
        },
      });
  }

  updateAllCompleteCategorias(): void {
    this.allCompleteCategoria =
      this.listSelectableCategories.children != null &&
      this.listSelectableCategories.children.every(
        (categoria) => categoria.select
      );
  }

  someCompleteCategorias(): boolean {
    if (this.listSelectableCategories.children == null) {
      return false;
    }
    return (
      this.listSelectableCategories.children.filter(
        (categoria) => categoria.select
      ).length > 0 && !this.allCompleteCategoria
    );
  }

  setAllCategorias(select: boolean): void {
    this.subCategoriasSelected = [];
    this.allCompleteCategoria = select;
    if (this.listSelectableCategories.children == null) {
      return;
    }
    this.listSelectableCategories.children.forEach((categoria) => {
      categoria.select = select;
      categoria.allCompleteSubCategoria = select;
      categoria.children?.forEach(
        (subCategoria) => (subCategoria.select = categoria.select)
      );
    });
    this.listSelectableCategories.children.map((categoria) => {
      categoria.children?.map((subcategoria) => {
        if (subcategoria.select) this.subCategoriasSelected.push(subcategoria);
      });
    });
    this.menuService
      .getProductosCategoriasToSelectCheckbox(this.subCategoriasSelected)
      .subscribe({
        next: (categorias) => {
          console.log(categorias);
          this.listSelectableProducts.children = categorias;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.restartCategoriasProductos('categoria');
        },
      });
  }

  updateAllCompleteSubCategorias(categoria: optionsToSelectI): void {
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    this.menuService
      .getProductosCategoriasToSelectCheckbox(this.subCategoriasSelected)
      .subscribe({
        next: (categorias) => {
          console.log(categorias);
          this.listSelectableProducts.children = categorias;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.restartCategoriasProductos('categoria');
        },
      });
  }

  someCompleteSubCategorias(categoria: optionsToSelectI): boolean {
    if (categoria.children == null) {
      return false;
    }
    return (
      categoria.children.filter((categoria) => categoria.select).length > 0 &&
      !categoria.allCompleteSubCategoria
    );
  }

  setAllSubCategorias(select: boolean, categoria: any): void {
    this.setAllSubOptions(categoria, 'categoria', select);
    this.menuService
      .getProductosCategoriasToSelectCheckbox(this.subCategoriasSelected)
      .subscribe({
        next: (categorias) => {
          console.log(categorias);
          this.listSelectableProducts.children = categorias;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.restartCategoriasProductos('categoria');
        },
      });
  }

  updateAllCompleteProductos(): void {
    this.allCompleteProducto =
      this.listSelectableProducts.children != null &&
      this.listSelectableProducts.children.every((producto) => producto.select);
  }

  someCompleteProductos(): boolean {
    if (this.listSelectableProducts.children == null) {
      return false;
    }
    return (
      this.listSelectableProducts.children.filter((producto) => producto.select)
        .length > 0 && !this.allCompleteProducto
    );
  }

  setAllProductos(select: boolean): void {
    this.subProductoSelected = [];
    this.allCompleteProducto = select;
    if (this.listSelectableProducts.children == null) {
      return;
    }
    this.listSelectableProducts.children.forEach((producto) => {
      producto.select = select;
      producto.allCompleteSubProducto = select;
      producto.children?.forEach(
        (subproducto) => (subproducto.select = producto.select)
      );
    });
    this.listSelectableProducts.children.map((producto) => {
      producto.children?.map((subproducto) => {
        if (subproducto.select) this.subProductoSelected.push(subproducto);
      });
    });
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  updateAllCompleteSubProductos(producto: optionsToSelectI): void {
    this.updateAllCompleteSubOptions(producto, 'producto');
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  someCompleteSubProductos(producto: optionsToSelectI): boolean {
    if (producto.children == null) {
      return false;
    }
    return (
      producto.children.filter((producto: any) => producto.select).length > 0 &&
      !producto.allCompleteSubProducto
    );
  }

  setAllSubProductos(select: boolean, producto: any): void {
    this.setAllSubOptions(producto, 'producto', select);
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  openFilterMenu(): void {
    const dialogRef = this.dialog.open(FilterMenuComponent, {
      height: '370px',
      width: '460px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.length > 0)
        this.listSelectableMenu.children = result;
      //console.log(this.menuService.menuList);
    });
  }

  canalEnvio(): void {
    const dialogRef = this.dialog.open(CanalEnvioComponent, {
      data: this.subProductoSelected,
      height: '900px',
      width: '1600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  sincronizarMaxpoint() {
    this.btnSincronizarMaxpointDisabled = true;
    this.menuService.sincronizarMaxpoint().subscribe({
      next: (response) => {
        setTimeout(() => {
          this.btnSincronizarMaxpointDisabled = false;
        }, 3000);
        console.log(response);
        this.messageService.add(
          validateResponse({ ...response, status: response.code })
        );
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.btnSincronizarMaxpointDisabled = false;
        }, 3000);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al enviar la configuracion!',
        });
      },
      complete: () => {},
    });
  }
}
