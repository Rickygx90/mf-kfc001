import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
  currentPage: number;
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
  currentPage: number = 0;
  idInterval: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    //this.menuItems$ = this.menuService.getMenuItems(0, this.rows);
    this.getMenus(this.currentPage);
    this.idInterval = setInterval(() => {
      this.getMenus(this.currentPage);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.idInterval);
  }

  getMenus(currentPage: number) {
    this.menuService.getMenuItems(currentPage, this.rows).subscribe({
      next: (response) => {
        console.log(response)
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
    this.currentPage = event.page;
    //this.menuItems$ = this.menuService.getMenuItems(event.page, event.rows);
    this.menuService.getMenuItems(event.page, event.rows).subscribe({
      next: (response) => {
        //console.log(response);
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
    console.log(id);
    const dialogRef = this.dialog.open(MenuDetailComponent, {
      data: id,
      height: '380px',
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
}
