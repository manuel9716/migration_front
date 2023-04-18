import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVentasComponent } from './dashboard-ventas.component';

describe('DashboardVentasComponent', () => {
  let component: DashboardVentasComponent;
  let fixture: ComponentFixture<DashboardVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
