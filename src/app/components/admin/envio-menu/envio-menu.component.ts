import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Paginator, PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-envio-menu',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MatCheckboxModule,
    FormsModule,
    NavbarComponent,
    MatButtonModule,
    MatExpansionModule,
    ToastModule,
    PaginatorModule,
  ],
  providers: [MessageService],
  templateUrl: './envio-menu.component.html',
  styleUrl: './envio-menu.component.css',
})
export class EnvioMenuComponent implements CanComponentDeactivate, OnInit {
  buscarMenu: string = '';

  onChangeInput(newValue: any) {
    console.log(newValue);
    this.buscarMenu = newValue;

    this.menuService
      .getMenuToSelectCheckbox({
        formularioFiltro: null,
        data: { page: 1, rowsMenu: this.rowsMenu },
        palabra: newValue,
      })
      .subscribe({
        next: (menus) => {
          console.log(menus);
          /* if (menus.groupSync && menus.groupSync?.length > 0) {
              const aux = menus.groupSync.map((syncro: any) => {
                return {
                  syncrosId: syncro.syncrosId,
                  startTime: syncro.startTime,
                  children: syncro.menus.map((menuId: any) => {
                    return menus.groupMenu.filter(
                      (menu: any) => menu.checksum === menuId
                    );
                  }),
                };
              });
              this.listSelectableMenu.children = aux;
              this.listSelectableMenu.page = event.page;
              this.menusSelected.push({ ...this.listSelectableMenu });
              this.loadingMenu = false;
            } */
        },
        error: (err) => {
          this.loadingMenu = false;
          console.log(err);
        },
      });

    /*  this.Platform.ready().then(() => {
       this.rootRef.child("users").child(this.UserID).child('buscarMenu').set(this.buscarMenu)
    }) */
  }

  @ViewChild('paginator', { static: false }) paginator!: Paginator;
  public rowsMenu: number = 3;
  public page: number = 1;
  public total_recordsMenu: number = 0;
  public formularioFiltro: any;
  public menusSelected: any = [];

  menuService = inject(MenuService);

  loadingMenu: boolean = false;
  allCompleteMenu: boolean = false;
  allCompleteCategoria: boolean = false;
  allCompleteProducto: boolean = false;

  subMenusSelected: any = [];
  subCategoriasSelected: Array<optionsToSelectI> = [];
  subProductoSelected: Array<optionsToSelectI> = [];

  showMenus: boolean = false;
  showCategorias: boolean = false;
  showProductos: boolean = false;
  btnCanalEnvioDisabled: boolean = true;
  btnSincronizarMaxpointDisabled: boolean = false;

