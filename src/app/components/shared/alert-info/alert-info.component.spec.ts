import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AlertInfoComponent } from './alert-info.component';

describe('AlertInfoComponent', () => {
  let component: AlertInfoComponent;
  let fixture: ComponentFixture<AlertInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertInfoComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
