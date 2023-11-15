import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MaintenancePayment } from 'src/app/common/common.types';
import { MaintenancePaymentService } from 'src/app/services/maintenance-payment.service';

const today: Date = new Date();

@Component({
  selector: 'app-maintenance-payment',
  templateUrl: './maintenance-payment.component.html',
  styleUrls: ['./maintenance-payment.component.css']
})
export class MaintenancePaymentComponent {
  maintenanceContractId: number = 0;
  paymentIdParam: string | null = '';
  isNewPayment: boolean = false;
  isEditable: boolean = false;
  maintenancePayment: MaintenancePayment = {} as MaintenancePayment;

  paymentForm = new FormGroup({
    paymentDate: new FormControl<NgbDateStruct>(
      {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
      Validators.required
    ),
    amount: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private route: ActivatedRoute,
    private maintenancePaymentService: MaintenancePaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.maintenanceContractId = Number(params.get('maintenanceContractId'));
      this.paymentIdParam = params.get('id');
      this.isNewPayment = this.paymentIdParam === 'new';
      if (!this.isNewPayment) {
        this.maintenancePaymentService
          .getMaintenancePaymentByIdAsync(Number(this.paymentIdParam))
          .subscribe((data) => {
            this.maintenancePayment = data;
            const agreementDate: NgbDateStruct = {
              year: new Date(data.paymentDate).getFullYear(),
              month: new Date(data.paymentDate).getMonth() + 1,
              day: new Date(data.paymentDate).getDate(),
            };
            this.paymentForm.setValue({
              paymentDate: agreementDate,
              amount: data.amount,
            });
          });
        this.isEditable = false;
        this.paymentForm.disable();
      } else {
        this.maintenancePaymentService
          .getMaintenancePaymentByIdAsync(0)
          .subscribe((data) => {
            this.maintenancePayment = data;
            const agreementDate: NgbDateStruct = {
              year: new Date(data.paymentDate).getFullYear(),
              month: new Date(data.paymentDate).getMonth() + 1,
              day: new Date(data.paymentDate).getDate(),
            };
            this.paymentForm.setValue({
              paymentDate: agreementDate,
              amount: data.amount,
            });
          });
        this.isEditable = true;
        this.paymentForm.enable();
      }
    });
  }

  editForm() {
    this.isEditable = true;
    this.paymentForm.enable();
  }

  async deleteProduct() {
    if (confirm('Are you sure you want to delete this payment?')) {
      await this.maintenancePaymentService
        .deleteMaintenancePayment(this.maintenancePayment.maintenancePaymentId)
        .toPromise();
      this.router.navigate([
        `/maintenance-payments/${this.maintenanceContractId}`,
      ]);
    }
  }

  submitForm() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) {
      return;
    }
    const maintenancePayment: MaintenancePayment = {
      maintenancePaymentId: this.maintenancePayment.maintenancePaymentId,
      maintenanceContractId: this.maintenanceContractId,
      paymentDate: `${this.paymentForm.value.paymentDate?.year}-${this.paymentForm.value.paymentDate?.month}-${this.paymentForm.value.paymentDate?.day}`,
      amount: this.paymentForm.value.amount ?? 0,
    };
    this.saveMaintenancePayment(maintenancePayment);
  }

  saveMaintenancePayment(maintenancePayment: MaintenancePayment) {
    if (this.isNewPayment) {
      this.maintenancePaymentService
        .createMaintenancePayment(maintenancePayment)
        .subscribe((data) => {
          this.maintenancePayment = data;
          const agreementDate: NgbDateStruct = {
            year: new Date(data.paymentDate).getFullYear(),
            month: new Date(data.paymentDate).getMonth() + 1,
            day: new Date(data.paymentDate).getDate(),
          };
          this.paymentForm.setValue({
            paymentDate: agreementDate,
            amount: data.amount,
          });
          this.isEditable = false;
          this.paymentForm.disable();
        });
    } else {
      this.maintenancePaymentService
        .updateMaintenancePayment(maintenancePayment)
        .subscribe((data) => {
          this.maintenancePayment = data;
          const agreementDate: NgbDateStruct = {
            year: new Date(data.paymentDate).getFullYear(),
            month: new Date(data.paymentDate).getMonth() + 1,
            day: new Date(data.paymentDate).getDate(),
          };
          this.paymentForm.setValue({
            paymentDate: agreementDate,
            amount: data.amount,
          });
          this.isEditable = false;
          this.paymentForm.disable();
        });
    }
  }
}
