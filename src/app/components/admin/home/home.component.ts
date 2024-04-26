import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  loginInfo: string | null = null;
  usersService = inject(UsersService);

  ngOnInit(): void {
    this.loginInfo = this.usersService.getItem('token');
    console.log(this.loginInfo);
    if (!this.loginInfo || !JSON.parse(this.loginInfo).isSuccess) {
      this.router.navigate(['/login']);
    }
  }
}
