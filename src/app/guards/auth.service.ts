import {inject, Injectable} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {UsersService} from "../services/users.service";
import {User} from "../models/interfaces";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  checkAuthStatus(): boolean | Observable<boolean> {
    const usersService = inject(UsersService);
    const router = inject(Router);
    const user: User | undefined = usersService.currentUser;

    return usersService.checkStatusAutenticacion().pipe(
      tap((estaAutenticado) => {
        console.log('estaAutenticado: ' + estaAutenticado);
        if (!estaAutenticado) router.navigate(['/auth/login']);
      })
    );
  }

  logout() {
    localStorage.removeItem("token")
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const tokenAsObject = JSON.parse(token)
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(tokenAsObject.accessToken);
    return !isExpired;
  }
}