  listSelectableMenu: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
    page: 0,
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

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {
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

  paginate(event: any) {
    console.log(event);
    if (this.menusSelected.find((aux: any) => aux.page === event.page)) {
      this.listSelectableMenu = this.menusSelected.find(
        (aux: any) => aux.page === event.page
      );
    } else {
      this.loadingMenu = true;
      this.menuService
        .getMenuToSelectCheckbox({
          formularioFiltro: this.formularioFiltro,
          data: { page: event.page + 1, rowsMenu: event.rows },
        })
        .subscribe({
          next: (menus) => {
            if (menus.groupSync && menus.groupSync?.length > 0) {
              const aux = menus.groupSync.map((syncro: any) => {
                return {
                  syncrosId: syncro.syncrosId.slice(
                    0,
                    syncro.syncrosId.indexOf('-')
                  ),
                  startTime: syncro.startTime,
                  endTime: syncro.endTime,
                  children: syncro.menus.map((menuId: any) => {
                    const subAux = menus.groupMenu.filter(
                      (menu: any) => menu.checksum === menuId
                    );
                    subAux[0] = {
                      ...subAux[0],
                      syncrosId: syncro.syncrosId.slice(
                        0,
                        syncro.syncrosId.indexOf('-')
                      ),
                      endTime: syncro.endTime,
                    };
                    return subAux;
                  }),
                };
              });
              this.listSelectableMenu.children = aux;
              this.listSelectableMenu.page = event.page;
              this.menusSelected.push({ ...this.listSelectableMenu });
              this.loadingMenu = false;
            }
          },
          error: (err) => {
            this.loadingMenu = false;
            console.log(err);
          },
        });
    }
  }

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
    obj.children?.map((subobj) => {
      if (panel === 'categoria') {
        obj.allCompleteSubCategoria =
          obj.children != null && obj.children.every((obj) => obj.select);
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
        obj.allCompleteSubProducto =
          obj.children != null && obj.children.every((obj) => obj.select);
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
    console.log('updateAllCompleteMenu!!!');
    this.allCompleteMenu =
      this.listSelectableMenu.children != null &&
      this.listSelectableMenu.children.every((menu: any) => menu.select);
  }

  someCompleteMenu(): boolean {
    if (this.listSelectableMenu.children == null) {
      return false;
    }
    return (
      this.listSelectableMenu.children.filter((menu: any) => menu.select)
        .length > 0 && !this.allCompleteMenu
    );
  }

  setAllMenu(select: boolean): void {
    console.log('setAllMenu!!!');
    this.subMenusSelected = [];
    this.allCompleteMenu = select;
    this.listSelectableMenu.select = this.allCompleteMenu;
    if (this.listSelectableMenu.children == null) {
      return;
    }

    this.listSelectableMenu.children.forEach((menu: any) => {
      menu.select = select;
      menu.allCompleteSubMenu = select;
      menu.children?.forEach((subMenu: any) => (subMenu.select = menu.select));
    });

    this.listSelectableMenu.children.map((menu: any) => {
      menu.children?.map((submenu: any) => {
        if (submenu.select) this.subMenusSelected.push(submenu);
      });
    });
    console.log(this.subMenusSelected);
    const aux = this.subMenusSelected.map((submenu: any) => {
      return {
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            syncrosId: submenu[0].syncrosId,
            endTime: submenu[0].endTime,
            items: category.entities.map((entity: any) => {
              return submenu[0].items.filter(
                (item: any) => entity.id === item.id
              );
            }),
          };
        }),
      };
    });
    this.listSelectableCategories.children = aux;
    this.restartCategoriasProductos('menu');
  }

