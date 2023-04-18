import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipiosVsRetirosComponent } from './municipios-vs-retiros.component';

describe('MunicipiosVsRetirosComponent', () => {
  let component: MunicipiosVsRetirosComponent;
  let fixture: ComponentFixture<MunicipiosVsRetirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipiosVsRetirosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipiosVsRetirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
