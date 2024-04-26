import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioMenuComponent } from './envio-menu.component';

describe('EnvioMenuComponent', () => {
  let component: EnvioMenuComponent;
  let fixture: ComponentFixture<EnvioMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvioMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
