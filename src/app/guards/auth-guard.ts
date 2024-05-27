import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/interfaces';

function checkAuthStatus(): boolean | Observable<boolean> {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const user: User | undefined = usersService.currentUser;

  return usersService.checkStatusAutenticacion().pipe(
    tap((estaAutenticado) => {
      console.log('estaAutenticado: ' + estaAutenticado);
      if (!estaAutenticado) router.navigate(['/login']);
    })
  );
}

export const AuthGuard = () => {
  console.log('AuthGuard!!!');
  return checkAuthStatus();
};
