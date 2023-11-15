import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeasePayment, PagedData } from 'src/app/common/common.types';
import { LeasePaymentService } from 'src/app/services/lease-payment.service';
import { storeNameSignal } from '../store-list/store-list.signals';

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
    private leasePaymentService: LeasePaymentService
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.leaseAgreementId = Number(params.get('leaseAgreementId'));
      this.refreshLeasePayments(this.leaseAgreementId);
    });
  }

  refreshLeasePayments(leaseAgreementId: number) {
    this.leasePaymentService
      .getLeasePaymentsAsync(this.currentPage, this.pageSize, leaseAgreementId)
      .subscribe((leasePayments) => {
        this.pagedList = leasePayments;
        this.currentPage = leasePayments.currentPage;
        this.pageSize = leasePayments.pageSize;
      });
  }
}
