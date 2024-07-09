import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
  ],
  providers: [MessageService],
})
export class LoginComponent {
  showLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}
  get username() {
    return this.formularioLogin.get('username') as FormControl;
  }
  get password() {
    return this.formularioLogin.get('password') as FormControl;
  }
  public loginTokens$!: Observable<any>;
  login: any = {};
  usersService = inject(UsersService);
  formularioLogin = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.showLoading = true;
    this.usersService.getToken(this.formularioLogin.value).subscribe({
      next: (token) => {
        console.log(token)
        localStorage.setItem('token', JSON.stringify(token));
        this.router.navigate(['/home/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this.showLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña son incorrectos',
        });
        this.formularioLogin.reset();
      },
      complete: () => {
        this.showLoading = false;
      },
    });
  }
}
