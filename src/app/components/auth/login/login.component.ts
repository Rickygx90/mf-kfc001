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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,
  ],
})
export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
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
    Swal.fire({
      title: '<div class="loader"></div>',
      showConfirmButton: false,
      width: 110,
    });
    this.usersService.getToken(this.formularioLogin.value).subscribe({
      next: (token) => {
        localStorage.setItem('token', JSON.stringify(token));
        this.router.navigate(['/home/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Usuario o contraseña son incorrectos', 'Error');
        this.formularioLogin.reset();
        Swal.close();
      },
      complete: () => {
        console.info('complete');
        Swal.close();
      },
    });
  }
}
