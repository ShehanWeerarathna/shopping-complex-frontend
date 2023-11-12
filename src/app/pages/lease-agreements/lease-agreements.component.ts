import { Component, OnInit } from '@angular/core';
import { LeaseAgreement, PagedData } from 'src/app/common/common.types';
import { LeaseAgreementService } from 'src/app/services/lease-agreement.service';

@Component({
  selector: 'app-lease-agreements',
  templateUrl: './lease-agreements.component.html',
  styleUrls: ['./lease-agreements.component.css']
})
export class LeaseAgreementsComponent implements OnInit {
  pagedList: PagedData<LeaseAgreement> = {} as PagedData<LeaseAgreement>;
  currentPage:number = 1;
  pageSize:number = 10;

  constructor(private leaseAgreementService: LeaseAgreementService) { }

  ngOnInit(): void {
    this.refreshLeaseAgreementList();
  }

  refreshLeaseAgreementList() {
    this.leaseAgreementService.getLeaseAgreementsAsync(this.currentPage,this.pageSize).subscribe(
      data => {
        this.pagedList = data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
      }
    );
  }
}
