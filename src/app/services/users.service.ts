import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private user?: User;
  constructor(private router: Router) {}

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    //structuredClone(this.user)
    return { ...this.user };
  }

  getToken(formValue: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/auth/login`, {
      username: formValue.username,
      password: formValue.password,
    });
  }

  checkStatusAutenticacion(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    return this.httpClient
      .get<User>(`${environment.url}/account/my-account`)
      .pipe(
        tap((u) => (this.user = u)),
        map((u) => !!u),
        catchError((err) => of(false))
      );
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    this.user = undefined;
    localStorage.clear();
  }
}
