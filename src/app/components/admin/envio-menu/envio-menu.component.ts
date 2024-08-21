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
  //Objeto rowsMenu guarda el numero de sincronozaciones por paginacion.
  public rowsMenu: number = 5;
  public page: number = 1;
  public total_recordsMenu: number = 0;
  public formularioFiltro: any = null;

  menuService = inject(MenuService);
  buscarMenu: string = '';

  loadingMenu: boolean = false;
  //Objetos q sirven para visualizar el check por panel (menu, categoria, producto)
  allCompleteMenu: boolean = false;
  allCompleteCategoria: boolean = false;
  allCompleteProducto: boolean = false;

  //Objeto que va a guardar los menus de cada pagina con su seleccion actual.
  paginasGuardadas: any = [];

  //Objeto que va a guardar los menus seleccionados
  menusSeleccionados: any = [];
  //Objeto que va a guardar las categorias seleccionadas
  categoriasSeleccionadas: Array<optionsToSelectI> = [];
  //Objeto que va a guardar los productos seleccionados
  productosSeleccionados: Array<optionsToSelectI> = [];

  //Booleanos que vam a mostrar/ocultar los paneles.
  showMenus: boolean = false;
  showCategorias: boolean = false;
  showProductos: boolean = false;
  //Booleanos que vam a mostrar/ocultar los botones.
  btnCanalEnvioDisabled: boolean = true;
  btnSincronizarMaxpointDisabled: boolean = true;
  txtBtnBlue: string = 'EXTRACCIÓN PERSONALIZADA';
  txtBtnGreen: string = 'SINCRONIZACIÓN EN CURSO';

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
    console.log(this.idInterval);
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
          this.txtBtnGreen = 'SINCRONIZACIÓN EN CURSO';
        }
      },
      error: (err) => {},
    });
  }

  //(PENDIENTE LIMPIAR)Funcion que borra las categorias y productos seleccionados ademas de la lista de menus, categorias y productos disponibles a elegir.
  restartCategoriasProductos(panel: string): void {
    if (panel === 'menu') {
      this.showCategorias =
        this.listSelectableCategories.children.length > 0 ? true : false;
      this.categoriasSeleccionadas = [];
      this.listSelectableProducts.children = [];
      this.showProductos =
        this.listSelectableCategories.children.length > 0 &&
        this.listSelectableProducts.children.length > 0
          ? true
          : false;
      this.productosSeleccionados = [];
      this.btnCanalEnvioDisabled = true;
    } else if (panel === 'categoria') {
      this.showProductos =
        this.listSelectableProducts.children.length > 0 ? true : false;
      this.btnCanalEnvioDisabled =
        this.productosSeleccionados.length > 0 ? false : true;
    }
  }

  //Funcion que hace un request de menus por el input
  onChangeInput(palabraABuscar: any) {
    console.log(palabraABuscar);
    //Solo si palabraABuscar tiene 3 letras o mas, consulto al api.
    if (palabraABuscar.length >= 3) {
      this.menuService
        .getMenuToSelectCheckbox({
          formularioFiltro: this.formularioFiltro,
          data: { page: 1, rowsMenu: this.rowsMenu },
          palabra: palabraABuscar,
        })
        .subscribe({
          next: (menus) => {
            console.log(menus);
            if (menus && menus?.groupSync?.length > 0) {
              //si existe una paginacion activa, regreso a la pagina 0
              if (this.paginator) this.paginator.changePage(0);
              //Reinicio todos los objetos que contienen informacion sobre los menus existentes
              this.menusSeleccionados = [];
              this.listSelectableCategories.children = [];
              this.paginasGuardadas = [];
              this.restartCategoriasProductos('menu');
              //Muestro los menus y oculto el mensaje "No Hay Data"
              this.showMenus = true;
              //Obtenemos el total de menus filtrados
              this.total_recordsMenu = menus.pagination.totalRecords;
              //Con este map recorro todas las sincronizaciones que se encuentran en la prop groupSync y voy agrupando los menus pertenecientes a cada una de ellas.
              this.listSelectableMenu.children = menus.groupSync.map(
                (syncro: any) => {
                  return {
                    syncrosId: syncro.syncrosId,
                    startTime: syncro.startTime,
                    endTime: new Date(syncro.endTime),
                    //En la prop children guardo todos los menus que pertenecen a una sincronizacion.
                    children: syncro.menus.map((menuSync: any) => {
                      //Busco los menus en la prop groupMenu y los filtro por los id que se encuentran en el objeto menuSync.menu
                      const menuFiltrado = menus.groupMenu.filter(
                        (menu: any) => menu.checksum === menuSync.menu
                      );
                      //Al menu obtenido le agrego el id, endTime de la sincronozacion a la que pertenece, adicional se agrega la tienda, su agregador y el color.
                      menuFiltrado[0] = {
                        ...menuFiltrado[0],
                        aggregator: menuSync.aggregator,
                        store: menuSync.store,
                        syncrosId: syncro.syncrosId,
                        endTime: syncro.endTime,
                        color: `hsl(${Math.random() * 255}, 38%, 55%, .5)`,
                      };
                      return menuFiltrado;
                    }),
                  };
                }
              );
              this.paginasGuardadas.push({ ...this.listSelectableMenu });
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
  cambiarPagina(event: any) {
    console.log(event);
    console.log(this.buscarMenu);
    console.log(this.paginasGuardadas);
    //Busco dentro de paginasGuardadas si ya tengo la pagina guardada, sino consulto al api.
    if (
      this.paginasGuardadas.find((pagina: any) => pagina.page === event.page)
    ) {
      this.listSelectableMenu = this.paginasGuardadas.find(
        (aux: any) => aux.page === event.page
      );
    } else {
      //Muestro la animacion "loading" mientras se cargan los menus por paginacion.
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
              //Con este map recorro todas las sincronizaciones que se encuentran en la prop groupSync y voy agrupando los menus pertenecientes a cada una de ellas.
              this.listSelectableMenu.children = menus.groupSync.map(
                (syncro: any) => {
                  return {
                    syncrosId: syncro.syncrosId,
                    startTime: syncro.startTime,
                    endTime: syncro.endTime,
                    //En la prop children guardo todos los menus que pertenecen a una sincronizacion.
                    children: syncro.menus.map((menuSync: any) => {
                      //Busco los menus en la prop groupMenu y los filtro por los id que se encuentran en el objeto menuSync.menu
                      const menuFiltrado = menus.groupMenu.filter(
                        (menu: any) => menu.checksum === menuSync.menu
                      );
                      //Al menu obtenido le agrego el id, endTime de la sincronozacion a la que pertenece, adicional se agrega la tienda, su agregador y el color.
                      menuFiltrado[0] = {
                        ...menuFiltrado[0],
                        aggregator: menuSync.aggregator,
                        store: menuSync.store,
                        syncrosId: syncro.syncrosId,
                        endTime: syncro.endTime,
                        color: `hsl(${Math.random() * 255}, 38%, 55%, .5)`,
                      };
                      return menuFiltrado;
                    }),
                  };
                }
              );
              this.listSelectableMenu.page = event.page;
              this.paginasGuardadas.push({ ...this.listSelectableMenu });
              //Oculto la animacion "loading" despues de consultar los menus por paginacion.
              this.loadingMenu = false;
            }
          },
          error: (err) => {
            //Oculto la animacion "loading" despues de consultar los menus por paginacion.
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

  /*
  Funcion que obtiene los menus, las categorias y los productos seleccionados a partir de la lista "listSelectable"
  Parametros:
  - obj(object): Contiene los menus, categorias o productos a seleccionar agrupados
  */
  updateAllCompleteSubOptions(
    obj: any,
    panel: string,
    sincroId: string = '' //se necesita sincroId para poder identificar el id de la sincronizacion de cada producto
  ): void {
    console.log(' ------- updateAllCompleteSubOptions!!! ------- ');
    //Con este forEach recorremos los menus, categorias y los productos.
    obj.children.forEach((subobj: any) => {
      if (panel === 'menu') {
        obj.allCompleteSubMenu =
          obj.children != null &&
          obj.children.every((menu: any) => menu.select);
        if (subobj.select) {
          if (
            this.menusSeleccionados.filter(
              (submenuselected: any) => submenuselected === subobj
            ).length === 0
          ) {
            this.menusSeleccionados.push(subobj);
          }
        } else {
          this.menusSeleccionados = this.menusSeleccionados.filter(
            (submenuselected: any) => submenuselected != subobj
          );

          //Cuando se quite la seleccion de un menu se tiene que eliminar el check de sus respectivas categorias.
          this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
            (categoria: any) => {
              if (subobj[0].syncrosId === categoria.syncrosId) {
                if (subobj[0].checksum !== categoria.checksum) {
                  return categoria;
                } else {
                  //Hay que eliminar la lista de productos y los productos seleccionados relacionados a ese menu
                  this.productosSeleccionados =
                    this.productosSeleccionados.filter((producto: any) => {
                      if (subobj[0].syncrosId === producto.sincroId) {
                        if (subobj[0].checksum !== producto.checksum) {
                          return producto;
                        }
                      } else {
                        return producto;
                      }
                    });

                  this.listSelectableProducts.children.forEach(
                    (producto: any) => {
                      if (subobj[0].syncrosId === producto.syncrosId) {
                        producto.children = producto.children.filter(
                          (subProducto: any) => {
                            if (subobj[0].checksum !== subProducto.checksum) {
                              return producto;
                            }
                          }
                        );
                      }
                    }
                  );
                }
              } else {
                return categoria;
              }
            }
          );
        }
      } else if (panel === 'categoria') {
        obj.allCompleteSubCategoria =
          obj.children != null &&
          obj.children.every((categoria: any) => categoria.select);
        //Se verifica si la categoria esta seleccionada, sino se elimina de 'categoriasSeleccionadas'
        if (subobj.select) {
          if (
            this.categoriasSeleccionadas.filter((subcategoriaselected) =>
              isEqual(subcategoriaselected, subobj)
            ).length === 0
          ) {
            console.log(
              ' ++++ Se agrega la categoria (subobj) a categoriasSeleccionadas: '
            );
            console.log(subobj);
            this.categoriasSeleccionadas.push(subobj);
          }
        } else {
          //Creamos el objeto 'categoriaToDelete' para poder identificar la categoria a eliminar de 'categoriasSeleccionadas'
          const categoriaToDelete = {
            checksum: subobj.checksum,
            id: subobj.id,
            syncrosId: subobj.syncrosId,
          };
          this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
            (subcategoriaselected: any) => {
              if (
                isEqual(
                  {
                    checksum: subcategoriaselected.checksum,
                    id: subcategoriaselected.id,
                    syncrosId: subcategoriaselected.syncrosId,
                  },
                  categoriaToDelete
                )
              ) {
                console.log(
                  ' --- Se elimina la categoria de categoriasSeleccionadas: '
                );
                console.log(subcategoriaselected);
                return;
              }
              return subcategoriaselected;
            }
          );

          //Adicional se debe eliminar la lista de productos y los productos seleccionados relacionados a esa categoria
          this.productosSeleccionados = this.productosSeleccionados.filter(
            (producto: any) => {
              if (
                subobj.syncrosId === producto.sincroId &&
                subobj.checksum === producto.checksum
              ) {
                if (subobj.id !== producto.catId) {
                  return producto;
                }
                console.log('Se debe eliminar este producto: ');
                console.log(producto);
              } else {
                return producto;
              }
            }
          );
        }
      } else if (panel === 'producto') {
        obj.allCompleteSubProducto =
          obj.children != null &&
          obj.children.every((subObj: any) => subObj.select);
        //Se verifica si el producto esta seleccionado, sino se elimina de 'productosSeleccionados'
        if (subobj.select) {
          if (
            this.productosSeleccionados.filter((subproductoselected) =>
              isEqual(subproductoselected, {
                ...subobj,
                sincroId: sincroId,
                catId: obj.id,
                checksum: obj.checksum,
              })
            ).length === 0
          ) {
            console.log('subobj: ');
            console.log(subobj);

            this.productosSeleccionados.push({
              ...subobj,
              sincroId: sincroId,
              catId: obj.id,
              checksum: obj.checksum,
            });
            console.log('================================================');
            this.listSelectableProducts.children.forEach((sincroProd: any) => {
              sincroProd.children.forEach((catProd: any) => {
                catProd.children.forEach((prod: any) => {
                  console.log(prod);
                  if (
                    subobj.id === prod.id &&
                    sincroProd.syncrosId !== sincroId
                  ) {
                    console.log(
                      'sincroProd.syncrosId: ' + sincroProd.syncrosId
                    );
                    prod.disabled = true;
                  }
                });
              });
            });
            console.log('================================================');
          }
        }
        //Creamos el objeto 'productToDelete' para poder identificar la producto a eliminar de productosSeleccionados
        else {
          const productToDelete = {
            ...subobj,
            sincroId: sincroId,
            catId: obj.id,
            checksum: obj.checksum,
            select: !subobj.select,
          };
          this.productosSeleccionados = this.productosSeleccionados.filter(
            (subproductoselected) =>
              !isEqual(subproductoselected, productToDelete)
          );
          console.log('================================================');
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            sincroProd.children.forEach((catProd: any) => {
              catProd.children.forEach((prod: any) => {
                console.log(prod);
                if (subobj.id === prod.id) {
                  prod.disabled = false;
                }
              });
            });
          });
          console.log('================================================');
        }
      }
    });
  }

  //Funcion que se ejecuta cuando se selecciona todos los elementos de una sub seccion.
  setAllSubOptions(
    obj: any,
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
      if (panel === 'menu') {
        obj.allCompleteSubMenu = select;
        if (obj.children == null) {
          return;
        }
        //subobj.select = select;
        if (select) {
          if (
            this.menusSeleccionados.filter(
              (menusSeleccionados: any) => menusSeleccionados === subobj
            ).length === 0
          ) {
            this.menusSeleccionados.push(subobj);
          }
        } else {
          this.menusSeleccionados = this.menusSeleccionados.filter(
            (menusSeleccionados: any) => menusSeleccionados !== subobj
          );

          //Cuando se quite la seleccion de un menu se tiene que eliminar el check de sus respectivas categorias.
          this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
            (categoria: any) => {
              if (subobj[0].syncrosId === categoria.syncrosId) {
                if (subobj[0].checksum !== categoria.checksum) {
                  return categoria;
                } else {
                  //Hay que eliminar la lista de productos y los productos seleccionados relacionados a ese menu
                  this.productosSeleccionados =
                    this.productosSeleccionados.filter((producto: any) => {
                      if (subobj[0].syncrosId === producto.sincroId) {
                        if (subobj[0].checksum !== producto.checksum) {
                          return producto;
                        }
                      } else {
                        return producto;
                      }
                    });

                  this.listSelectableProducts.children.forEach(
                    (producto: any) => {
                      if (subobj[0].syncrosId === producto.syncrosId) {
                        producto.children = producto.children.filter(
                          (subProducto: any) => {
                            if (subobj[0].checksum !== subProducto.checksum) {
                              return producto;
                            }
                          }
                        );
                      }
                    }
                  );
                }
              } else {
                return categoria;
              }
            }
          );
        }
      } else if (panel === 'categoria') {
        obj.allCompleteSubCategoria = select;
        if (select) {
          if (
            this.categoriasSeleccionadas.filter((subcategoriaselected) =>
              isEqual(subcategoriaselected, subobj)
            ).length === 0
          ) {
            this.categoriasSeleccionadas.push(subobj);
          }
        } else {
          this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
            (subcategoriaselected) => subcategoriaselected != subobj
          );

          //Adicional se debe eliminar la lista de productos y los productos seleccionados relacionados a esa categoria
          this.productosSeleccionados = this.productosSeleccionados.filter(
            (producto: any) => {
              if (
                subobj.syncrosId === producto.sincroId &&
                subobj.checksum === producto.checksum
              ) {
                if (subobj.id !== producto.catId) {
                  return producto;
                }
                console.log('Se debe eliminar este producto: ');
                console.log(producto);
              } else {
                return producto;
              }
            }
          );
        }
      } else if (panel === 'producto') {
        obj.allCompleteSubProducto = select;
        //Si select es true significa que agregamos el producto a productosSeleccionados.
        if (select) {
          if (
            this.productosSeleccionados.filter((subproductoselected) =>
              isEqual(subproductoselected, {
                ...subobj,
                sincroId: sincroId,
                catId: obj.id,
                checksum: obj.checksum,
              })
            ).length === 0
          ) {
            this.productosSeleccionados.push({
              ...subobj,
              sincroId: sincroId,
              catId: obj.id,
              checksum: obj.checksum,
            });
          }
          console.log(subobj);
          console.log('================================================');
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            sincroProd.children.forEach((catProd: any) => {
              catProd.children.forEach((prod: any) => {
                console.log(prod);
                if (
                  subobj.id === prod.id &&
                  sincroProd.syncrosId !== sincroId
                ) {
                  console.log('sincroProd.syncrosId: ' + sincroProd.syncrosId);
                  prod.disabled = true;
                  catProd.disabled = true;
                }
              });
            });
          });
          console.log('================================================');
        } else {
          const productToDelete = {
            ...subobj,
            sincroId: sincroId,
            catId: obj.id,
            checksum: obj.checksum,
            select: !subobj.select,
          };
          this.productosSeleccionados = this.productosSeleccionados.filter(
            (subproductoselected) =>
              !isEqual(subproductoselected, productToDelete)
          );
          console.log('================================================');
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            sincroProd.children.forEach((catProd: any) => {
              catProd.children.forEach((prod: any) => {
                console.log(prod);
                if (subobj.id === prod.id) {
                  prod.disabled = false;
                  catProd.disabled = false;
                }
              });
            });
          });
          console.log('================================================');
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
    this.menusSeleccionados = [];
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
        if (subMenu.select) this.menusSeleccionados.push(subMenu);
      });
    });
    //Se agregan a la lista de categorias seleccionables todas las categorias relacionadas a los menus previamente seleccionados.
    this.listSelectableCategories.children = this.menusSeleccionados.map(
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

  isCheckingCategoria(
    checksum: string,
    syncrosId: string,
    idCategoria: string
  ): boolean {
    let selectCategoria = false;
    this.categoriasSeleccionadas.forEach((categoria: any) => {
      if (
        categoria.checksum === checksum &&
        categoria.syncrosId === syncrosId &&
        categoria.id === idCategoria
      ) {
        selectCategoria = categoria.select;
      }
    });
    return selectCategoria;
  }

  //Funcion que selecciona un menu de la lista de menus disponibles y lo agrega a menusSeleccionados.
  updateAllCompleteSubMenus(menu: any): void {
    console.log('updateAllCompleteSubMenus!!!');
    this.updateAllCompleteSubOptions(menu, 'menu');
    //Agregamos la lista de categorias disponibles a seleccionar en base a los menus seleccionados.
    this.listSelectableCategories.children = this.menusSeleccionados.map(
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
              select: this.isCheckingCategoria(
                subMenu[0].checksum,
                subMenu[0].syncrosId,
                category.id
              ),
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
    console.log('listSelectableCategories: ');
    console.log(this.listSelectableCategories);
    //this.restartCategoriasProductos('menu');
    this.showCategorias =
      this.listSelectableCategories.children.length > 0 ? true : false;
    this.showProductos =
      this.listSelectableCategories.children.length > 0 &&
      this.listSelectableProducts.children.length > 0
        ? true
        : false;
    this.btnCanalEnvioDisabled =
      this.productosSeleccionados.length > 0 ? false : true;
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

  //Funcion que selecciona un grupo de menus agrupados por sincronizacion de la lista de menus disponibles y lo agrega a menusSeleccionados.
  setAllSubMenus(select: boolean, menu: any): void {
    this.setAllSubOptions(menu, 'menu', select);
    //Agregamos la lista de categorias disponibles a seleccionar en base a los menus seleccionados.
    this.listSelectableCategories.children = this.menusSeleccionados.map(
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
              select: this.isCheckingCategoria(
                subMenu[0].checksum,
                subMenu[0].syncrosId,
                category.id
              ),
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
    //this.restartCategoriasProductos('menu');
    this.showCategorias =
      this.listSelectableCategories.children.length > 0 ? true : false;
    this.showProductos =
      this.listSelectableCategories.children.length > 0 &&
      this.listSelectableProducts.children.length > 0
        ? true
        : false;
    this.btnCanalEnvioDisabled =
      this.productosSeleccionados.length > 0 ? false : true;
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
    console.log(' ------------ setAllCategorias ------------ ');
    //Inicialmente limpio 'categoriasSeleccionadas'
    this.categoriasSeleccionadas = [];
    this.allCompleteCategoria = select;
    if (this.listSelectableCategories.children == null) {
      return;
    }

    //Activo/Desactivo todos los grupos de categorias disponibles y sus hijos
    this.listSelectableCategories.children.forEach((categoria: any) => {
      categoria.select = select;
      categoria.allCompleteSubCategoria = select;
      categoria.children?.forEach(
        (subCategoria: any) => (subCategoria.select = categoria.select)
      );
    });

    //Agrego las categorias seleccionadas en 'categoriasSeleccionadas' si 'select' sea true
    this.listSelectableCategories.children.forEach((categoria: any) => {
      categoria.children?.forEach((subCategoria: any) => {
        if (subCategoria.select)
          this.categoriasSeleccionadas.push(subCategoria);
      });
    });

    console.log('categoriasSeleccionadas: ');
    console.log(this.categoriasSeleccionadas);

    //Si select es true se agrega a 'listSelectableProducts' la categoria con el id de la sincro y sus productos
    if (select) {
      this.categoriasSeleccionadas.forEach((subCategoriaSeleccionada: any) => {
        //Verifico si 'subCategoriaSeleccionada' existe dentro de 'listSelectableProducts.children' sino existe la agrego
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === subCategoriaSeleccionada.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subCategoriaSeleccionada.id,
                title: subCategoriaSeleccionada.title,
                children: subCategoriaSeleccionada.items.map((item: any) => {
                  return { ...item[0], disabled: false };
                }),
                disabled: false,
                checksum: subCategoriaSeleccionada.checksum,
                titleMenu: subCategoriaSeleccionada.titleMenu,
                color: subCategoriaSeleccionada.color,
              },
            ],
            syncrosId: subCategoriaSeleccionada.syncrosId,
            endTime: subCategoriaSeleccionada.endTime,
          });
        } else {
          //Si ya existe busco la sincronizacion a la que 'subCategoriaSeleccionada' pertenece y la agrego.
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subCategoriaSeleccionada.syncrosId) {
              //Se verifica si ya existe esa categoria dentro de 'listSelectableProducts.children(sincroProd)'
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === subCategoriaSeleccionada.id &&
                    catProd.checksum === subCategoriaSeleccionada.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subCategoriaSeleccionada.id,
                  title: subCategoriaSeleccionada.title,
                  children: subCategoriaSeleccionada.items.map((item: any) => {
                    return { ...item[0], disabled: false };
                  }),
                  disabled: false,
                  checksum: subCategoriaSeleccionada.checksum,
                  titleMenu: subCategoriaSeleccionada.titleMenu,
                  color: subCategoriaSeleccionada.color,
                });
              } /* else {
                console.log('ELSE!!!!');
                console.log(
                  sincroProd.children.filter(
                    (catProd: any) => catProd.id === subCategoriaSeleccionada.id
                  )
                );
              } */
            }
          });
        }
      });
    } else {
      //Si 'select' es falso entonces borramos todos los productos seleccionados y los productos disponibles a seleccionar
      this.listSelectableProducts.children = [];
      this.productosSeleccionados = [];
    }

    console.log('productosSeleccionados: ');
    console.log(this.productosSeleccionados);
    console.log('listSelectableProducts(children): ');
    console.log(this.listSelectableProducts.children);
    this.restartCategoriasProductos('categoria');
  }

  isDisabledCategoria(idCategoria: string): boolean {
    let isDisabled = false;
    console.log(' --------------------- funAux --------------------- ')
    console.log('idCategoria: ' + idCategoria)
    //Se desactivan los productos
    console.log('================================================');
    this.listSelectableProducts.children.forEach((sincroProd: any) => {
      sincroProd.children.forEach((catProd: any) => {
        console.log(' - catProd: ')
        console.log(catProd)
        if(catProd.id === idCategoria && catProd.select === true) {
          isDisabled = true;
          return;
        }
        isDisabled = false;
      });
    });
    console.log('================================================');
    console.log('isDisabled: ' + isDisabled)
    return isDisabled;
  }

  updateAllCompleteSubCategorias(categoria: any, subCategoria: any): void {
    //En 'updateAllCompleteSubOptions' Preparamos categoriasSeleccionadas
    this.updateAllCompleteSubOptions(categoria, 'categoria');
    //verificar si se esta agregando o se eliminando una categoria, en base a eso se agrega o elimina elementos en 'listSelectableProducts'
    if (subCategoria.select) {
      this.categoriasSeleccionadas.forEach((subCategoriaSeleccionada: any) => {
        //if que verifica si existe la sincro en listSelectableProducts, sino existe la agrega junto a la categoria y los productos
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === subCategoriaSeleccionada.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: subCategoriaSeleccionada.id,
                title: subCategoriaSeleccionada.title,
                children: subCategoriaSeleccionada.items.map((item: any) => {
                  return { ...item[0], disabled: false };
                }),
                disabled: this.isDisabledCategoria(subCategoriaSeleccionada.id),
                checksum: subCategoriaSeleccionada.checksum,
                titleMenu: subCategoriaSeleccionada.titleMenu,
                color: subCategoriaSeleccionada.color,
              },
            ],
            syncrosId: subCategoriaSeleccionada.syncrosId,
            endTime: subCategoriaSeleccionada.endTime,
          });
        }
        // si la sincro existe agrego la categoria y los productos en dicha sincro
        else {
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === subCategoriaSeleccionada.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === subCategoriaSeleccionada.id &&
                    catProd.checksum === subCategoriaSeleccionada.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: subCategoriaSeleccionada.id,
                  title: subCategoriaSeleccionada.title,
                  children: subCategoriaSeleccionada.items.map((item: any) => {
                    return { ...item[0], disabled: false };
                  }),
                  disabled: false,
                  checksum: subCategoriaSeleccionada.checksum,
                  titleMenu: subCategoriaSeleccionada.titleMenu,
                  color: subCategoriaSeleccionada.color,
                });
              }
            }
          });
        }
      });

    } else {
      this.listSelectableProducts.children.forEach(
        (sincroProd: any, index: number) => {
          if (sincroProd.syncrosId === subCategoria.syncrosId) {
            sincroProd.children = sincroProd.children.filter(
              (catProd: any) => catProd.id !== subCategoria.id
            );
          }
          //Si la division de productos por sincronizacion no tiene productos dentro, se elimina.
          if (sincroProd.children.length === 0) {
            console.log('Index: ' + index);
            console.log('Este elemento se debe eliminar xq esta vacio...');
            this.listSelectableProducts.children.splice(index, 1);
          }
        }
      );
      //Eliminamos los elementos que esten vacios
      /* this.listSelectableProducts.children.filter((sincroProd: any, index: number) => {
        if(sincroProd.children.length > 0) {
          return sincroProd;
        }
      }) */
    }
    console.log('productosSeleccionados: ');
    console.log(this.productosSeleccionados);
    console.log('listSelectableProducts(children): ');
    console.log(this.listSelectableProducts.children);

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
    console.log(' ------------- setAllSubCategorias ------------- ');
    //Preparamos las categorias que han sido seleccionadas en 'categoriasSeleccionadas'
    this.setAllSubOptions(categoria, 'categoria', select);
    console.log('select: ' + select);
    console.log('categoria: ');
    console.log(categoria);
    console.log('categoriasSeleccionadas: ');
    console.log(this.categoriasSeleccionadas);
    if (select) {
      this.categoriasSeleccionadas.forEach((categoriaSeleccionada: any) => {
        //Verifico si en listSelectableProducts.children ya existe esa sincronizacion, sino existe la agrego.
        if (
          this.listSelectableProducts.children.filter(
            (sincroProd: any) =>
              sincroProd.syncrosId === categoriaSeleccionada.syncrosId
          ).length === 0
        ) {
          this.listSelectableProducts.children.push({
            children: [
              {
                id: categoriaSeleccionada.id,
                title: categoriaSeleccionada.title,
                children: categoriaSeleccionada.items.map((item: any) => {
                  return { ...item[0], disabled: false };
                }),
                disabled: false,
                checksum: categoria.checksum,
                titleMenu: categoriaSeleccionada.titleMenu,
                color: categoria.color,
              },
            ],
            syncrosId: categoriaSeleccionada.syncrosId,
            endTime: categoriaSeleccionada.endTime,
          });
        } else {
          //Si ya existe la sincronizacion entonces agrego un nuevo elemento (producto a elegir) en dicha sincronizacion.
          this.listSelectableProducts.children.forEach((sincroProd: any) => {
            if (sincroProd.syncrosId === categoriaSeleccionada.syncrosId) {
              if (
                sincroProd.children.filter(
                  (catProd: any) =>
                    catProd.id === categoriaSeleccionada.id &&
                    catProd.checksum === categoriaSeleccionada.checksum
                ).length === 0
              ) {
                sincroProd.children.push({
                  id: categoriaSeleccionada.id,
                  title: categoriaSeleccionada.title,
                  children: categoriaSeleccionada.items.map((item: any) => {
                    return { ...item[0], disabled: false };
                  }),
                  disabled: false,
                  checksum: categoria.checksum,
                  titleMenu: categoriaSeleccionada.titleMenu,
                  color: categoria.color,
                });
              }
            }
          });
        }
      });
    } else {
      const arrayAux: any = [];

      this.listSelectableProducts.children.forEach((sincroProd: any) => {
        if (sincroProd.syncrosId === categoria.syncrosId) {
          sincroProd.children.forEach((producto: any) => {
            if (producto.checksum === categoria.checksum) {
              arrayAux.push(producto);
            }
          });
        }
      });

      console.log(' --- arrayAux: ');
      console.log(arrayAux);

      if (arrayAux.length === 0) {
        this.listSelectableProducts.children =
          this.listSelectableProducts.children.filter(
            (sincroProd: any) => sincroProd.syncrosId !== categoria.syncrosId
          );
      } else {
        this.listSelectableProducts.children.forEach(
          (sincroProd: any, index: number) => {
            if (sincroProd.syncrosId === categoria.syncrosId) {
              sincroProd.children = sincroProd.children.filter(
                (producto: any) => producto.checksum !== categoria.checksum
              );
            }
            //Si la division de productos por sincronizacion no tiene productos dentro, se elimina.
            if (sincroProd.children.length === 0) {
              this.listSelectableProducts.children.splice(index, 1);
            }
          }
        );
      }
    }
    console.log('--------- listSelectableProducts(children): ');
    console.log(this.listSelectableProducts.children);
    console.log('--------- productosSeleccionados: ');
    console.log(this.productosSeleccionados);
    this.restartCategoriasProductos('categoria');
  }

  updateAllCompleteProductos(): void {
    console.log(
      ' =================== updateAllCompleteProductos =================== '
    );
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
    this.productosSeleccionados = [];
    this.allCompleteProducto = select;
    if (this.listSelectableProducts.children == null) {
      return;
    }

    //Selecciono todas las categorias y sus productos
    this.listSelectableProducts.children.forEach((sincroProd: any) => {
      sincroProd.children?.forEach((catProd: any) => {
        catProd.select = select;
        catProd.allCompleteSubProducto = select;
        catProd.children?.forEach(
          (subproducto: any) => (subproducto.select = catProd.select)
        );
      });
    });

    //Agrego los producots seleccionados a productosSeleccionados
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
            this.productosSeleccionados.push({
              ...producto,
              sincroId: sincroProd.syncrosId,
              catId: catProd.id,
              checksum: catProd.checksum,
            });
        });
      });
    });
    this.btnCanalEnvioDisabled =
      this.productosSeleccionados.length > 0 ? false : true;
  }

  /*
  Parametros:
  - catProd(object): Contiene los productos a seleccionar agrupados a nivel de categoria.
  */
  updateAllCompleteSubProductos(
    catProd: any,
    sincroId: string,
    subproducto: any
  ): void {
    console.log(
      ' =================== updateAllCompleteSubProductos =================== '
    );
    console.log(' === catProd:');
    console.log(catProd);
    console.log(' === sincroId:');
    console.log(sincroId);

    catProd.allCompleteSubProducto =
      catProd.children != null &&
      catProd.children.every((producto: any) => producto.select);

    console.log('--------------------------------------');
    console.log('subproducto: ');
    console.log(subproducto);
    if (subproducto.select) {
      if (
        this.productosSeleccionados.filter((subproductoselected) =>
          isEqual(subproductoselected, {
            ...subproducto,
            sincroId: sincroId,
            catId: catProd.id,
            checksum: catProd.checksum,
          })
        ).length === 0
      ) {
        this.productosSeleccionados.push({
          ...subproducto,
          sincroId: sincroId,
          catId: catProd.id,
          checksum: catProd.checksum,
        });
        console.log('================================================');
        this.listSelectableProducts.children.forEach((sincroProd: any) => {
          sincroProd.children.forEach((catProd: any) => {
            catProd.children.forEach((prod: any) => {
              console.log(prod);
              if (
                subproducto.id === prod.id &&
                sincroProd.syncrosId !== sincroId
              ) {
                console.log('sincroProd.syncrosId: ' + sincroProd.syncrosId);
                prod.disabled = true;
                catProd.disabled = true;
              }
            });
          });
        });
        console.log('================================================');
      }
    }
    //Creamos el objeto 'productToDelete' para poder identificar la subproducto a eliminar de productosSeleccionados
    else {
      const productToDelete = {
        ...subproducto,
        sincroId: sincroId,
        catId: catProd.id,
        checksum: catProd.checksum,
        select: !subproducto.select,
      };
      this.productosSeleccionados = this.productosSeleccionados.filter(
        (subproductoselected) => !isEqual(subproductoselected, productToDelete)
      );
      console.log('================================================');
      this.listSelectableProducts.children.forEach((sincroProd: any) => {
        sincroProd.children.forEach((catProd: any) => {
          catProd.children.forEach((prod: any) => {
            console.log(prod);
            if (subproducto.id === prod.id) {
              prod.disabled = false;
            }
          });
          if (
            catProd.children.filter((prod: any) => 
              prod.disabled === true
            ).length === 0
          ) {
            catProd.disabled = false;
          }
        });
      });
      console.log('================================================');
    }

    console.log('--------- listSelectableProducts(children): ');
    console.log(this.listSelectableProducts.children);
    console.log('--------- productosSeleccionados: ');
    console.log(this.productosSeleccionados);

    this.btnCanalEnvioDisabled =
      this.productosSeleccionados.length > 0 ? false : true;
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

  /*
  Parametros:
  - select(booleano): Bandera que indica si se ha seleccionado un conjunto de productos agrupados por categoria.
  - catProd(object): Contiene los productos a seleccionar agrupados a nivel de categoria.
  - sincroId(string): Id de la sincronizacion.
  */
  setAllSubProductos(
    select: boolean,
    catProd: any,
    sincroId: string = ''
  ): void {
    console.log(' =================== setAllSubProductos =================== ');
    this.setAllSubOptions(catProd, 'producto', select, sincroId);
    this.btnCanalEnvioDisabled =
      this.productosSeleccionados.length > 0 ? false : true;
  }

  openFilterMenu(): void {
    const dialogRef = this.dialog.open(FilterMenuComponent, {
      data: {
        page: this.page,
        rowsMenu: this.rowsMenu,
        formularioFiltro: this.formularioFiltro,
      },
      height: '370px',
      width: '460px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.menus && result.menus?.groupSync?.length > 0) {
        console.log(result.menus);
        const { menus, formularioFiltro } = result;
        //si existe una paginacion activa, regreso a la pagina 0
        if (this.paginator) this.paginator.changePage(0);
        //Salvo los campos del formulario de filtro.
        this.formularioFiltro = formularioFiltro;
        //Reinicio todos los objetos que contienen informacion sobre los menus existentes
        this.menusSeleccionados = [];
        this.listSelectableCategories.children = [];
        this.paginasGuardadas = [];
        this.restartCategoriasProductos('menu');
        //Muestro los menus y oculto el mensaje "No Hay Data"
        this.showMenus = true;
        //Obtenemos el total de menus filtrados
        this.total_recordsMenu = menus.pagination.totalRecords;
        //Con este map recorro todas las sincronizaciones que se encuentran en la prop groupSync y voy agrupando los menus pertenecientes a cada una de ellas.
        this.listSelectableMenu.children = menus.groupSync.map(
          (syncro: any) => {
            return {
              syncrosId: syncro.syncrosId,
              startTime: syncro.startTime,
              endTime: new Date(syncro.endTime),
              //En la prop children guardo todos los menus que pertenecen a una sincronizacion.
              children: syncro.menus.map((menuSync: any) => {
                //Busco los menus en la prop groupMenu y los filtro por los id que se encuentran en el objeto menuSync.menu
                const menuFiltrado = menus.groupMenu.filter(
                  (menu: any) => menu.checksum === menuSync.menu
                );
                //Al menu obtenido le agrego el id, endTime de la sincronozacion a la que pertenece, adicional se agrega la tienda, su agregador y el color.
                menuFiltrado[0] = {
                  ...menuFiltrado[0],
                  aggregator: menuSync.aggregator,
                  store: menuSync.store,
                  syncrosId: syncro.syncrosId,
                  endTime: syncro.endTime,
                  color: `hsl(${Math.random() * 255}, 38%, 55%, .5)`,
                };
                return menuFiltrado;
              }),
            };
          }
        );
        this.paginasGuardadas.push({ ...this.listSelectableMenu });
      } else if (result && result.menus === null) {
        this.listSelectableMenu.children = [];
        this.menusSeleccionados = [];
        this.listSelectableCategories.children = [];
        this.restartCategoriasProductos('menu');
        this.showMenus = false;
      }
    });
  }

  canalEnvio(): void {
    const dialogRef = this.dialog.open(CanalEnvioComponent, {
      data: {
        productosSeleccionados: this.productosSeleccionados,
        menusSeleccionados: this.menusSeleccionados,
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
    this.txtBtnGreen = 'SINCRONIZACIÓN EN CURSO';
    this.menuService.sincronizarMaxpoint().subscribe({
      next: (response) => {
        if (response.status === 200 && response.valueSync === false) {
          this.btnSincronizarMaxpointDisabled = false;
          this.txtBtnGreen = 'EXTRACCIÓN DE MENÚS';
        }

        console.log(response);
        this.messageService.add(
          validateResponse({ message: response.message, status: response.code })
        );
        setTimeout(() => {
          this.messageService.clear();
        }, 3000);
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.btnSincronizarMaxpointDisabled = false;
          this.txtBtnGreen = 'EXTRACCIÓN DE MENÚS';
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
