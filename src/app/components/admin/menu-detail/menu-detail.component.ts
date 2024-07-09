import { Component, OnInit, Inject, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MenuService } from '../../../services/menu.service';
import { menuDetail } from '../../../models/interfaces';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.css',
})
export class MenuDetailComponent implements OnInit {
  showLoading: boolean = true;
  menuService = inject(MenuService);
  menuDetail!: menuDetail;
  constructor(
    public dialogRef: MatDialogRef<MenuDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //private messageService: MessageService
  ) {}

  ngOnInit(): void {
    //this.menuItems$ = this.menuService.getMenuItems(0, this.rows);
    this.menuService.getDetailMenu(this.data).subscribe({
      next: (response) => {
        console.log(response);
        
        this.showLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
      },
      complete: () => {},
    });
  }
}
