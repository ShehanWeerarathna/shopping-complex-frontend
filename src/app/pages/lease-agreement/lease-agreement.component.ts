import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LeaseAgreement } from 'src/app/common/common.types';
import { LeaseAgreementService } from 'src/app/services/lease-agreement.service';
import { storeNameSignal } from '../store-list/store-list.signals';

const today: Date = new Date();

@Component({
  selector: 'app-lease-agreement',
  templateUrl: './lease-agreement.component.html',
  styleUrls: ['./lease-agreement.component.css'],
})
export class LeaseAgreementComponent implements OnInit {
  storeIdParam: string | null = '';
  leaseAgreement: LeaseAgreement = {} as LeaseAgreement;
  isEditable: boolean = false;
  storeName: string = '';

  leaseAgreementForm = new FormGroup({
    leaseStartDate: new FormControl<NgbDateStruct>(
      {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
      Validators.required
    ),
    leaseEndDate: new FormControl<NgbDateStruct>(
      {} as NgbDateStruct,
      Validators.required
    ),
    leaseAmount: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private leaseAgreementService: LeaseAgreementService,
    private router: Router
  ) {
    this.storeName = storeNameSignal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.storeIdParam = params.get('storeId');
      this.leaseAgreementService
        .getLeaseAgreementByStoreIdAsync(Number(this.storeIdParam))
        .subscribe((data) => {
          this.leaseAgreement = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.leaseStartDate).getFullYear(),
            month: new Date(data.leaseStartDate).getMonth() + 1,
            day: new Date(data.leaseStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.leaseEndDate).getFullYear(),
            month: new Date(data.leaseEndDate).getMonth() + 1,
            day: new Date(data.leaseEndDate).getDate(),
          };
          if (data.leaseAgreementId === 0) {
            this.isEditable = true;
            this.leaseAgreementForm.enable();
            this.leaseAgreementForm.setValue({
              leaseStartDate: startDate,
              leaseEndDate: {} as NgbDateStruct,
              leaseAmount: data.leaseAmount,
            });
          } else {
            this.isEditable = false;
            this.leaseAgreementForm.disable();
            this.leaseAgreementForm.setValue({
              leaseStartDate: startDate,
              leaseEndDate: endDate,
              leaseAmount: data.leaseAmount,
            });
          }
        });
    });
  }
  submitForm() {
    this.leaseAgreementForm.markAllAsTouched();
    if (this.leaseAgreementForm.invalid) {
      return;
    }
    const leaseAgreement: LeaseAgreement = {
      leaseAgreementId: this.leaseAgreement.leaseAgreementId,
      storeId: Number(this.storeIdParam),
      leaseStartDate: `${this.leaseAgreementForm.value.leaseStartDate?.year}-${this.leaseAgreementForm.value.leaseStartDate?.month}-${this.leaseAgreementForm.value.leaseStartDate?.day}T00:00:00`,
      leaseEndDate: `${this.leaseAgreementForm.value.leaseEndDate?.year}-${this.leaseAgreementForm.value.leaseEndDate?.month}-${this.leaseAgreementForm.value.leaseEndDate?.day}T00:00:00`,

      leaseAmount: this.leaseAgreementForm.value.leaseAmount ?? 0,
    };

    this.saveLeaseAgreement(leaseAgreement);
  }
  editForm() {
    this.isEditable = true;
    this.leaseAgreementForm.enable();
  }

  deleteAgreement() {
    if (this.leaseAgreement.leaseAgreementId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this lease agreement?`)) {
      this.leaseAgreementService
        .deleteLeaseAgreement(this.leaseAgreement.leaseAgreementId)
        .subscribe((data) => {
          this.router.navigate([`/stores`]);
        });
    }
  }

  saveLeaseAgreement(leaseAgreement: LeaseAgreement) {
    if (
      this.leaseAgreement.leaseAgreementId &&
      this.leaseAgreement.leaseAgreementId > 0
    ) {
      this.leaseAgreementService
        .updateLeaseAgreement(leaseAgreement)
        .subscribe((data) => {
          this.leaseAgreement = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.leaseStartDate).getFullYear(),
            month: new Date(data.leaseStartDate).getMonth() + 1,
            day: new Date(data.leaseStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.leaseEndDate).getFullYear(),
            month: new Date(data.leaseEndDate).getMonth() + 1,
            day: new Date(data.leaseEndDate).getDate(),
          };
          this.leaseAgreementForm.setValue({
            leaseStartDate: startDate,
            leaseEndDate: endDate,
            leaseAmount: data.leaseAmount,
          });
          this.leaseAgreementForm.disable();
          this.isEditable = false;
        });
    } else {
      this.leaseAgreementService
        .createLeaseAgreement(leaseAgreement)
        .subscribe((data) => {
          this.leaseAgreement = data;
          const startDate: NgbDateStruct = {
            year: new Date(data.leaseStartDate).getFullYear(),
            month: new Date(data.leaseStartDate).getMonth() + 1,
            day: new Date(data.leaseStartDate).getDate(),
          };
          const endDate: NgbDateStruct = {
            year: new Date(data.leaseEndDate).getFullYear(),
            month: new Date(data.leaseEndDate).getMonth() + 1,
            day: new Date(data.leaseEndDate).getDate(),
          };
          this.leaseAgreementForm.setValue({
            leaseStartDate: startDate,
            leaseEndDate: endDate,
            leaseAmount: data.leaseAmount,
          });
          this.leaseAgreementForm.disable();
          this.isEditable = false;
        });
    }
  }
}
