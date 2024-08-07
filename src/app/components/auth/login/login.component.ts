import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import {UsersService} from '../../../services/users.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
        this.usersService.checkStatusAutenticacion()
          .subscribe({
            next: data => {
              if (data) {
                this.router.navigate(['/home/dashboard']);
                console.log("logged");
              }
            },
            error: err => {
              console.log("error while logging", err);
            }
          })
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
