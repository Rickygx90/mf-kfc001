import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { MenuService } from '../../../services/menu.service';
import { multiSelectI, optionsToSelectI } from '../../../models/interfaces';
import { CanalEnvioComponent } from '../canal-envio/canal-envio.component';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { validateResponse } from '../../../shared/utils';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-envio-menu',
  providers: [MessageService],
  templateUrl: './envio-menu.component.html',
  styleUrl: './envio-menu.component.css',
})
export class EnvioMenuComponent /* implements CanComponentDeactivate, OnInit */ {
  @ViewChild('paginator', { static: false }) paginator!: Paginator;
  public rowsMenu: number = 3;
  public page: number = 1;
  public total_recordsMenu: number = 0;
  public formularioFiltro: any = null;
  public menusSelected: any = [];
  menuService = inject(MenuService);
  buscarMenu: string = '';

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
  btnSincronizarMaxpointDisabled: boolean = true;
  txtBtnBlue: string = 'EXTRACCIÓN PERSONALIZADA';
  txtBtnGreen: string = 'EXTRACCIÓN DE MENÚS';

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

  aux2: any = [];

  idInterval: any;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService
  ) {
    this.checkActiveSync();
    /* this.idInterval = setInterval(() => {
      this.checkActiveSync()
    }, 5000); */
  }

  ngOnDestroy() {
    clearInterval(this.idInterval);
  }

  /* ngOnInit() {
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
  } */

  checkActiveSync() {
    this.menuService.checkActiveSync().subscribe({
      next: (result) => {
        console.log(result);
        if (result.status === 200 && result.valueSync === false) {
          this.btnSincronizarMaxpointDisabled = false;
          this.txtBtnGreen = 'EXTRACCIÓN DE MENÚS';
        } else {
          this.btnSincronizarMaxpointDisabled = true;
          this.txtBtnGreen = 'SINCRONIZANDO...';
        }
      },
      error: (err) => {},
    });
  }

  onChangeInput(buscarMenu2: any) {
    console.log(buscarMenu2);
    if (buscarMenu2.length >= 3) {
      this.menuService
        .getMenuToSelectCheckbox({
          formularioFiltro: this.formularioFiltro,
          data: { page: 1, rowsMenu: this.rowsMenu },
          palabra: buscarMenu2,
        })
        .subscribe({
          next: (menus) => {
            console.log(menus);
            if (menus && menus?.groupSync?.length > 0) {
              console.log(this.paginator);
              if (this.paginator) this.paginator.changePage(0);
              //this.formularioFiltro = result.formularioFiltro;
              this.subMenusSelected = [];
              this.listSelectableCategories.children = [];
              this.menusSelected = [];
              this.restartCategoriasProductos('menu');
              this.showMenus = true;
              const aux = menus.groupSync.map((syncro: any) => {
                return {
                  syncrosId: syncro.syncrosId.slice(
                    0,
                    syncro.syncrosId.indexOf('-')
                  ),
                  startTime: syncro.startTime,
                  endTime: new Date(syncro.endTime),
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
              this.total_recordsMenu = menus.pagination.totalRecords;
              this.listSelectableMenu.children = aux;
              this.menusSelected.push({ ...this.listSelectableMenu });
            }
          },
          error: (err) => {
            this.loadingMenu = false;
            console.log(err);
          },
        });
    }
    /*  this.Platform.ready().then(() => {
       this.rootRef.child("users").child(this.UserID).child('buscarMenu').set(this.buscarMenu)
    }) */
  }

  paginate(event: any) {
    console.log(event);
    console.log(this.buscarMenu);
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
          palabra: this.buscarMenu,
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

  /* canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
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
  } */

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
      this.subProductoSelected = [];
      this.btnCanalEnvioDisabled = true;
    } else if (panel === 'categoria') {
      this.showProductos =
        this.listSelectableProducts.children.length > 0 ? true : false;
    }
    /* this.subProductoSelected = [];
    this.btnCanalEnvioDisabled = true; */
  }

  updateAllCompleteSubOptions(
    obj: any,
    panel: string,
    sincroId: string = ''
  ): void {
    console.log(' ------------ subProductoSelected ------------');
    console.log(this.subProductoSelected);
    console.log(' ------------ subCategoriasSelected ------------');
    console.log(this.subCategoriasSelected);

    console.log(' ------------------ obj ------------------');
    console.log(obj);
    //con este map recorremos las categorias y los productos
    obj.children.forEach((subobj: any) => {
      //subobj.select = select;
      if (panel === 'categoria') {
        obj.allCompleteSubCategoria =
          obj.children != null && obj.children.every((obj: any) => obj.select);
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
        console.log(' ------------ subCategoriasSelected final ------------');
        console.log(this.subCategoriasSelected);
      } else if (panel === 'producto') {
        obj.allCompleteSubProducto =
          obj.children != null &&
          obj.children.every((subObj: any) => subObj.select);
        //se verifica que el producto este seleccionado
        if (subobj.select) {
          console.log(subobj);
          if (
            this.subProductoSelected.filter((subproductoselected) =>
              isEqual(subproductoselected, {
                ...subobj,
                sincroId: sincroId,
                catId: obj.id,
              })
            ).length === 0
          ) {
            this.subProductoSelected.push({
              ...subobj,
              sincroId: sincroId,
              catId: obj.id,
            });
          }
        }
        //si no esta seleccionado significa que se debe eliminar del array de subproductoselected
        else {
          const productToDelete = {
            ...subobj,
            sincroId: sincroId,
            catId: obj.id,
            select: !subobj.select,
          };
          console.log(productToDelete);
          this.subProductoSelected = this.subProductoSelected.filter(
            (subproductoselected) =>
              !isEqual(subproductoselected, productToDelete)
          );
        }
        console.log(' ------------ subProductoSelected final ------------');
        console.log(this.subProductoSelected);
      }
    });
  }

  setAllSubOptions(
    obj: optionsToSelectI,
    panel: string,
    select: boolean,
    sincroId: string = ''
  ): void {
    console.log(' ------------ subProductoSelected ------------');
    console.log(this.subProductoSelected);
    console.log(' ------------------ obj ------------------');
    console.log(obj);

    if (obj.children == null) {
      return;
    }
    obj.children.forEach((subobj: any) => {
      subobj.select = select;
      if (panel === 'categoria') {
        obj.allCompleteSubCategoria = select;
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
        obj.allCompleteSubProducto = select;
        console.log(subobj);
        if (select) {
          if (
            this.subProductoSelected.filter((subproductoselected) =>
              isEqual(subproductoselected, {
                ...subobj,
                sincroId: sincroId,
                catId: obj.id,
              })
            ).length === 0
          ) {
            this.subProductoSelected.push({
              ...subobj,
              sincroId: sincroId,
              catId: obj.id,
            });
          }
        } else {
          const productToDelete = {
            ...subobj,
            sincroId: sincroId,
            catId: obj.id,
            select: !subobj.select,
          };
          this.subProductoSelected = this.subProductoSelected.filter(
            (subproductoselected) =>
              !isEqual(subproductoselected, productToDelete)
          );
        }
        console.log(' ------------ subProductoSelected ------------');
        console.log(this.subProductoSelected);
      }
    });
  }

  updateAllCompleteMenu(): void {
    console.log('updateAllCompleteMenu!!!');
    this.allCompleteMenu =
      this.listSelectableMenu.children != null &&
      this.listSelectableMenu.children.every((menu: any) => menu.select);
    console.log(this.allCompleteMenu);
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
      let rc2 = `hsl(${Math.random() * 255}, 38%, 55%)`;
      return {
        color: rc2,
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            color: rc2,
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
      let rc2 = `hsl(${Math.random() * 255}, 38%, 55%)`;
      return {
        color: rc2,
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            color: rc2,
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
      let rc2 = `hsl(${Math.random() * 255}, 38%, 55%)`;
      return {
        color: rc2,
        id: submenu[0].checksum,
        title: submenu[0].menus[0].title,
        syncrosId: submenu[0].syncrosId,
        endTime: submenu[0].endTime,
        children: submenu[0].categories.map((category: any) => {
          return {
            ...category,
            color: rc2,
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
    console.log('setAllCategorias!!!')
    this.subCategoriasSelected = [];
    this.allCompleteCategoria = select;
    if (this.listSelectableCategories.children == null) {
      return;
    }
    this.listSelectableCategories.children.forEach((categoria: any) => {
      console.log(categoria)
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

    //si select es true se agrega a listSelectableProducts la categoria con el id de la sincro y sus productos
    if (select) {
      this.subCategoriasSelected.forEach((subcategoria: any) => {
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) => sincroProd.syncrosId === subcategoria.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subcategoria.id,
                title: subcategoria.title,
                children: subcategoria.items,
              },
            ],
            syncrosId: subcategoria.syncrosId,
            endTime: subcategoria.endTime,
            color: subcategoria.color
          });
        } else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subcategoria.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) => catProd.id === subcategoria.id
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subcategoria.id,
                  title: subcategoria.title,
                  children: subcategoria.items,
                });
              }
            }
          });
        }
      });
    } else {
      this.listSelectableProducts.children = [];
    }

    console.log(' ------ listSelectableProducts ------ ');
    console.log(this.listSelectableProducts);
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteSubCategorias(
    categoria: any,
    subcategoriaAux: any
  ): void {
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    console.log(subcategoriaAux);
    //verificar si se agrega o se elimina una categoria
    if (subcategoriaAux.select) {
      this.subCategoriasSelected.forEach((subcategoria: any) => {
        //if que verifica si existe la sincro en listSelectableProducts, sino existe la agrega junto a la categoria y los productos
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) => sincroProd.syncrosId === subcategoria.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subcategoria.id,
                title: subcategoria.title,
                children: subcategoria.items,
              },
            ],
            syncrosId: subcategoria.syncrosId,
            endTime: subcategoria.endTime,
            color: categoria.color
          });
        }
        // si la sincro existe agrego la categoria y los productos en dicha sincro
        else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subcategoria.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) => catProd.id === subcategoria.id
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subcategoria.id,
                  title: subcategoria.title,
                  children: subcategoria.items,
                });
              }
            }
          });
        }
      });
    } else {
      this.listSelectableProducts.children.forEach((sincroProd: any) => {
        if (sincroProd.syncrosId === subcategoriaAux.syncrosId) {
          sincroProd.children = sincroProd.children.filter(
            (catProd: any) => catProd.id !== subcategoriaAux.id
          );
        }
      });
    }

    console.log(' ------ listSelectableProducts ------ ');
    console.log(this.listSelectableProducts);
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
    /* const aux = this.subCategoriasSelected.map((subcategoria: any) => {
      return {
        id: subcategoria.id,
        title: subcategoria.title,
        children: subcategoria.items,
        syncrosId: subcategoria.syncrosId,
        endTime: subcategoria.endTime,
      };
    });
    this.listSelectableProducts.children = aux; */
    if (select) {
      this.subCategoriasSelected.forEach((subcategoria: any) => {
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) => sincroProd.syncrosId === subcategoria.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subcategoria.id,
                title: subcategoria.title,
                children: subcategoria.items,
              },
            ],
            syncrosId: subcategoria.syncrosId,
            endTime: subcategoria.endTime,
            color: categoria.color
          });
        } else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subcategoria.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) => catProd.id === subcategoria.id
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subcategoria.id,
                  title: subcategoria.title,
                  children: subcategoria.items,
                });
              }
            }
          });
        }
      });
    } else {
      this.listSelectableProducts.children =
        this.listSelectableProducts.children.filter(
          (sincroProd: any) => sincroProd.syncrosId !== categoria.syncrosId
        );

      /* if (sincroProd.syncrosId === categoria.syncrosId) {
          sincroProd.children = sincroProd.children.filter(
            (catProd: any) => catProd.id !== subcategoriaAux.id
          );
        } */
    }

    console.log(' ------ listSelectableProducts ------ ');
    console.log(this.listSelectableProducts);
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteProductos(): void {
    console.log('updateAllCompleteProductos!!!');
    console.log(this.listSelectableProducts.children);
    this.allCompleteProducto =
      this.listSelectableProducts.children != null &&
      this.listSelectableProducts.children.every((sincroProd: any) =>
        sincroProd.children.every((catProd: any) => catProd.select)
      );
    console.log(this.allCompleteProducto);
  }

  someCompleteProductos(): boolean {
    const aux: any = [];
    if (this.listSelectableProducts.children == null) {
      return false;
    }

    this.listSelectableProducts.children.forEach((sincroProd: any) => {
      sincroProd.children.forEach((catProd: any) => {
        if (catProd.select) {
          aux.push(catProd);
        }
      });
    });
    //console.log(aux);
    return aux.length > 0 && !this.allCompleteProducto;
  }

  setAllProductos(select: boolean): void {
    console.log('setAllProductos!!!');
    this.subProductoSelected = [];
    this.allCompleteProducto = select;
    if (this.listSelectableProducts.children == null) {
      return;
    }

    //Selecciono todas las categorias y sus productos
    this.listSelectableProducts.children.forEach((sincroProd: any) => {
      /* producto.select = select;
      producto.allCompleteSubProducto = select;
      producto.children?.forEach(
        (subproducto: any) => (subproducto.select = producto.select)
      ); */

      sincroProd.children?.forEach((catProd: any) => {
        catProd.select = select;
        catProd.allCompleteSubProducto = select;
        catProd.children?.forEach(
          (subproducto: any) => (subproducto.select = catProd.select)
        );
      });
    });

    /* this.listSelectableProducts.children.map((producto: any) => {
      producto.children?.map((subproducto: any) => {
        if (subproducto.select) this.subProductoSelected.push(subproducto);
      });
    }); */
    //Agrego los producots seleccionados a subProductoSelected
    this.listSelectableProducts.children.map((sincroProd: any) => {
      console.log('sincroProd: ');
      console.log(sincroProd);
      sincroProd.children?.map((catProd: any) => {
        console.log('catProd: ');
        console.log(catProd);
        catProd.children?.map((producto: any) => {
          console.log('producto: ');
          console.log(producto);
          if (producto.select)
            this.subProductoSelected.push({
              ...producto,
              sincroId: sincroProd.syncrosId,
              catId: catProd.id,
            });
        });
      });
    });
    console.log('Productos seleccionados:');
    console.log(this.subProductoSelected);
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  updateAllCompleteSubProductos(
    categoria: optionsToSelectI,
    sincroId: string
  ): void {
    console.log('updateAllCompleteSubProductos');
    this.updateAllCompleteSubOptions(categoria, 'producto', sincroId);
    this.btnCanalEnvioDisabled =
      this.subProductoSelected.length > 0 ? false : true;
  }

  someCompleteSubProductos(producto: optionsToSelectI): boolean {
    if (producto.children == null) {
      return false;
    }
    return (
      producto.children.filter((subProducto: any) => subProducto.select)
        .length > 0 && !producto.allCompleteSubProducto
    );
  }

  setAllSubProductos(
    select: boolean,
    producto: any,
    sincroId: string = ''
  ): void {
    console.log('setAllSubProductos');
    this.setAllSubOptions(producto, 'producto', select, sincroId);
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
