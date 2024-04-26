import { Component } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-info',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './alert-info.component.html',
  styleUrl: './alert-info.component.css'
})
export class AlertInfoComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertInfoComponent>
  ) {}
}
