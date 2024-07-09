import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { menuItemI } from '../../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MenuDetailComponent } from '../menu-detail/menu-detail.component';
import { Observable } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';

interface menuObject {
  data: menuItemI[];
  total_records: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NavbarComponent, PaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public menuItems$!: Observable<menuObject>;
  public rows: number = 10;
  public data!: menuItemI[];
  public total_records!: number;
  showLoading: boolean = true;
  menuService = inject(MenuService);
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    //this.menuItems$ = this.menuService.getMenuItems(0, this.rows);
    this.menuService.getMenuItems(0, this.rows).subscribe({
      next: (response) => {
        console.log(response);
        this.data = response.data;
        this.total_records = response.total_records;
        this.showLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
      },
      complete: () => {},
    });
  }

  paginate(event: any) {
    this.showLoading = true;
    console.log(event);
    //this.menuItems$ = this.menuService.getMenuItems(event.page, event.rows);
    this.menuService.getMenuItems(event.page, event.rows).subscribe({
      next: (response) => {
        console.log(response);
        this.data = response.data;
        this.total_records = response.total_records;
        this.showLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
      },
      complete: () => {},
    });
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }

  openMenuDetail(id: string): void {
    console.log(id)
    const dialogRef = this.dialog.open(MenuDetailComponent, {
      data: id,
      height: '180px',
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
}