  updateAllCompleteSubMenus(menu: any): void {
    console.log('updateAllCompleteSubMenus!!!');
    menu.allCompleteSubMenu =
      menu.children != null && menu.children.every((menu: any) => menu.select);
    menu.children?.map((submenu: any) => {
      if (submenu.select) {
        if (
          this.subMenusSelected.filter(
            (submenuselected: any) => submenuselected === submenu
          ).length === 0
        ) {
          this.subMenusSelected.push(submenu);
        }
      } else {
        this.subMenusSelected = this.subMenusSelected.filter(
          (submenuselected: any) => submenuselected != submenu
        );
      }
    });
    console.log(this.subMenusSelected);
    const aux = this.subMenusSelected.map((submenu: any) => {
      console.log(submenu);
      return {
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            syncrosId: submenu[0].syncrosId,
            endTime: submenu[0].endTime,
            items: category.entities.map((entity: any) => {
              return submenu[0].items.filter(
                (item: any) => entity.id === item.id
              );
            }),
          };
        }),
      };
    });
    this.listSelectableCategories.children = aux;
    this.restartCategoriasProductos('menu');
  }

  someCompleteSubMenus(menu: any): boolean {
    if (menu.children == null) {
      return false;
    }
    return (
      menu.children.filter((menu: any) => menu.select).length > 0 &&
      !menu.allCompleteSubMenu
    );
  }

  setAllSubMenus(select: boolean, menu: any): void {
    console.log('setAllSubMenus!!!');
    menu.allCompleteSubMenu = select;
    if (menu.children == null) {
      return;
    }
    menu.children.forEach((submenu: any) => {
      submenu.select = select;
      if (select) {
        if (
          this.subMenusSelected.filter(
            (subMenusSelected: any) => subMenusSelected === submenu
          ).length === 0
        ) {
          this.subMenusSelected.push(submenu);
        }
      } else {
        this.subMenusSelected = this.subMenusSelected.filter(
          (subMenusSelected: any) => subMenusSelected !== submenu
        );
      }
    });
    console.log(this.subMenusSelected);
    const aux = this.subMenusSelected.map((submenu: any) => {
      return {
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            syncrosId: submenu[0].syncrosId,
            endTime: submenu[0].endTime,
            items: category.entities.map((entity: any) => {
              return submenu[0].items.filter(
                (item: any) => entity.id === item.id
              );
            }),
          };
        }),
      };
    });
    this.listSelectableCategories.children = aux;
    this.restartCategoriasProductos('menu');
  }

  updateAllCompleteCategorias(): void {
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

  setAllCategorias(select: boolean): void {
    this.subCategoriasSelected = [];
    this.allCompleteCategoria = select;
    if (this.listSelectableCategories.children == null) {
      return;
    }
    this.listSelectableCategories.children.forEach((categoria: any) => {
      categoria.select = select;
      categoria.allCompleteSubCategoria = select;
      categoria.children?.forEach(
        (subCategoria: any) => (subCategoria.select = categoria.select)
      );
    });
    this.listSelectableCategories.children.map((categoria: any) => {
      categoria.children?.map((subcategoria: any) => {
        if (subcategoria.select) this.subCategoriasSelected.push(subcategoria);
      });
    });
    const aux = this.subCategoriasSelected.map((subcategoria: any) => {
      return {
        id: subcategoria.id,
        title: subcategoria.title,
        children: subcategoria.items,
        syncrosId: subcategoria.syncrosId,
        endTime: subcategoria.endTime,
      };
    });
    this.listSelectableProducts.children = aux;
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteSubCategorias(categoria: optionsToSelectI): void {
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    const aux = this.subCategoriasSelected.map((subcategoria: any) => {
      return {
        id: subcategoria.id,
        title: subcategoria.title,
        children: subcategoria.items,
        syncrosId: subcategoria.syncrosId,
        endTime: subcategoria.endTime,
      };
    });
    this.listSelectableProducts.children = aux;
    this.restartCategoriasProductos('categoria');
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
    const aux = this.subCategoriasSelected.map((subcategoria: any) => {
      return {
        id: subcategoria.id,
        title: subcategoria.title,
        children: subcategoria.items,
        syncrosId: subcategoria.syncrosId,
        endTime: subcategoria.endTime,
      };
    });
    this.listSelectableProducts.children = aux;
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteProductos(): void {
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

  setAllProductos(select: boolean): void {
    this.subProductoSelected = [];
    this.allCompleteProducto = select;
    if (this.listSelectableProducts.children == null) {
      return;
    }
    this.listSelectableProducts.children.forEach((producto: any) => {
      producto.select = select;
      producto.allCompleteSubProducto = select;
      producto.children?.forEach(
        (subproducto: any) => (subproducto.select = producto.select)
      );
    });
    this.listSelectableProducts.children.map((producto: any) => {
      producto.children?.map((subproducto: any) => {
        if (subproducto.select) this.subProductoSelected.push(subproducto);
      });
    });
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  updateAllCompleteSubProductos(producto: optionsToSelectI): void {
    console.log('updateAllCompleteSubProductos');
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
      data: {
        page: this.page,
        rowsMenu: this.rowsMenu,
      },
      height: '370px',
      width: '460px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && result.menus && result.menus?.groupSync?.length > 0) {
        console.log(this.paginator);
        if (this.paginator) this.paginator.changePage(0);
        this.formularioFiltro = result.formularioFiltro;
        this.subMenusSelected = [];
        this.listSelectableCategories.children = [];
        this.menusSelected = [];
        this.restartCategoriasProductos('menu');
        this.showMenus = true;
        const aux = result.menus.groupSync.map((syncro: any) => {
          return {
            syncrosId: syncro.syncrosId.slice(0, syncro.syncrosId.indexOf('-')),
            startTime: syncro.startTime,
            endTime: new Date(syncro.endTime),
            children: syncro.menus.map((menuId: any) => {
              const subAux = result.menus.groupMenu.filter(
                (menu: any) => menu.checksum === menuId
              );
              subAux[0] = {
                ...subAux[0],
                syncrosId: syncro.syncrosId.slice(
                  0,
                  syncro.syncrosId.indexOf('-')
                ),
                endTime: syncro.endTime,
              };
              return subAux;
            }),
          };
        });
        this.total_recordsMenu = result.menus.pagination.totalRecords;
        this.listSelectableMenu.children = aux;
        this.menusSelected.push({ ...this.listSelectableMenu });
      } else if (result && result.menus === null) {
        this.listSelectableMenu.children = [];
        this.subMenusSelected = [];
        this.listSelectableCategories.children = [];
        this.restartCategoriasProductos('menu');
        this.showMenus = false;
      }
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
