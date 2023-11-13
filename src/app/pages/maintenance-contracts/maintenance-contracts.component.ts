import { Component } from '@angular/core';
import { PagedData, MaintenanceContract } from 'src/app/common/common.types';
import { MaintenanceContractService } from 'src/app/services/maintenance-contract.service';

@Component({
  selector: 'app-maintenance-contracts',
  templateUrl: './maintenance-contracts.component.html',
  styleUrls: ['./maintenance-contracts.component.css']
})
export class MaintenanceContractsComponent {
  pagedList: PagedData<MaintenanceContract> = {} as PagedData<MaintenanceContract>;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private maintenanceContractService: MaintenanceContractService) { }

  ngOnInit(): void {
    this.refreshMaintenanceContractList();
  }

  refreshMaintenanceContractList() {
    this.maintenanceContractService.getMaintenanceContractsAsync(this.currentPage, this.pageSize).subscribe(
      data => {
        this.pagedList = data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;
      }
    );
  }
}
