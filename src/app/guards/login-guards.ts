import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UsersService } from '../services/users.service';

function checkAuthStatus(): boolean | Observable<boolean> {
  const usersService = inject(UsersService);
  const router = inject(Router);

  return usersService.checkStatusAutenticacion().pipe(
    tap((estaAutenticado) => {
      console.log('estaAutenticado: ' + estaAutenticado);
      if (estaAutenticado) {
        router.navigate(['/home/dashboard']);
      }
    }),
    map((estaAutenticado) => !estaAutenticado)
  );
}

export const LoginGuard = () => {
  console.log('LoginGuard!!!');
  return checkAuthStatus();
};
