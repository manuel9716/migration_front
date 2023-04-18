import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRetiroComponent } from './filtro-retiro.component';

describe('FiltroRetiroComponent', () => {
  let component: FiltroRetiroComponent;
  let fixture: ComponentFixture<FiltroRetiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroRetiroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
