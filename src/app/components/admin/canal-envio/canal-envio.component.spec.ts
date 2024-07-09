import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CanalEnvioComponent } from './canal-envio.component';
import { HttpClientModule } from '@angular/common/http';

describe('CanalEnvioComponent', () => {
  let component: CanalEnvioComponent;
  let fixture: ComponentFixture<CanalEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanalEnvioComponent, MatDialogModule, HttpClientModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CanalEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
