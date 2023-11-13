import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePaymentComponent } from './maintenance-payment.component';

describe('MaintenancePaymentComponent', () => {
  let component: MaintenancePaymentComponent;
  let fixture: ComponentFixture<MaintenancePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenancePaymentComponent]
    });
    fixture = TestBed.createComponent(MaintenancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
