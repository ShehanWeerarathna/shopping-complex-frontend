import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { storeNameSignal } from 'src/app/common/common.signals';
import { PagedData, MaintenanceContract } from 'src/app/common/common.types';
import { MaintenanceContractService } from 'src/app/services/maintenance-contract.service';

@Component({
  selector: 'app-maintenance-contracts',
  templateUrl: './maintenance-contracts.component.html',
  styleUrls: ['./maintenance-contracts.component.css'],
})
export class MaintenanceContractsComponent {
  pagedList: PagedData<MaintenanceContract> =
    {} as PagedData<MaintenanceContract>;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private maintenanceContractService: MaintenanceContractService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.refreshMaintenanceContractList();
  }

  // Refresh the maintenance contract list.
  refreshMaintenanceContractList() {
    this.maintenanceContractService
      .getMaintenanceContractsAsync(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.pagedList = data;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
  }

  // Set the store name in the common.signals.ts .
  setSelectedStoreName(storeName?: string) {
    if (storeName) {
      storeNameSignal.set(storeName);
    }
  }
}
