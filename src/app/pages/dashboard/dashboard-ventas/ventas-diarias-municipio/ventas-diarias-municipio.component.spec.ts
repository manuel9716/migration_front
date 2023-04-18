import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasDiariasMunicipioComponent } from './ventas-diarias-municipio.component';

describe('VentasDiariasMunicipioComponent', () => {
  let component: VentasDiariasMunicipioComponent;
  let fixture: ComponentFixture<VentasDiariasMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasDiariasMunicipioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasDiariasMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
