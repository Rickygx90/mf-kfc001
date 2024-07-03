import { Component } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.css',
})
export class MenuDetailComponent {}
