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
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
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
    MatSlideToggleModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService]
})
export class LoginComponent {

  visible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
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

  showDialog() {
    this.visible = true;
  }

  onSubmit() {
    /* Swal.fire({
      title: '<div class="loader"></div>',
      showConfirmButton: false,
      width: 110,
    }); */

    
    this.usersService.getToken(this.formularioLogin.value).subscribe({
      next: (token) => {
        localStorage.setItem('token', JSON.stringify(token));
        this.router.navigate(['/home/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña son incorrectos',
        });
        this.formularioLogin.reset();
        //Swal.close();
      },
      complete: () => {
        console.info('complete');
        //Swal.close();
      },
    });
  }
}
