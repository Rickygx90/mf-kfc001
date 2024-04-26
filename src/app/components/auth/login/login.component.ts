import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { AlertInfoComponent } from '../../shared/alert-info/alert-info.component';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSlideToggleModule]
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog) {
  }
  get username(){
    return this.formularioLogin.get('username') as FormControl
  }
  get password(){
    return this.formularioLogin.get('password') as FormControl
  }
  loginInfo: string | null = '';
  login:any = {};
  usersService = inject(UsersService);
  formularioLogin = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    console.log(this.usersService.getItem('token'));
    this.loginInfo = this.usersService.getItem('token');
    if (this.loginInfo && JSON.parse(this.loginInfo).isSuccess) {
      this.router.navigate(['/home/dashboard']);
    }
  }

  onSubmit() {
    this.loginInfo = this.usersService.login(this.formularioLogin.value);
    if(this.loginInfo && JSON.parse(this.loginInfo).isSuccess) {
      this.router.navigate(['/home/dashboard']);
    } else {
      this.openDialog()
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AlertInfoComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.formularioLogin.reset();
    });
  }
}
