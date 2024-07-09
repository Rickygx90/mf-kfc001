import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FilterMenuComponent } from './filter-menu.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('FilterMenuComponent', () => {
  let component: FilterMenuComponent;
  let fixture: ComponentFixture<FilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterMenuComponent, MatDialogModule, HttpClientModule],
      providers: [{ provide: MatDialogRef, useValue: {} }, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
