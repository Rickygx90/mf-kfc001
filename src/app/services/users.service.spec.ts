import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debe retornar el accessToken si el usuario y contrasena son correctos.', (done: DoneFn) => {
    service.getToken({ username: 'admin', password: '12345' }).subscribe({
      next: (token) => {
        expect(!!token.accessToken).toBeTruthy();
      },
    });
    done();
  });

  it('Debe retornar error si los datos del usuario son incorrectos', (done: DoneFn) => {
    service.getToken({ username: 'admin123', password: '4321' }).subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toEqual(401);
      },
    });
    done();
  });
});
