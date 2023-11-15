import { Component, OnInit } from '@angular/core';
import { storeNameSignal } from 'src/app/common/common.signals';
import { LeaseAgreement, PagedData } from 'src/app/common/common.types';
import { LeaseAgreementService } from 'src/app/services/lease-agreement.service';

@Component({
  selector: 'app-lease-agreements',
  templateUrl: './lease-agreements.component.html',
  styleUrls: ['./lease-agreements.component.css'],
})
export class LeaseAgreementsComponent implements OnInit {
  pagedList: PagedData<LeaseAgreement> = {} as PagedData<LeaseAgreement>;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private leaseAgreementService: LeaseAgreementService) {}

  ngOnInit(): void {
    this.refreshLeaseAgreementList();
  }

  // Refresh the lease agreement list.
  refreshLeaseAgreementList() {
    this.leaseAgreementService
      .getLeaseAgreementsAsync(this.currentPage, this.pageSize)
      .subscribe((data) => {
        this.pagedList = data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
      });
  }

  // Set the store name in the common.signals.ts file .
  setSelectedStoreName(storeName?: string) {
    if (storeName) {
      storeNameSignal.set(storeName);
    }
  }
}
