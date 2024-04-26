import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() { 
    this.baseUrl = '';
  }

  register(formValue: any) {
    console.log(formValue)
    /* return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/rtegister`, formValue)
    ) */
  }

  login(formValue: any) {
    console.log(formValue)
    if(formValue.username === 'admin' && formValue.password === '1234') {
      console.log(true)
      this.setItem('token', JSON.stringify({
        isSuccess: true,
        token: '12345678',
        franchise: 'f2c13a02-3cb5-4781-9e10-d3f1519c51e2',
        country: '342ca602-fb3e-0749-7500-93de9653444c'
      }))
      return this.getItem('token');
    }
    return null;
    /* return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/login`, formValue)
    ) */
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
    localStorage.clear();
  }
}
