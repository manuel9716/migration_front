import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimosCuatroMesesComponent } from './ultimos-cuatro-meses.component';

describe('UltimosCuatroMesesComponent', () => {
  let component: UltimosCuatroMesesComponent;
  let fixture: ComponentFixture<UltimosCuatroMesesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UltimosCuatroMesesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimosCuatroMesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
