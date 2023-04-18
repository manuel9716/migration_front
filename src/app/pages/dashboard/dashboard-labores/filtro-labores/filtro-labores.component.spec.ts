import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroLaboresComponent } from './filtro-labores.component';

describe('FiltroLaboresComponent', () => {
  let component: FiltroLaboresComponent;
  let fixture: ComponentFixture<FiltroLaboresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroLaboresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroLaboresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
