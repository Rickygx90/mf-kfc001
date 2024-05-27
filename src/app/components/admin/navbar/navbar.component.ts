import { Component, inject } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  usersService = inject(UsersService);
  loginInfo: string | null = null;
  username: string = '';
  rol: string = '';

  get getUser():User | undefined{
    return this.usersService.currentUser;
  }
  
}
