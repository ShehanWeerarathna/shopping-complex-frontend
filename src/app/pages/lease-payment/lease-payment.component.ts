import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LeasePayment } from 'src/app/common/common.types';
import { LeasePaymentService } from 'src/app/services/lease-payment.service';
const today: Date = new Date();
@Component({
  selector: 'app-lease-payment',
  templateUrl: './lease-payment.component.html',
  styleUrls: ['./lease-payment.component.css'],
})
export class LeasePaymentComponent implements OnInit {
  leaseAgreementId: number = 0;
  paymentIdParam: string | null = '';
  isNewPayment: boolean = false;
  isEditable: boolean = false;
  leasePayment: LeasePayment = {} as LeasePayment;

  paymentForm = new FormGroup({
    paymentDate: new FormControl<NgbDateStruct>(
      {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
      Validators.required
    ),
    amount: new FormControl(0, Validators.required),
    leaseAgreementId: new FormControl<number | null>(
      this.leaseAgreementId,
      Validators.required
    ),
  });

  constructor(
    private route: ActivatedRoute,
    private leasePaymentService: LeasePaymentService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.leaseAgreementId = Number(params.get('leaseAgreementId'));
      this.paymentIdParam = params.get('id');
      this.isNewPayment = this.paymentIdParam === 'new';
      if (!this.isNewPayment) {
        this.leasePaymentService
          .getLeasePaymentByIdAsync(Number(this.paymentIdParam))
          .subscribe((data) => {
            this.leasePayment = data;
            const agreementDate: NgbDateStruct = {
              year: new Date(data.paymentDate).getFullYear(),
              month: new Date(data.paymentDate).getMonth() + 1,
              day: new Date(data.paymentDate).getDate(),
            };
            this.paymentForm.setValue({
              paymentDate: agreementDate,
              amount: data.amount,
              leaseAgreementId: this.leaseAgreementId,
            });
          });
        this.isEditable = false;
        this.paymentForm.disable();
      }else{
        this.leasePaymentService.getLeasePaymentByIdAsync(0).subscribe(
          data => {
            this.leasePayment = data;
            const agreementDate: NgbDateStruct = {
              year: new Date(data.paymentDate).getFullYear(),
              month: new Date(data.paymentDate).getMonth() + 1,
              day: new Date(data.paymentDate).getDate(),
            };
            this.paymentForm.setValue({
              paymentDate: agreementDate,
              amount: data.amount,
              leaseAgreementId: this.leaseAgreementId,
            });
          }
        );
        this.isEditable = true;
        this.paymentForm.enable();
      }
    });
  }
}
