import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { storeNameSignal } from 'src/app/common/common.signals';
import { MaintenancePayment } from 'src/app/common/common.types';
import { MaintenancePaymentService } from 'src/app/services/maintenance-payment.service';

const today: Date = new Date();

@Component({
  selector: 'app-maintenance-payment',
  templateUrl: './maintenance-payment.component.html',
  styleUrls: ['./maintenance-payment.component.css'],
})
export class MaintenancePaymentComponent {
  maintenanceContractId: number = 0;
  paymentIdParam: string | null = '';
  isNewPayment: boolean = false;
  isEditable: boolean = false;
  maintenancePayment: MaintenancePayment = {} as MaintenancePayment;
  storeName: string = '';

  paymentForm = new FormGroup({
    paymentDate: new FormControl<NgbDateStruct>(this.formatter.parse(today.toISOString()) as NgbDateStruct,
      Validators.required
    ),
    amount: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private route: ActivatedRoute,
    private maintenancePaymentService: MaintenancePaymentService,
    private router: Router,
    public formatter: NgbDateParserFormatter,
    private toastr: ToastrService
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.refreshPageData();
  }

  private refreshPageData() {
    this.route.paramMap.subscribe((params) => {
      this.maintenanceContractId = Number(params.get('maintenanceContractId'));
      this.paymentIdParam = params.get('id');
      this.isNewPayment = this.paymentIdParam === 'new';
      if (!this.isNewPayment) {
        this.maintenancePaymentService
          .getMaintenancePaymentByIdAsync(Number(this.paymentIdParam))
          .subscribe({
            next: (data) => {
              this.maintenancePayment = data;
              const paymentDate = this.formatter.parse(data.paymentDate);
              this.paymentForm.setValue({
                paymentDate: paymentDate,
                amount: data.amount,
              });
            },
            error: (error) => {
              this.toastr.error(error.error.Message);
            }
          });
        this.isEditable = false;
        this.paymentForm.disable();
      } else {
        this.maintenancePaymentService
          .getMaintenancePaymentByIdAsync(0)
          .subscribe({
            next: (data) => {
              this.maintenancePayment = data;
              const paymentDate = this.formatter.parse(data.paymentDate);
              this.paymentForm.setValue({
                paymentDate: paymentDate,
                amount: data.amount,
              });
            },
            error: (error) => {
              this.toastr.error(error.error.Message);
            }
          });
        this.isEditable = true;
        this.paymentForm.enable();
      }
    });
  }

  // Enable editing of the form
  editForm() {
    this.isEditable = true;
    this.paymentForm.enable();
  }

  // Delete the payment
  deletePayment() {
    if (this.maintenancePayment.maintenancePaymentId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this payment?`)) {
      this.maintenancePaymentService
        .deleteMaintenancePayment(this.maintenancePayment.maintenancePaymentId)
        .subscribe({
          next: (data) => {
            this.router.navigate([
              `/maintenance-payments/${this.maintenanceContractId}`,
            ]);
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          }
        })
    }
  }

  // Save the payment
  submitForm() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) {
      return;
    }
    const maintenancePayment: MaintenancePayment = {
      maintenancePaymentId: this.maintenancePayment.maintenancePaymentId,
      maintenanceContractId: this.maintenanceContractId,
      paymentDate: this.formatter.format(this.paymentForm.value.paymentDate as NgbDateStruct),
      amount: this.paymentForm.value.amount ?? 0,
    };
    this.saveMaintenancePayment(maintenancePayment);
  }

  // Save the payment
  saveMaintenancePayment(maintenancePayment: MaintenancePayment) {
    if (maintenancePayment.maintenancePaymentId === 0) {
      this.maintenancePaymentService
        .createMaintenancePayment(maintenancePayment)
        .subscribe({
          next: (data) => {
            this.maintenancePayment = data;
            const paymentDate = this.formatter.parse(data.paymentDate);
            this.paymentForm.setValue({
              paymentDate: paymentDate,
              amount: data.amount,
            });
            this.isEditable = false;
            this.paymentForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          }
        });
    } else {
      this.maintenancePaymentService
        .updateMaintenancePayment(maintenancePayment)
        .subscribe({
          next: (data) => {
            this.maintenancePayment = data;
            const paymentDate = this.formatter.parse(data.paymentDate);
            this.paymentForm.setValue({
              paymentDate: paymentDate,
              amount: data.amount,
            });
            this.isEditable = false;
            this.paymentForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          }
        });
    }
  }
}
