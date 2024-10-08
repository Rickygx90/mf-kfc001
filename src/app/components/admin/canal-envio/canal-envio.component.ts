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
import { MatBadgeModule } from '@angular/material/badge';

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
    MatBadgeModule,
  ],
  providers: [MessageService],
  templateUrl: './canal-envio.component.html',
  styleUrl: './canal-envio.component.css',
})
export class CanalEnvioComponent implements OnInit {
  tokenTotp: string = '';
  statusTotp: string = '';
  showCanales: boolean = false;
  showRestaurantes: Boolean = false;
  menuService = inject(MenuService);
  allCompleteCanales: boolean = false;
  allCompleteRestaurante: boolean = false;
  btnEnviarAhoraDisabled: boolean = false;
  btnHabilitarDisabled: boolean = false;
  msjBtnHabilitar: string = 'Habilitar';
  colorBtnHabilitar: string = 'green'; //#1fa44f
  //Objetos que habilitaran el panel de canal de envio y restaurantes para poder ser modificados
  panelesDisabled: boolean = true;
  //Objeto que guardara los menus filtrados sin repeticiones.
  menusUnificados: Array<any> = [];

  //Objeto que guarda el menu seleccionado y en base a esto filtra las categorias y los productos.
  menuSeleccionado: any;
  //Objeto que guarda el menu seleccionado inicial en caso de que se cancele la edicion de canales de venta/restaurantes (boton rojo)
  menuSeleccionadoInicial: any = [];
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
  //Id del intervalo para hacer el request de 'checkStatusCanalEnvio' cada 4 segundos
  idInterval: any;

  constructor(
    public dialogRef: MatDialogRef<CanalEnvioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService
  ) {
    this.idInterval = setInterval(() => {
      if (this.statusTotp === 'CREATED') {
        this.checkStatusCanalEnvio();
      }
    }, 4000);
  }

  ngOnInit(): void {
    if (this.data && this.data.menusSeleccionados) {
      //Filtramos los menus repetidos y los guardamos en menusUnificados.
      this.data.menusSeleccionados.forEach((menusSeleccionado: any) => {
        if (
          this.menusUnificados.filter((menu: any) => {
            if (menu.aggregator === menusSeleccionado[0].aggregator) {
              if (menu.store.id === menusSeleccionado[0].store.id) {
                return menu;
              }
            }
          }).length === 0
        ) {
          this.menusUnificados.push({
            title: menusSeleccionado[0].menus[0].title,
            sincrosId: menusSeleccionado[0].syncrosId,
            checksum: menusSeleccionado[0].checksum,
            aggregator: menusSeleccionado[0].aggregator,
            store: menusSeleccionado[0].store,
            checked: false,
            metadata: {
              platforms: this.getCanalesVenta2(menusSeleccionado[0]),
              restaurant: this.getRestaurantesbyMenus2(menusSeleccionado[0]),
            },
          });
        }
      });

      //Ordenamos los menus por orden alfabetico.
      this.menusUnificados.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });

      console.log(' ---- menusUnificados: ');
      console.log(this.menusUnificados);

      //Salvamos el menu seleccionado por default en 'menuSeleccionadoInicial'
      this.menuSeleccionadoInicial = {...this.menusUnificados};

      this.listSelectableRestaurantes.children =
        this.menusUnificados[0].metadata.restaurant;
      this.listSelectableCanalesVenta.children =
        this.menusUnificados[0].metadata.platforms;

