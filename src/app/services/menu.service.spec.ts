import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debe retornar un string con los datos de inicio de sesion del usuario.', (done: DoneFn) => {
    const menuItems = service.getMenuItems('uber');
    expect(menuItems).toBeTruthy();
    expect(menuItems.length).toBeGreaterThan(0);
    done();
  });
});
