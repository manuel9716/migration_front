import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSolMunicipioComponent } from './historial-sol-municipio.component';

describe('HistorialSolMunicipioComponent', () => {
  let component: HistorialSolMunicipioComponent;
  let fixture: ComponentFixture<HistorialSolMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialSolMunicipioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialSolMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
