import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  automaticSync,
  menuItemI,
  optionsToSelectI,
} from '../models/interfaces';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private httpClient = inject(HttpClient);
  public menuList: Array<optionsToSelectI> = [];

  getMenuItems(channelName: string): Array<menuItemI> {
    console.log(channelName);
    return [
      {
        id: 1,
        rstName: 'K001',
        channelName: 'Uber',
        status: 'success',
        createdAtFormat: '10/03/24',
      },
      {
        id: 2,
        rstName: 'K002',
        channelName: 'Uber',
        status: 'error',
        createdAtFormat: '10/03/24',
      },
      {
        id: 3,
        rstName: 'K003',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 4,
        rstName: 'K004',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 5,
        rstName: 'K005',
        channelName: 'Uber',
        status: 'error',
        createdAtFormat: '10/03/24',
      },
      {
        id: 6,
        rstName: 'K006',
        channelName: 'Uber',
        status: 'success',
        createdAtFormat: '10/03/24',
      },
      {
        id: 7,
        rstName: 'K007',
        channelName: 'Uber',
        status: 'error',
        createdAtFormat: '10/03/24',
      },
      {
        id: 8,
        rstName: 'K008',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 9,
        rstName: 'K009',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 10,
        rstName: 'K010',
        channelName: 'Uber',
        status: 'success',
        createdAtFormat: '10/03/24',
      },
      {
        id: 11,
        rstName: 'K011',
        channelName: 'Uber',
        status: 'success',
        createdAtFormat: '10/03/24',
      },
      {
        id: 12,
        rstName: 'K012',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 13,
        rstName: 'K013',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 14,
        rstName: 'K014',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 15,
        rstName: 'K015',
        channelName: 'Uber',
        status: 'error',
        createdAtFormat: '10/03/24',
      },
      {
        id: 16,
        rstName: 'K016',
        channelName: 'Uber',
        status: 'in_progress',
        createdAtFormat: '10/03/24',
      },
      {
        id: 17,
        rstName: 'K017',
        channelName: 'Uber',
        status: 'success',
        createdAtFormat: '10/03/24',
      },
    ];
  }

  getCadenasToSelect(): Observable<any[]> {
    return this.httpClient.post<any>(
      `${environment.url}/menu/chainsall`, {}
    );
  }

  getRestaurantesToSelect(cadenas: Array<any>): Observable<any[]> {
    let idCadenas = [];
    idCadenas = cadenas.map((cadena) => cadena.code);
    return this.httpClient.post<any>(
      `${environment.url}/menu/findrestaurants`,
      {
        id: idCadenas,
      }
    );
  }

  getMenuToSelectCheckbox(formularioFiltro: any): Observable<any[]> {
    return this.httpClient.post<any>(
      `http://192.168.101.29:3001/api/sincronization/getmenus`,
      {
        restaurantes: formularioFiltro.restaurantesSeleccionados,
        fecha: {
          fechaInicial: formularioFiltro.fechaInicio,
          fechaFinal: formularioFiltro.fechaFin,
        },
      }
    );
  }

  getCategoriasMenuToSelectCheckbox(
    menus: Array<optionsToSelectI>
  ): Observable<any> {
    let idMenus = [];
    idMenus = menus.map((menu) => menu.id);
    return this.httpClient
      .post<any>(
        `http://192.168.101.29:3001/api/sincronization/getcategoriesbymenu`,
        {
          ids: idMenus,
        }
      )
      .pipe(
        map((categorias) => {
          return categorias.map((categoria: any) => {
            return {
              name: categoria.id,
              select: false,
              children: categoria.categories.map((categoria: any) => {
                return {
                  name: categoria.idcategory,
                  code: categoria.idcategory,
                  date: categoria.date,
                  select: false,
                };
              }),
            };
          });
        })
      );
  }

  getProductosCategoriasToSelectCheckbox(
    categorias: Array<optionsToSelectI>
  ): Observable<any> {
    console.log(categorias);

    let codeCategorias = [];
    codeCategorias = categorias.map((categoria) => categoria.code);
    console.log(codeCategorias);
    return this.httpClient
      .post<any>(
        `http://192.168.101.29:3001/api/sincronization/getproductbycategories`,
        {
          ids: codeCategorias,
        }
      )
      .pipe(
        map((productos) => {
          console.log(productos);
          return productos.map((producto: any) => {
            return {
              name: producto.idcategory,
              select: false,
              children: producto.products.map((product: any) => {
                return {
                  name: product.product,
                  code: product.idproduct,
                  date: product.date,
                  select: false,
                };
              }),
            };
          });
        })
      );
  }

  getCanalesVentaToSelectCheckbox(): Observable<any> {
    return this.httpClient
      .post<any>(
        `http://192.168.101.29:3001/api/sincronization/getchannels`,
        {}
      )
      .pipe(
        map((canales) => {
          console.log(canales);
          return canales;
        })
      );
  }

  setNow(): string {
    let now = new Date();
    let hours = ('0' + now.getHours()).slice(-2);
    let minutes = ('0' + now.getMinutes()).slice(-2);
    return hours + ':' + minutes;
  }

  requestAggregators(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/aggregators`).pipe(
      map((aggregators) => {
        const newConfiguration: automaticSync = {
          syncMaxPoint: false,
          syncTime: this.setNow(),
          aggregators: [],
        };
        if (aggregators) {
          aggregators.forEach((aggregator: any) => {
            newConfiguration.aggregators.push({
              code: aggregator.code,
              name: aggregator.name,
              syncTime: this.setNow(),
              select: false,
            });
          });
        }
        return newConfiguration;
      })
    );
  }

  requestLastConfiguration(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.url}/configurations/last`)
      .pipe(
        map((lastConfiguration) => {
          const newConfiguration: automaticSync = {
            syncMaxPoint: false,
            syncTime: this.setNow(),
            aggregators: [],
          };
          if (lastConfiguration) {
            newConfiguration.syncMaxPoint = lastConfiguration.last.syncMaxPoint;
            newConfiguration.syncTime = lastConfiguration.last.syncTime
              ? lastConfiguration.last.syncTime
              : newConfiguration.syncTime;

            lastConfiguration.last.aggregators.forEach(
              (validAggregator: any) => {
                if (validAggregator) {
                  newConfiguration.aggregators.push({
                    code: validAggregator.code,
                    name: validAggregator.name,
                    syncTime: validAggregator.syncTime, //lastConfiguration.last.syncTime, //validAggregator.syncTime
                    select: validAggregator.select,
                  });
                }
              }
            );
          }
          return newConfiguration;
        })
      );
  }

  sendAutomaticSync(automaticSync: automaticSync): Observable<any> {
    return this.httpClient.put<any>(
      `${environment.url}/configurations`,
      automaticSync
    );
  }

  sendManualSync(req: any): Observable<any> {
    console.log(req);
    return this.httpClient.post<any>(
      `http://192.168.101.29:3001/api/sincronization/sendmanual`,
      { req }
    );
  }

  sincronizarMaxpoint(): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/sync/all`, {});
  }
}
