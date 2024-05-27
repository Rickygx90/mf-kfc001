import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CadenaI,
  RestauranteI,
  menuItemI,
  multiSelectI,
  optionsToSelectI,
} from '../models/interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
const httpOptions = {
  headers: new HttpHeaders({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU5ODM2MDYsImlkIjoiNjY0NTNiMjIwMjZkNzBlMTA3ZDk0NDU1IiwidXNlcm5hbWUiOiJhZG1pbiJ9.E32H39TjV7ElIvRkgHtc5K-murq_zEsB-7Yi-PFRPPk',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private httpClient = inject(HttpClient);
  public menuList: Array<optionsToSelectI> = [];
  private aggregators: Array<optionsToSelectI> = [];

  getMenuItems(channelName: string): Array<menuItemI> {
    console.log(channelName);
    /* return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/rtegister`, formValue)
    ) */
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

  getCadenasToSelect(): Array<CadenaI> {
    return [
      { name: 'Tropiburger', code: 'tropi' },
      { name: 'KFC', code: 'kfc' },
      { name: 'Pollo Gus', code: 'gus' },
      { name: 'Menestras del negro', code: 'menestras' },
    ];
  }

  getRestaurantesToSelect(cadenas: Array<CadenaI>): Array<RestauranteI> {
    let codigoCadenas = [];
    codigoCadenas = cadenas.map((cadena) => cadena.code);
    if (cadenas.length > 0)
      return [
        { name: 'k001', code: 'k001' },
        { name: 't001', code: 't001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001', code: 'p001' },
        { name: 'p001*****', code: 'p001' },
      ];
    return [];
  }

  getMenuToSelectCheckbox(formularioFiltro: any): void {
    const body = {
      restaurantes: formularioFiltro.restaurantesSeleccionados,
      tiempo: {
        start: formularioFiltro.fechaInicio,
        end: formularioFiltro.fechaFin,
      },
    };

    this.menuList = [
      { name: 'Menu Uber', code: 'muber', select: false },
      { name: 'Otro Menu', code: 'motros', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
      { name: 'Menu peya', code: 'mpeya', select: false },
    ];
  }

  getCategoriasMenuToSelectCheckbox(
    menus: Array<optionsToSelectI>
  ): Array<optionsToSelectI> {
    console.log(menus);
    if (menus.length > 0) {
      return [
        {
          name: 'Categoria Uber',
          code: 'cu',
          parent: 'muber',
          select: false,
          allCompleteSubCategoria: false,
          children: [
            { name: 'Categoria Uber 1', code: 'cu1', select: false },
            { name: 'Categoria Uber 2', code: 'cu2', select: false },
            { name: 'Categoria Uber 3', code: 'cu3', select: false },
            { name: 'Categoria Uber 4', code: 'cu4', select: false },
            { name: 'Categoria Uber 5', code: 'cu5', select: false },
            { name: 'Categoria Uber 6', code: 'cu6', select: false },
            { name: 'Categoria Uber 7', code: 'cu7', select: false },
            { name: 'Categoria Uber 8', code: 'cu8', select: false },
            { name: 'Categoria Uber 9', code: 'cu9', select: false },
            { name: 'Categoria Uber 10', code: 'cu10', select: false },
            { name: 'Categoria Uber 11', code: 'cu11', select: false },
            { name: 'Categoria Uber 12', code: 'cu12', select: false },
            { name: 'Categoria Uber 13', code: 'cu13', select: false },
          ],
        },
        {
          name: 'Categoria Peya',
          code: 'cp',
          parent: 'mpeya',
          select: false,
          allCompleteSubCategoria: false,
          children: [
            { name: 'Categoria Peya 1', code: 'cp1', select: false },
            { name: 'Categoria Peya 2', code: 'cp2', select: false },
          ],
        },
        {
          name: 'Categoria Otros',
          code: 'co',
          parent: 'motros',
          select: false,
          allCompleteSubCategoria: false,
          children: [
            { name: 'Categoria Otros 1', code: 'co1', select: false },
            { name: 'Categoria Otros 2', code: 'co2', select: false },
            { name: 'Categoria Otros 3', code: 'co3', select: false },
          ],
        },
      ];
    } else {
      return [];
    }
  }

  getProductosCategoriasToSelectCheckbox(
    categorias: Array<optionsToSelectI>
  ): Array<optionsToSelectI> {
    console.log(categorias);
    if (categorias.length > 0) {
      return [
        {
          name: 'Producto Categoria Uber',
          code: 'pcu',
          parent: 'muber',
          select: false,
          allCompleteSubProducto: false,
          children: [
            { name: 'Producto Categoria Uber 1', code: 'pcu1', select: false },
            { name: 'Producto Categoria Uber 2', code: 'pcu1', select: false },
            { name: 'Producto Categoria Uber 3', code: 'pcu1', select: false },
            { name: 'Producto Categoria Uber 4', code: 'pcu1', select: false },
          ],
        },
        {
          name: 'Producto Categoria Peya',
          code: 'pcp',
          parent: 'mpeya',
          select: false,
          allCompleteSubProducto: false,
          children: [
            { name: 'Producto Categoria Peya 1', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 2', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            { name: 'Producto Categoria Peya 3', code: 'pcp1', select: false },
            {
              name: 'Producto Categoria Peya ***********',
              code: 'pcp1',
              select: false,
            },
          ],
        },
      ];
    } else {
      return [];
    }
  }

  getCanalesVentaToSelectCheckbox(): Array<optionsToSelectI> {
    return [
      { name: 'UBER', code: 'cvuber', select: false },
      { name: 'PEYA', code: 'cvpeya', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
      { name: 'OTROS', code: 'cvotros', select: false },
    ];
  }

  getRestaurantesToSelectCheckbox(
    cadenas: Array<CadenaI>
  ): Array<optionsToSelectI> {
    let codigoCadenas = [];
    codigoCadenas = cadenas.map((cadena) => cadena.code);
    if (cadenas.length > 0)
      return [
        { name: 'k001', code: 'k001', select: false },
        { name: 't001', code: 't001', select: false },
        { name: 'p001', code: 'p001', select: false },
      ];
    return [];
  }

  setNow() {
    let now = new Date();
    let hours = ('0' + now.getHours()).slice(-2);
    let minutes = ('0' + now.getMinutes()).slice(-2);
    return hours + ':' + minutes;
  }

  requestAggregators(lastConfiguration: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.httpClient
        .get<any>(`${environment.url}/aggregators`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${JSON.parse(token).accessToken}`,
          }),
        })
        .pipe(
          map((aggregators) => {
            const newConfiguration: any = {
              syncMaxPoint: false,
              syncTime: this.setNow(),
              newAggregators: [],
            };
            if (lastConfiguration) {
              if (lastConfiguration.last.syncMaxPoint) {
                aggregators.forEach((agg: any) => {
                  const aux = lastConfiguration.last.aggregators.find(
                    (e: any) => {
                      if (e.aggregator.code === agg.code) {
                        return e;
                      }
                    }
                  );
                  if (aux) {
                    newConfiguration.newAggregators.push({
                      name: aux.aggregator.name,
                      code: aux.aggregator.code,
                      time: lastConfiguration.last.syncTime,
                      select: false,
                    });
                    newConfiguration.syncMaxPoint = lastConfiguration.last.syncMaxPoint;
                    newConfiguration.syncTime = lastConfiguration.last.syncTime;
                  }
                });
              } else {
                aggregators.forEach((agg: any) => {
                  const aux = lastConfiguration.last.aggregators.find(
                    (e: any) => {
                      if (e.aggregator.code === agg.code) {
                        return e;
                      }
                    }
                  );
                  if (aux)
                    newConfiguration.newAggregators.push({
                      name: aux.aggregator.name,
                      code: aux.aggregator.code,
                      time: aux.syncTime,
                      select: false,
                    });
                });
              }

              return newConfiguration;
            } else {
              aggregators.forEach((agg: any) => {
                newConfiguration.newAggregators.push({
                  name: agg.name,
                  code: agg.code,
                  time: this.setNow(),
                  select: false,
                });
              });
              return newConfiguration;
            }
          }),
          catchError((err) => of(false))
        );
    }
    return of(null);
  }

  requestLastConfiguration(): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.httpClient.get<any>(
        `${environment.url}/configurations/last`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${JSON.parse(token).accessToken}`,
          }),
        }
      );
    }
    return of(null);
  }

  /* checkStatusAutenticacion(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    console.log('checkStatusAutenticacion');
    console.log(token);

    return this.httpClient
      .get<User>(`${environment.url}/account/my-account`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${JSON.parse(token).accessToken}`,
        }),
      })
      .pipe(
        tap((u) => (this.user = u)),
        map((u) => !!u),
        catchError((err) => of(false))
      );
  } */
}