      this.menuSeleccionado = this.menusUnificados[0];
    }
  }

  ngOnDestroy() {
    clearInterval(this.idInterval);
  }

  checkStatusCanalEnvio() {
    this.menuService.checkStatusCanalEnvio(this.tokenTotp).subscribe({
      next: (result) => {
        console.log(result);
        if (result) {
          this.statusTotp = result.status;
          if (this.statusTotp === 'ACTIVED') {
            this.panelesDisabled = false;
            this.btnHabilitarDisabled = false;
            this.msjBtnHabilitar = 'Cancelar';
            this.colorBtnHabilitar = 'red';
          } else if (
            this.statusTotp === 'EXPIRED' ||
            this.statusTotp === 'NOT_FOUND'
          ) {
            this.panelesDisabled = true;
            this.btnHabilitarDisabled = false;
            this.msjBtnHabilitar = 'Habilitar';
            this.colorBtnHabilitar = 'green';
            this.tokenTotp = '';
          } else if (this.statusTotp === 'CREATED') {
            this.panelesDisabled = true;
            this.btnHabilitarDisabled = true;
            this.msjBtnHabilitar = 'Habilitar';
            this.colorBtnHabilitar = 'green';
          }
        }
      },
      error: (err) => {},
    });
  }

  getTokenCanalEnvio() {
    if (this.msjBtnHabilitar === 'Habilitar') {
      this.btnHabilitarDisabled = true;
      this.menuService.getTokenCanalEnvio().subscribe({
        next: (result) => {
          console.log(result);
          if (result) {
            this.tokenTotp = result.token;
            this.statusTotp = 'CREATED';
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.panelesDisabled = true;
      this.btnHabilitarDisabled = false;
      this.msjBtnHabilitar = 'Habilitar';
      this.colorBtnHabilitar = 'green';
      this.tokenTotp = '';

      //Reinicio los objetos
      this.showCanales = false;
      this.showRestaurantes = false;
      this.menusUnificados = [];
      this.listSelectableCanalesVenta = {
        name: 'Seleccionar todos',
        select: false,
        children: [],
      };
      this.listSelectableRestaurantes = {
        name: 'Seleccionar todos',
        select: false,
        children: [],
      };

      //Filtramos los menus repetidos y los guardamos en menusUnificados.
      this.data.menusSeleccionados.forEach((menusSeleccionado: any) => {
        if (
          this.menusUnificados.filter((menu: any) => {
            if (menu.aggregator === menusSeleccionado[0].aggregator) {
              if (menu.store.id === menusSeleccionado[0].store.id) {
                return menu;
              }
            }
          }).length === 0
        ) {
          this.menusUnificados.push({
            title: menusSeleccionado[0].menus[0].title,
            sincrosId: menusSeleccionado[0].syncrosId,
            checksum: menusSeleccionado[0].checksum,
            aggregator: menusSeleccionado[0].aggregator,
            store: menusSeleccionado[0].store,
            checked: false,
            metadata: {
              platforms: this.getCanalesVenta2(menusSeleccionado[0]),
              restaurant: this.getRestaurantesbyMenus2(menusSeleccionado[0]),
            },
          });
        }
      });

      //Ordenamos los menus por orden alfabetico.
      this.menusUnificados.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });

      //this.menusUnificados = this.menuSeleccionadoInicial;
      console.log(this.menusUnificados)

      this.listSelectableRestaurantes.children =
        this.menusUnificados[0].metadata.restaurant;
      this.listSelectableCanalesVenta.children =
        this.menusUnificados[0].metadata.platforms;
      this.menuSeleccionado = this.menusUnificados[0];
    }
  }

  //Funcion que obtiene los restaurantes segun el menu seleccionado y activa el restaurante por defecto.
  getRestaurantesbyMenus(menuSeleccionado: any) {
    this.menuService.getRestaurantesbyMenus(menuSeleccionado).subscribe({
      next: (restaurantes) => {
        if (restaurantes) {
          this.showRestaurantes = true;
          this.listSelectableRestaurantes.children = restaurantes.map(
            (restaurante: any) => {
              return {
                ...restaurante,
                select: false,
              };
            }
          );
          //Ordenamos los restaurantes por orden alfabetico.
          this.listSelectableRestaurantes.children.sort(function (a, b) {
            if (a.codeStore > b.codeStore) {
              return 1;
            }
            if (a.codeStore < b.codeStore) {
              return -1;
            }
            return 0;
          });
          //Activamos el restaurante por defecto segun el menu seleccionado.
          this.listSelectableRestaurantes.children.forEach(
            (restaurante: any) => {
              if (restaurante.id === menuSeleccionado.store.id) {
                restaurante.select = true;
              }
            }
          );
        }
      },
      error: (err) => {},
    });
  }

  getCanalesVenta2(menuSeleccionado: any) {
    const canalesSeleccionables: any = [];
    this.menuService.requestAggregators().subscribe({
      next: (response) => {
        if (response && response.aggregators) {
          response.aggregators.forEach((aggregator: any) => {
            canalesSeleccionables.push(aggregator);
          });
          //Activamos el canal de venta por defecto segun el menu seleccionado.
          canalesSeleccionables.forEach((canalVenta: any) => {
            if (
              canalVenta.name.toLowerCase() ===
              menuSeleccionado.aggregator.toLowerCase()
            ) {
              canalVenta.select = true;
            }
          });
          this.showCanales = true;
        }
      },
      error: (err) => {},
    });
    console.log(canalesSeleccionables);
    return canalesSeleccionables;
  }

  getRestaurantesbyMenus2(menuSeleccionado: any) {
    const restaurantesSeleccionables: any = [];
    this.menuService.getRestaurantesbyMenus(menuSeleccionado).subscribe({
      next: (restaurantes) => {
        if (restaurantes) {
          restaurantes.forEach((restaurante: any) => {
            restaurantesSeleccionables.push({
              ...restaurante,
              select: false,
            });
          });
          //Ordenamos los restaurantesDisponibles por orden alfabetico.
          restaurantesSeleccionables.sort(function (a: any, b: any) {
            if (a.codeStore > b.codeStore) {
              return 1;
            }
            if (a.codeStore < b.codeStore) {
              return -1;
            }
            return 0;
          });
          //Activamos el restaurante por defecto segun el menu seleccionado.
          restaurantesSeleccionables.forEach((restaurante: any) => {
            if (restaurante.id === menuSeleccionado.store.id) {
              restaurante.select = true;
            }
          });
          this.showRestaurantes = true;
        }
      },
      error: (err) => {},
    });
    console.log(restaurantesSeleccionables);
    return restaurantesSeleccionables;
  }

  //Funcion que obtiene los canales de venta segun el menu seleccionado y activa el canal de venta por defecto.
  getCanalesVenta(menuSeleccionado: any) {
    this.menuService.requestAggregators().subscribe({
      next: (response) => {
        if (response && response.aggregators) {
          this.showCanales = true;
          this.listSelectableCanalesVenta.children = response.aggregators;
          //Activamos el canal de venta por defecto segun el menu seleccionado.
          this.listSelectableCanalesVenta.children.forEach(
            (canalVenta: any) => {
              if (
                canalVenta.name.toLowerCase() ===
                menuSeleccionado.aggregator.toLowerCase()
              ) {
                canalVenta.select = true;
              }
            }
          );
        }
      },
      error: (err) => {},
    });
  }

  //Funcion que cambia el menu (radio button)
  cambiarMenu($event: any) {
    this.showRestaurantes = false;
    this.showCanales = false;
    this.menusUnificados.forEach((menu: any) => {
      if (menu.title === $event.value.title) {
        menu.checked = true;
        this.menuSeleccionado = menu;
        this.listSelectableRestaurantes.children = menu.metadata.restaurant;
        this.showRestaurantes = true;
        this.listSelectableCanalesVenta.children = menu.metadata.platforms;
        this.showCanales = true;
      }
    });
  }

  //Funcion que obtiene los restaurantes y los canales de venta seleccionados.
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

  //Funcion que activa/desactiva el botton enviar ahora
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

  //Funcion que envia la informacion del menu, canal de venta y restaurante seleccionado.
  enviarAhora() {
    console.log(' =================== enviarAhora ===================== ');
    this.btnEnviarAhoraDisabled = true;
    const { canalesVentaSelected, restaurantesSelected } =
      this.getCanalesRestaurantesSelected();

    console.log(' - canalesVentaSelected: ');
    console.log(canalesVentaSelected);
    console.log(' - restaurantesSelected: ');
    console.log(restaurantesSelected);
    console.log(' - menusSeleccionados: ');
    console.log(this.data.menusSeleccionados);
    console.log(' - productosSeleccionados: ');
    console.log(this.data.productosSeleccionados);

    const request_menu = this.menusUnificados.map((menuUnificado: any) => {
      const sync_ids: any = [];
      const checksums: any = [];

      this.data.menusSeleccionados.forEach((menuSeleccionado: any) => {
        if (menuUnificado.aggregator === menuSeleccionado[0].aggregator) {
          if (menuUnificado.store.id === menuSeleccionado[0].store.id) {
            sync_ids.push(menuSeleccionado[0].syncrosId);
            checksums.push(menuSeleccionado[0].checksum);
          }
        }
      });

      const restaurantMetadata: any = [];
      menuUnificado.metadata.restaurant.forEach((restaurant: any) => {
        if (restaurant.select)
          restaurantMetadata.push({
            id: restaurant.id,
            chain_id: restaurant.idChain,
          });
      });

      const platformsMetadata: any = [];
      menuUnificado.metadata.platforms.forEach((platform: any) => {
        if (platform.select) platformsMetadata.push(platform.name);
      });

      const productosPorCategorias: any = [];
      this.data.productosSeleccionados.forEach((productoSeleccionado: any) => {
        if (
          checksums.filter(
            (checksum: any) => checksum === productoSeleccionado.checksum
          ).length > 0
        ) {
          if (
            productosPorCategorias.filter(
              (categoria: any) => categoria.id === productoSeleccionado.catId
            ).length === 0
          ) {
            productosPorCategorias.push({
              sync_id: productoSeleccionado.sincroId,
              checksum: productoSeleccionado.checksum,
              id: productoSeleccionado.catId,
              products: [productoSeleccionado.id],
            });
          } else {
            productosPorCategorias.forEach((categoria: any) => {
              if (categoria.id === productoSeleccionado.catId)
                categoria.products.push(productoSeleccionado.id);
            });
          }
        }
      });

      return {
        sync_ids: sync_ids,
        checksums: checksums,
        metadata: {
          platforms: platformsMetadata,
          restaurant: restaurantMetadata,
        },
        categories: productosPorCategorias,
      };
    });


    const request = {
      tokenTotp: '12345678',
      request_menu: request_menu.filter((menu) => menu.categories.length > 0),
    };

    console.log(' --------------------- request --------------------- ');
    console.log(request);

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
        this.tokenTotp = '';
        this.btnEnviarAhoraDisabled = false;
        this.dialogRef.close();
        //this.statusTotp = '';
      },
    });
  }
}
