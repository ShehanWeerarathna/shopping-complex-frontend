import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { storeNameSignal } from 'src/app/common/common.signals';
import { PagedData, MaintenancePayment } from 'src/app/common/common.types';
import { MaintenancePaymentService } from 'src/app/services/maintenance-payment.service';

@Component({
  selector: 'app-maintenance-payments',
  templateUrl: './maintenance-payments.component.html',
  styleUrls: ['./maintenance-payments.component.css'],
})
export class MaintenancePaymentsComponent {
  pagedList: PagedData<MaintenancePayment> =
    {} as PagedData<MaintenancePayment>;
  currentPage: number = 1;
  pageSize: number = 10;
  maintenanceContractId: number = 0;
  storeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private maintenancePaymentService: MaintenancePaymentService
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.maintenanceContractId = Number(params.get('maintenanceContractId'));
      this.refreshMaintenancePayments(this.maintenanceContractId);
    });
  }

  // Get the maintenance payments.
  refreshMaintenancePayments(maintenanceContractId: number) {
    this.maintenancePaymentService
      .getMaintenancePaymentsAsync(
        this.currentPage,
        this.pageSize,
        maintenanceContractId
      )
      .subscribe((maintenancePayments) => {
        this.pagedList = maintenancePayments;
        this.currentPage = maintenancePayments.currentPage;
        this.pageSize = maintenancePayments.pageSize;
      });
  }
}
