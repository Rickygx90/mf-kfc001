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
        this.data = response.data.map((e: any) => {
          let tt = this.formatearTiempoTranscurrido(
            e.start_time,
            e.end_time,
            e.status
          );
          return {
            ...e,
            tt,
          };
        });
        this.total_records = response.total_records;
        this.showLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
      },
      complete: () => {},
    });
  }

  formatearTiempoTranscurrido = (
    start_time: string,
    end_time: string,
    status: string
  ) => {
    let ms =
      status === 'FINISHED'
        ? new Date(end_time).getTime() - new Date(start_time).getTime()
        : new Date().getTime() - new Date(start_time).getTime();
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let tt = '';
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    if (hours > 0) {
      tt = this.padToTwoDigits(hours) + 'h ';
    }
    if (minutes > 0) {
      tt = tt + this.padToTwoDigits(minutes) + 'm ';
    }
    if (seconds > 0) {
      tt = tt + this.padToTwoDigits(seconds) + 's ';
    }
    return tt;
  };

  padToTwoDigits = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  paginate(event: any) {
    this.showLoading = true;
    console.log(event);
    this.currentPage = event.page;
    //this.menuItems$ = this.menuService.getMenuItems(event.page, event.rows);
    this.menuService.getMenuItems(event.page, event.rows).subscribe({
      next: (response) => {
        this.data = response.data.map((e: any) => {
          let tt = this.formatearTiempoTranscurrido(
            e.start_time,
            e.end_time,
            e.status
          );
          return {
            ...e,
            tt,
          };
        });
        this.total_records = response.total_records;
        this.showLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
      },
      complete: () => {},
    });
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
