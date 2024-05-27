import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SincronizacionAutomaticaComponent } from './sincronizacion-automatica.component';

describe('SincronizacionAutomaticaComponent', () => {
  let component: SincronizacionAutomaticaComponent;
  let fixture: ComponentFixture<SincronizacionAutomaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SincronizacionAutomaticaComponent]
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
