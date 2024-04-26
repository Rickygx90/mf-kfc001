import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {
  menuItems: Array<any> | null = null;
  menuService = inject(MenuService);
  ngOnInit(): void{
    this.menuItems = this.menuService.getMenuItems('uber');
  }

}
