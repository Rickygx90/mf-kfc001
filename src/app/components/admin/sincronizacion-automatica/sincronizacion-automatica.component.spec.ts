import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SincronizacionAutomaticaComponent } from './sincronizacion-automatica.component';
import { RouterModule } from "@angular/router";

describe('SincronizacionAutomaticaComponent', () => {
  let component: SincronizacionAutomaticaComponent;
  let fixture: ComponentFixture<SincronizacionAutomaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SincronizacionAutomaticaComponent, HttpClientModule, RouterModule.forRoot([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SincronizacionAutomaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
