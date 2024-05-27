import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debe retornar un string con los datos de inicio de sesion del usuario.', (done: DoneFn) => {
    let sesionData = service.login({username: 'admin', password: '1234'});
    expect(sesionData).toBeTruthy();
    if(sesionData)
    expect(JSON.parse(sesionData)).toBeTruthy();
    done();
  });

  it('Debe retornar null si los datos del usuario son incorrectos', (done: DoneFn) => {
    let sesionData = service.login({username: 'admin123', password: '4321'});
    expect(sesionData).toBeNull();
    done();
  });
});
