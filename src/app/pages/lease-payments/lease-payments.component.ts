import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { storeNameSignal } from 'src/app/common/common.signals';
import { LeasePayment, PagedData } from 'src/app/common/common.types';
import { LeasePaymentService } from 'src/app/services/lease-payment.service';

@Component({
  selector: 'app-lease-payments',
  templateUrl: './lease-payments.component.html',
  styleUrls: ['./lease-payments.component.css'],
})
export class LeasePaymentsComponent implements OnInit {
  pagedList: PagedData<LeasePayment> = {} as PagedData<LeasePayment>;
  currentPage: number = 1;
  pageSize: number = 10;
  leaseAgreementId: number = 0;
  storeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private leasePaymentService: LeasePaymentService,
    private toastr: ToastrService
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.route.paramMap
    .subscribe({
      next: (params) => {
        this.leaseAgreementId = Number(params.get('leaseAgreementId'));
        this.refreshLeasePayments(this.leaseAgreementId);
      },
      error: (err) => {
        this.toastr.error(err.error);
      },
    });
  }

  // Get the lease payments for the selected lease agreement
  refreshLeasePayments(leaseAgreementId: number) {
    this.leasePaymentService
      .getLeasePaymentsAsync(this.currentPage, this.pageSize, leaseAgreementId)
      .subscribe({
        next: (leasePayments) => {
          this.pagedList = leasePayments;
          this.currentPage = leasePayments.currentPage;
          this.pageSize = leasePayments.pageSize;
        },
        error: (err) => {
          this.toastr.error(err.error);
        },
      });
  }
}
