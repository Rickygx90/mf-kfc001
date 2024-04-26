import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalEnvioComponent } from './canal-envio.component';

describe('CanalEnvioComponent', () => {
  let component: CanalEnvioComponent;
  let fixture: ComponentFixture<CanalEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanalEnvioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanalEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
