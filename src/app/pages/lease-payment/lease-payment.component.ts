import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    amount: new FormControl(0,[Validators.required, Validators.min(1)]),
    
  });

  constructor(
    private route: ActivatedRoute,
    private leasePaymentService: LeasePaymentService,
    private router: Router
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
              amount: data.amount
            });
          });
        this.isEditable = false;
        this.paymentForm.disable();
      } else {
        this.leasePaymentService
          .getLeasePaymentByIdAsync(0)
          .subscribe((data) => {
            this.leasePayment = data;
            const agreementDate: NgbDateStruct = {
              year: new Date(data.paymentDate).getFullYear(),
              month: new Date(data.paymentDate).getMonth() + 1,
              day: new Date(data.paymentDate).getDate(),
            };
            this.paymentForm.setValue({
              paymentDate: agreementDate,
              amount: data.amount
            });
          });
        this.isEditable = true;
        this.paymentForm.enable();
      }
    });
  }
  editForm(){
    this.isEditable = true;
    this.paymentForm.enable();
  }
  async deleteProduct(){
    if(this.leasePayment.leasePaymentId === 0){
      return;
    }
    if(confirm(`Are you sure you want to delete this payment?`)){
      this.leasePaymentService.deleteLeasePayment(this.leasePayment.leasePaymentId).subscribe((data) => {
        this.router.navigate([`/lease-payments/${this.leaseAgreementId}`]);
      });
    }
  }
  submitForm(){
   this.paymentForm.markAllAsTouched();
   if(this.paymentForm.invalid){
     return;
   }
   const leasePayment:LeasePayment = {
      leasePaymentId: this.leasePayment.leasePaymentId,
      leaseAgreementId: this.leaseAgreementId,
      paymentDate: `${this.paymentForm.value.paymentDate?.year}-${this.paymentForm.value.paymentDate?.month}-${this.paymentForm.value.paymentDate?.day}`,
      amount: this.paymentForm.value.amount ??0
    }
    this.saveLeasePayment(leasePayment);
  }

  saveLeasePayment(leasePayment:LeasePayment){
    if(leasePayment.leasePaymentId ===0){
      this.leasePaymentService.createLeasePayment(leasePayment).subscribe((data) => {
        const agreementDate: NgbDateStruct = {
          year: new Date(data.paymentDate).getFullYear(),
          month: new Date(data.paymentDate).getMonth() + 1,
          day: new Date(data.paymentDate).getDate(),
        };
        this.paymentForm.setValue({
          paymentDate: agreementDate,
          amount: data.amount
        });
        this.isEditable = false;
        this.paymentForm.disable();
      });
    }else{
      this.leasePaymentService.updateLeasePayment(leasePayment).subscribe((data) => {
        const agreementDate: NgbDateStruct = {
          year: new Date(data.paymentDate).getFullYear(),
          month: new Date(data.paymentDate).getMonth() + 1,
          day: new Date(data.paymentDate).getDate(),
        };
        this.paymentForm.setValue({
          paymentDate: agreementDate,
          amount: data.amount
        });
        this.isEditable = false;
        this.paymentForm.disable();
      });
    }
  }
}
