import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  showSidevar: boolean = true;
  constructor(private router: Router) {}
  usersService = inject(UsersService);

  openCloseSidevar() {
    this.showSidevar = !this.showSidevar;
  }

  logOut() {
    this.usersService.clear();
    this.router.navigate(['/login']);
  }
}
