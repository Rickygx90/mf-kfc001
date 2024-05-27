import { Component, inject, OnInit } from '@angular/core';
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
import { AlertInfoComponent } from '../../shared/alert-info/alert-info.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

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
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    /* this.loginTokens = this.usersService.getItem('usuario');
    console.log(this.loginTokens);
    if (this.loginTokens && JSON.parse(this.loginTokens).isSuccess) {
      this.router.navigate(['/home/dashboard']);
    } */
  }

  onSubmit() {
    this.usersService.login(this.formularioLogin);
    console.log('usersService after')
    //if()
    //console.log(existToken)
    /* if(!existToken) {
      this.toastr.error('Usuario o contraseña son incorrectos', 'Error');
      this.formularioLogin.reset();
    } */
    /* if (this.loginTokens$) {
      this.router.navigate(['/home/dashboard']);
    } else {
      //this.openDialog()
      this.toastr.error('Usuario o contraseña son incorrectos', 'Error');
      this.formularioLogin.reset();
    } */
  }

  /* openDialog(): void {
    const dialogRef = this.dialog.open(AlertInfoComponent, {
      data: {
        title: 'error',
        content: 'El usuario o la contrasena ingresada son incorrectos',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.formularioLogin.reset();
    });
  } */
}
