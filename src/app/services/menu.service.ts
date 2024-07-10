import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CadenaI,
  RestauranteI,
  automaticSync,
  menuItemI,
  optionsToSelectI,
} from '../models/interfaces';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import short from 'short-uuid';

interface menuObject {
  data: menuItemI[];
  total_records: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private httpClient = inject(HttpClient);

  getMenuItems(pagina: number, filas: number): Observable<menuObject> {
    const translator = short();
    let data: menuItemI[] = [];
    let total_records = 0;
    return this.httpClient
      .get<any>(`${environment.url}/sync?page=${pagina + 1}&size=${filas}`)
      .pipe(
        map((menus) => {
          //if (menus && menus.data && menus.total_records > 0) {
          /* menus.data.map((menu: any) => {
              console.log(menu)
              data.push({
                syncros_id: translator.fromUUID(menu.syncros_id),
                start_time: menu.start_time,
                end_time: menu.start_time,
                error_msg: menu.start_time,
                status: menu.status,
              });
            });
            total_records = menus.total_records; */
          //}
          /*  console.log(menus)
          console.log(data);
          console.log(total_records) */
          return {
            data: menus.data,
            total_records: menus.total_records,
          };
        })
      );
  }

  getDetailMenu(id: string) {
    return this.httpClient.get<any>(
      `${environment.url}/dashboard/sync/error/${id}`
    );
  }

  getCadenasToSelect(): Observable<CadenaI[]> {
    return this.httpClient.post<any>(`${environment.url}/menu/chainsall`, {});
  }

  getRestaurantesToSelect(cadenas: CadenaI[]): Observable<RestauranteI[]> {
    return this.httpClient.post<any>(
      `${environment.url}/menu/findrestaurants`,
      {
        id: cadenas.map((cadena) => cadena.id) || [],
      }
    );
  }

  getMenuToSelectCheckbox(formularioFiltro: any): Observable<any[]> {
    //  /menu/findmenus
    return this.httpClient.post<any>(`${environment.url}/menu/findmenus`, {
      restaurants: formularioFiltro.restaurantesSeleccionados.map(
        (restaurant: any) => {
          return {
            id: restaurant.id,
            codeStore: restaurant.codeStore,
          };
        }
      ),
      dates: {
        startDate: formularioFiltro.fechaInicio.toISOString(),
        endDate: formularioFiltro.fechaFin.toISOString(),
      },
      page: 1,
      pageSize: 10,
      otherFilters: {
        searchNameMenu: {
          enable: false,
          nameMenu: '',
        },
      },
    });
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
