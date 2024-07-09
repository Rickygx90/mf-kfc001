import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.css',
})
export class MenuDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<MenuDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //private messageService: MessageService
  ) {}

}
