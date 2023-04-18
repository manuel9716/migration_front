import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRetirsoDashboardComponent } from './view-retirso-dashboard.component';

describe('ViewRetirsoDashboardComponent', () => {
  let component: ViewRetirsoDashboardComponent;
  let fixture: ComponentFixture<ViewRetirsoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRetirsoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRetirsoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
