import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePaymentsComponent } from './maintenance-payments.component';

describe('MaintenancePaymentsComponent', () => {
  let component: MaintenancePaymentsComponent;
  let fixture: ComponentFixture<MaintenancePaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenancePaymentsComponent]
    });
    fixture = TestBed.createComponent(MaintenancePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
