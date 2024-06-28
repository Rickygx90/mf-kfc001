import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { menuItemI } from '../../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MenuDetailComponent } from '../menu-detail/menu-detail.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {
  menuItems: Array<menuItemI> | null = null;
  menuService = inject(MenuService);

  constructor(
    public dialog: MatDialog
  ) {}

  ngOnInit(): void{
    this.menuItems = this.menuService.getMenuItems('uber');
  }

  openMenuDetail(): void {
    const dialogRef = this.dialog.open(MenuDetailComponent, {
      height: '370px',
      width: '460px',
    });
    dialogRef.afterClosed().subscribe(() => {
     
    });
  }
}
