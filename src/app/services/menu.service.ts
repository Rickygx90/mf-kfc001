import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Cadena, optionsToSelect } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  //private httpClient = inject(HttpClient);
  private baseUrl: string;
  public menuList: Array<optionsToSelect> = [];
  public categoriasMenu: Array<any> = [];

  constructor() {
    this.baseUrl = '';
  }

  getMenuItems(channelName: string) {
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

  getCadenas() {
    return [
      { name: 'Tropiburger', code: 'tropi' },
      { name: 'KFC', code: 'kfc' },
      { name: 'Pollo Gus', code: 'gus' },
      { name: 'Menestras del negro', code: 'menestras' },
    ];
  }

  getRestaurantes(cadenas: Array<Cadena>) {
    let codigoCadenas = [];
    codigoCadenas = cadenas.map((cadena) => cadena.code);
    if(cadenas.length > 0) 
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

  getMenuList(formularioFiltro: any) {
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

  getCategoriasMenu(menus: Array<any>) {
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

  getProductosCategorias(categorias: Array<any>) {
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
            { name: 'Producto Categoria Peya ***********', code: 'pcp1', select: false },
          ],
        },
      ];
    } else {
      return [];
    }
  }

  getCanalesVenta() {
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
}
