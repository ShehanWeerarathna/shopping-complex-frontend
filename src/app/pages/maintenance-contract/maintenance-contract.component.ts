import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceContract } from 'src/app/common/common.types';
import { MaintenanceContractService } from 'src/app/services/maintenance-contract.service';
import { storeNameSignal } from '../store-list/store-list.signals';

const today: Date = new Date();

@Component({
  selector: 'app-maintenance-contract',
  templateUrl: './maintenance-contract.component.html',
  styleUrls: ['./maintenance-contract.component.css'],
})
export class MaintenanceContractComponent {
  storeIdParam: string | null = '';
  maintenanceContract: MaintenanceContract = {} as MaintenanceContract;
  isEditable: boolean = false;
  storeName: string = '';

  maintenanceContractForm = new FormGroup({
    contractStartDate: new FormControl<NgbDateStruct>(
      {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
      Validators.required
    ),
    contractEndDate: new FormControl<NgbDateStruct>(
      {} as NgbDateStruct,
      Validators.required
    ),
    contractAmount: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private maintenanceContractService: MaintenanceContractService,
    private router: Router
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.storeIdParam = params.get('storeId');
      this.maintenanceContractService
        .getMaintenanceContractByStoreIdAsync(Number(this.storeIdParam))
        .subscribe((data) => {
          this.maintenanceContract = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.contractStartDate).getFullYear(),
            month: new Date(data.contractStartDate).getMonth() + 1,
            day: new Date(data.contractStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.contractEndDate).getFullYear(),
            month: new Date(data.contractEndDate).getMonth() + 1,
            day: new Date(data.contractEndDate).getDate(),
          };
          if (data.maintenanceContractId === 0) {
            this.isEditable = true;
            this.maintenanceContractForm.enable();
            this.maintenanceContractForm.setValue({
              contractStartDate: startDate,
              contractEndDate: {} as NgbDateStruct,
              contractAmount: data.contractAmount,
            });
          } else {
            this.isEditable = false;
            this.maintenanceContractForm.disable();
            this.maintenanceContractForm.setValue({
              contractStartDate: startDate,
              contractEndDate: endDate,
              contractAmount: data.contractAmount,
            });
          }
        });
    });
  }

  submitForm() {
    this.maintenanceContractForm.markAllAsTouched();
    if (this.maintenanceContractForm.invalid) {
      return;
    }
    const maintenanceContract: MaintenanceContract = {
      maintenanceContractId: this.maintenanceContract.maintenanceContractId,
      storeId: Number(this.storeIdParam),
      contractStartDate: `${this.maintenanceContractForm.value.contractStartDate?.year}-${this.maintenanceContractForm.value.contractStartDate?.month}-${this.maintenanceContractForm.value.contractStartDate?.day}T00:00:00`,
      contractEndDate: `${this.maintenanceContractForm.value.contractEndDate?.year}-${this.maintenanceContractForm.value.contractEndDate?.month}-${this.maintenanceContractForm.value.contractEndDate?.day}T00:00:00`,
      contractAmount: this.maintenanceContractForm.value.contractAmount ?? 0,
    };

    this.saveMaintenanceContract(maintenanceContract);
  }

  editForm() {
    this.isEditable = true;
    this.maintenanceContractForm.enable();
  }

  deleteContract() {
    if (this.maintenanceContract.maintenanceContractId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this maintenance contract?`)) {
      this.maintenanceContractService
        .deleteMaintenanceContract(
          this.maintenanceContract.maintenanceContractId
        )
        .subscribe((data) => {
          this.router.navigate([`/stores`]);
        });
    }
  }

  saveMaintenanceContract(maintenanceContract: MaintenanceContract) {
    if (
      this.maintenanceContract.maintenanceContractId &&
      this.maintenanceContract.maintenanceContractId > 0
    ) {
      this.maintenanceContractService
        .updateMaintenanceContract(maintenanceContract)
        .subscribe((data) => {
          this.maintenanceContract = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.contractStartDate).getFullYear(),
            month: new Date(data.contractStartDate).getMonth() + 1,
            day: new Date(data.contractStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.contractEndDate).getFullYear(),
            month: new Date(data.contractEndDate).getMonth() + 1,
            day: new Date(data.contractEndDate).getDate(),
          };
          this.maintenanceContractForm.setValue({
            contractStartDate: startDate,
            contractEndDate: endDate,
            contractAmount: data.contractAmount,
          });
          this.maintenanceContractForm.disable();
          this.isEditable = false;
        });
    } else {
      this.maintenanceContractService
        .createMaintenanceContract(maintenanceContract)
        .subscribe((data) => {
          this.maintenanceContract = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.contractStartDate).getFullYear(),
            month: new Date(data.contractStartDate).getMonth() + 1,
            day: new Date(data.contractStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.contractEndDate).getFullYear(),
            month: new Date(data.contractEndDate).getMonth() + 1,
            day: new Date(data.contractEndDate).getDate(),
          };
          this.maintenanceContractForm.setValue({
            contractStartDate: startDate,
            contractEndDate: endDate,
            contractAmount: data.contractAmount,
          });
          this.maintenanceContractForm.disable();
          this.isEditable = false;
        });
    }
  }
}
