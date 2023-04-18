import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialEstadoSolicitudesComponent } from './historial-estado-solicitudes.component';

describe('HistorialEstadoSolicitudesComponent', () => {
  let component: HistorialEstadoSolicitudesComponent;
  let fixture: ComponentFixture<HistorialEstadoSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialEstadoSolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialEstadoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
