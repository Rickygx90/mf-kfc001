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
  //Objetos q sirven para visualizar el check por panel (menu, categoria, producto)
  allCompleteMenu: boolean = false;
  allCompleteCategoria: boolean = false;
  allCompleteProducto: boolean = false;

  subMenusSelected: any = [];
  subCategoriasSelected: Array<optionsToSelectI> = [];
  subProductoSelected: Array<optionsToSelectI> = [];

  showMenus: boolean = false;
  showCategorias: boolean = false;
  showProductos: boolean = false;
  btnCanalEnvioDisabled: boolean = false;
  btnSincronizarMaxpointDisabled: boolean = true;
  txtBtnBlue: string = 'EXTRACCIÓN PERSONALIZADA';
  txtBtnGreen: string = 'EXTRACCIÓN DE MENÚS';

  //Objeto q contiene la lista de menus agrupados por sincronizaciones disponibles a elegir
  listSelectableMenu: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
    page: 0,
  };
  //Objeto q contiene la lista de categorias agrupados por sincronizaciones disponibles a elegir
  listSelectableCategories: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };
  //Objeto q contiene la lista de productos agrupados por categorias agrupadas por sincronizaciones disponibles a elegir
  listSelectableProducts: any = {
    name: 'Seleccionar todos',
    select: false,
    children: [],
  };

  //Id del intervalo para hacer el request de 'EXTRACCIÓN DE MENÚS' cada 5 segundos
  idInterval: any;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService
  ) {
    this.checkActiveSync();
    this.idInterval = setInterval(() => {
      this.checkActiveSync();
    }, 5000);
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

  //Funcion que hace un request de menus por el input
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
                let rc2 = `hsl(${Math.random() * 255}, 38%, 55%, .5)`;
                return {
                  /* syncrosId: syncro.syncrosId.slice(
                    0,
                    syncro.syncrosId.indexOf('-')
                  ), */
                  syncrosId: syncro.syncrosId,
                  startTime: syncro.startTime,
                  endTime: new Date(syncro.endTime),
                  children: syncro.menus.map((menuId: any) => {
                    const subAux = menus.groupMenu.filter(
                      (menu: any) => menu.checksum === menuId
                    );
                    subAux[0] = {
                      ...subAux[0],
                      /* syncrosId: syncro.syncrosId.slice(
                        0,
                        syncro.syncrosId.indexOf('-')
                      ), */
                      syncrosId: syncro.syncrosId,
                      endTime: syncro.endTime,
                      color: rc2,
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

  //Funcion que controla la paginacion del panel de menus
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
                let rc2 = `hsl(${Math.random() * 255}, 38%, 55%, .5)`;
                return {
                  /* syncrosId: syncro.syncrosId.slice(
                    0,
                    syncro.syncrosId.indexOf('-')
                  ), */
                  syncrosId: syncro.syncrosId,
                  startTime: syncro.startTime,
                  endTime: syncro.endTime,
                  children: syncro.menus.map((menuId: any) => {
                    const subAux = menus.groupMenu.filter(
                      (menu: any) => menu.checksum === menuId
                    );
                    subAux[0] = {
                      ...subAux[0],
                      /* syncrosId: syncro.syncrosId.slice(
                        0,
                        syncro.syncrosId.indexOf('-')
                      ), */
                      syncrosId: syncro.syncrosId,
                      endTime: syncro.endTime,
                      color: rc2,
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

  //Funcion que borra las categorias y productos seleccionados ademas de la lista de menus, categorias y productos disponibles a elegir.
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
  }

  //Funcion que se ejecuta cuando se selecciona un elemento de una sub seccion.
  updateAllCompleteSubOptions(
    obj: any,
    panel: string,
    sincroId: string = '' //se necesita sincroId para poder identificar el id de la sincronizacion de cada producto
  ): void {
    //Con este forEach recorremos las categorias y los productos.
    obj.children.forEach((subobj: any) => {
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
      } else if (panel === 'producto') {
        obj.allCompleteSubProducto =
          obj.children != null &&
          obj.children.every((subObj: any) => subObj.select);
        //se verifica que el producto este seleccionado
        if (subobj.select) {
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
          this.subProductoSelected = this.subProductoSelected.filter(
            (subproductoselected) =>
              !isEqual(subproductoselected, productToDelete)
          );
        }
      }
    });
  }

  //Funcion que se ejecuta cuando se selecciona todos los elementos de una sub seccion.
  setAllSubOptions(
    obj: optionsToSelectI,
    panel: string,
    select: boolean,
    sincroId: string = '' //se necesita sincroId para poder identificar el id de la sincronizacion de cada producto
  ): void {
    if (obj.children == null) {
      return;
    }
    //Con este forEach recorremos las categorias y los productos.
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
      }
    });
  }

  updateAllCompleteMenu(): void {
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

  //Funcion que selecciona todos los menus de la lista de menus disponibles(sin usar) - Refactorizar
  setAllMenu(select: boolean): void {
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
      menu.children?.map((subMenu: any) => {
        if (subMenu.select) this.subMenusSelected.push(subMenu);
      });
    });
    //Se agregan a la lista de categorias seleccionables todas las categorias relacionadas a los menus previamente seleccionados.
    this.listSelectableCategories.children = this.subMenusSelected.map(
      (subMenu: any) => {
        return {
          color: subMenu[0].color,
          checksum: subMenu[0].checksum,
          title: subMenu[0].menus[0].title,
          syncrosId: subMenu[0].syncrosId,
          endTime: subMenu[0].endTime,
          children: subMenu[0].categories.map((category: any) => {
            return {
              ...category,
              color: subMenu[0].color,
              checksum: subMenu[0].checksum,
              titleMenu: subMenu[0].menus[0].title,
              syncrosId: subMenu[0].syncrosId,
              endTime: subMenu[0].endTime,
              items: category.entities.map((entity: any) => {
                return subMenu[0].items.filter(
                  (item: any) => entity.id === item.id
                );
              }),
            };
          }),
        };
      }
    );
    this.restartCategoriasProductos('menu');
  }

  //Funcion que selecciona un menu de la lista de menus disponibles y lo agrega a subMenusSelected.
  updateAllCompleteSubMenus(menu: any): void {
    menu.allCompleteSubMenu =
      menu.children != null && menu.children.every((menu: any) => menu.select);
    menu.children?.map((subMenu: any) => {
      if (subMenu.select) {
        if (
          this.subMenusSelected.filter(
            (submenuselected: any) => submenuselected === subMenu
          ).length === 0
        ) {
          this.subMenusSelected.push(subMenu);
        }
      } else {
        this.subMenusSelected = this.subMenusSelected.filter(
          (submenuselected: any) => submenuselected != subMenu
        );
      }
    });
    //Agregamos la lista de categorias disponibles a seleccionar en base a los menus seleccionados.
    this.listSelectableCategories.children = this.subMenusSelected.map(
      (subMenu: any) => {
        return {
          color: subMenu[0].color,
          checksum: subMenu[0].checksum,
          title: subMenu[0].menus[0].title,
          syncrosId: subMenu[0].syncrosId,
          endTime: subMenu[0].endTime,
          children: subMenu[0].categories.map((category: any) => {
            return {
              ...category,
              color: subMenu[0].color,
              checksum: subMenu[0].checksum,
              titleMenu: subMenu[0].menus[0].title,
              syncrosId: subMenu[0].syncrosId,
              endTime: subMenu[0].endTime,
              items: category.entities.map((entity: any) => {
                return subMenu[0].items.filter(
                  (item: any) => entity.id === item.id
                );
              }),
            };
          }),
        };
      }
    );
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

  //Funcion que selecciona un grupo de menus agrupados por sincronizacion de la lista de menus disponibles y lo agrega a subMenusSelected.
  setAllSubMenus(select: boolean, menu: any): void {
    menu.allCompleteSubMenu = select;
    if (menu.children == null) {
      return;
    }
    menu.children.forEach((subMenu: any) => {
      subMenu.select = select;
      if (select) {
        if (
          this.subMenusSelected.filter(
            (subMenusSelected: any) => subMenusSelected === subMenu
          ).length === 0
        ) {
          this.subMenusSelected.push(subMenu);
        }
      } else {
        this.subMenusSelected = this.subMenusSelected.filter(
          (subMenusSelected: any) => subMenusSelected !== subMenu
        );
      }
    });
    //Agregamos la lista de categorias disponibles a seleccionar en base a los menus seleccionados.
    this.listSelectableCategories.children = this.subMenusSelected.map(
      (subMenu: any) => {
        return {
          color: subMenu[0].color,
          checksum: subMenu[0].checksum,
          title: subMenu[0].menus[0].title,
          syncrosId: subMenu[0].syncrosId,
          endTime: subMenu[0].endTime,
          children: subMenu[0].categories.map((category: any) => {
            return {
              ...category,
              color: subMenu[0].color,
              checksum: subMenu[0].checksum,
              titleMenu: subMenu[0].menus[0].title,
              syncrosId: subMenu[0].syncrosId,
              endTime: subMenu[0].endTime,
              items: category.entities.map((entity: any) => {
                return subMenu[0].items.filter(
                  (item: any) => entity.id === item.id
                );
              }),
            };
          }),
        };
      }
    );
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

  //Funcion que selecciona todas las categorias de la lista de categorias disponibles.
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
      categoria.children?.map((subCategoria: any) => {
        if (subCategoria.select) this.subCategoriasSelected.push(subCategoria);
      });
    });
    //si select es true se agrega a listSelectableProducts la categoria con el id de la sincro y sus productos
    if (select) {
      this.subCategoriasSelected.forEach((subCategoriaSelected: any) => {
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === subCategoriaSelected.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subCategoriaSelected.id,
                title: subCategoriaSelected.title,
                children: subCategoriaSelected.items,
                checksum: subCategoriaSelected.checksum,
                titleMenu: subCategoriaSelected.titleMenu,
                color: subCategoriaSelected.color,
              },
            ],
            syncrosId: subCategoriaSelected.syncrosId,
            endTime: subCategoriaSelected.endTime,
          });
        } else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subCategoriaSelected.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === subCategoriaSelected.id &&
                    catProd.checksum === subCategoriaSelected.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subCategoriaSelected.id,
                  title: subCategoriaSelected.title,
                  children: subCategoriaSelected.items,
                  checksum: subCategoriaSelected.checksum,
                  titleMenu: subCategoriaSelected.titleMenu,
                  color: subCategoriaSelected.color,
                });
              } else {
                console.log('ELSE!!!!');
                console.log(
                  sincroProd.children.filter(
                    (catProd: any) => catProd.id === subCategoriaSelected.id
                  )
                );
              }
            }
          });
        }
      });
    } else {
      this.listSelectableProducts.children = [];
    }
    console.log(' ----------------- setAllCategorias ----------------- ');
    console.log(' listSelectableProducts: ');
    console.log(this.listSelectableProducts);

    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteSubCategorias(categoria: any, subcategoriaAux: any): void {
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    console.log(subcategoriaAux);
    //verificar si se agrega o se elimina una categoria
    if (subcategoriaAux.select) {
      this.subCategoriasSelected.forEach((subCategoriaSelected: any) => {
        //if que verifica si existe la sincro en listSelectableProducts, sino existe la agrega junto a la categoria y los productos
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === subCategoriaSelected.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subCategoriaSelected.id,
                title: subCategoriaSelected.title,
                children: subCategoriaSelected.items,
                checksum: subCategoriaSelected.checksum,
                titleMenu: subCategoriaSelected.titleMenu,
                color: subCategoriaSelected.color,
              },
            ],
            syncrosId: subCategoriaSelected.syncrosId,
            endTime: subCategoriaSelected.endTime,
          });
        }
        // si la sincro existe agrego la categoria y los productos en dicha sincro
        else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subCategoriaSelected.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === subCategoriaSelected.id &&
                    catProd.checksum === subCategoriaSelected.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subCategoriaSelected.id,
                  title: subCategoriaSelected.title,
                  children: subCategoriaSelected.items,
                  checksum: subCategoriaSelected.checksum,
                  titleMenu: subCategoriaSelected.titleMenu,
                  color: subCategoriaSelected.color,
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
    console.log('setAllSubCategorias!!!!!!!!!!!!!');
    console.log(categoria);
    this.setAllSubOptions(categoria, 'categoria', select);
    if (select) {
      this.subCategoriasSelected.forEach((subCategoriaSelected: any) => {
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === subCategoriaSelected.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subCategoriaSelected.id,
                title: subCategoriaSelected.title,
                children: subCategoriaSelected.items,
                checksum: categoria.checksum,
                titleMenu: subCategoriaSelected.titleMenu,
                color: categoria.color,
              },
            ],
            syncrosId: subCategoriaSelected.syncrosId,
            endTime: subCategoriaSelected.endTime,
          });
        } else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subCategoriaSelected.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === subCategoriaSelected.id &&
                    catProd.checksum === subCategoriaSelected.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subCategoriaSelected.id,
                  title: subCategoriaSelected.title,
                  children: subCategoriaSelected.items,
                  checksum: categoria.checksum,
                  titleMenu: subCategoriaSelected.titleMenu,
                  color: categoria.color,
                });
              }
            }
          });
        }
      });
    } else {
      const arrayAux = [];

      this.listSelectableProducts.children.forEach((sincroProd: any) => {
        if (sincroProd.syncrosId === categoria.syncrosId) {
          sincroProd.children.forEach((producto: any) => {
            if (producto.checksum === categoria.checksum) {
              arrayAux.push(producto);
            }
          });
        }
      });

      if (arrayAux.length === 0) {
        this.listSelectableProducts.children =
          this.listSelectableProducts.children.filter(
            (sincroProd: any) => sincroProd.syncrosId !== categoria.syncrosId
          );
      } else {
        this.listSelectableProducts.children.forEach((sincroProd: any) => {
          if (sincroProd.syncrosId === categoria.syncrosId) {
            sincroProd.children = sincroProd.children.filter((producto: any) => producto.checksum !==  categoria.checksum)
          }
        });
      }


    }
    console.log(' --------------- listSelectableProducts --------------- ');
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
            /* syncrosId: syncro.syncrosId.slice(0, syncro.syncrosId.indexOf('-')), */
            syncrosId: syncro.syncrosId,
            startTime: syncro.startTime,
            endTime: new Date(syncro.endTime),
            children: syncro.menus.map((menuId: any) => {
              const subAux = result.menus.groupMenu.filter(
                (menu: any) => menu.checksum === menuId
              );
              let rc2 = `hsl(${Math.random() * 255}, 38%, 55%, .5)`;
              subAux[0] = {
                ...subAux[0],
                /* syncrosId: syncro.syncrosId.slice(
                  0,
                  syncro.syncrosId.indexOf('-')
                ), */
                syncrosId: syncro.syncrosId,
                endTime: syncro.endTime,
                color: rc2,
              };
              console.log(subAux);
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
      data: {
        productosSeleccionados: this.subProductoSelected,
        menusSeleccionados: this.subMenusSelected,
        listSelectableMenu: this.listSelectableMenu,
      },
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
