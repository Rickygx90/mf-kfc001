import { Component, OnInit, inject } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { menuItemI } from '../../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MenuDetailComponent } from '../menu-detail/menu-detail.component';
import { Observable } from 'rxjs';

interface menuObject {
  data: menuItemI[];
  total_records: number;
  currentPage: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public menuItems$!: Observable<menuObject>;
  public rows: number = 24;
  public data!: menuItemI[];
  public total_records!: number;
  menuService = inject(MenuService);
  currentPage: number = 0;
  idInterval: any;

  public value = [{ value: 15, color: '#34d399' }];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMenus(this.currentPage);
    this.idInterval = setInterval(() => {
      this.getMenus(this.currentPage);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.idInterval);
  }

  getTipoEjecucion(status: string): string {
    switch (status) {
      case 'MANUAL': {
        return 'Manual';
      }
      case 'AUTOMATIC': {
        return 'Automático';
      }
      default: {
        return 'indeterminado';
      }
    }
  }

  getEstado(status: string): string {
    switch (status) {
      case 'CREATED': {
        return 'Creado';
      }
      case 'SYNCING': {
        return 'Sincronizando';
      }
      case 'FINISHED': {
        return 'Finalizado';
      }
      default: {
        return 'indeterminado';
      }
    }
  }

  getMenus(currentPage: number) {
    this.menuService.getMenuItems(currentPage, this.rows).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          this.data = response.data.map((e: any) => {
            let tt = this.formatearTiempoTranscurrido(
              e.start_time,
              e.end_time,
              e.status
            );
            return {
              ...e,
              status: this.getEstado(e.status),
              mode: this.getTipoEjecucion(e.mode),
              syncros_id: e.syncros_id.slice(0, e.syncros_id.indexOf('-')),
              tt,
            };
          });
          this.total_records = response.total_records;
        }
      },
      error: (err) => {
        console.log(err);
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
    console.log(event);
    this.currentPage = event.page;
    //this.menuItems$ = this.menuService.getMenuItems(event.page, event.rows);
    this.menuService.getMenuItems(event.page, event.rows).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          this.data = response.data.map((e: any) => {
            let tt = this.formatearTiempoTranscurrido(
              e.start_time,
              e.end_time,
              e.status
            );
            return {
              ...e,
              status: this.getEstado(e.status),
              syncros_id: e.syncros_id.slice(0, e.syncros_id.indexOf('-')),
              tt,
            };
          });
          this.total_records = response.total_records;
        }
      },
      error: (err) => {
        console.log(err);
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
