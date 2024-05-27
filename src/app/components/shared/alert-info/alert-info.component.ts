import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-alert-info',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './alert-info.component.html',
  styleUrl: './alert-info.component.css'
})
export class AlertInfoComponent implements OnInit {
  title: string = '';
  content: string = '';
  constructor(
    public dialogRef: MatDialogRef<AlertInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.content = this.data.content;
  }
}
