import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from "@angular/router";
import { EnvioMenuComponent } from './envio-menu.component';
import { HttpClientModule } from '@angular/common/http';

describe('EnvioMenuComponent', () => {
  let component: EnvioMenuComponent;
  let fixture: ComponentFixture<EnvioMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioMenuComponent, RouterModule.forRoot([]), HttpClientModule]
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
