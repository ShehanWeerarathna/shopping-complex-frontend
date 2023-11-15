import { Component, OnInit } from '@angular/core';
import { Category, Store } from 'src/app/common/common.types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  storeIdParam: string | null = '';
  isNewStore: boolean = false;
  store: Store = {} as Store;
  isEditable: boolean = false;
  categories: Category[] = [];

  storeForm = new FormGroup({
    storeName: new FormControl('', Validators.required),
    categoryId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    leaseAgreementId: new FormControl<number | null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.route.paramMap
    .subscribe({
      next: (params) => {
        this.storeIdParam = params.get('id');
        this.isNewStore = this.storeIdParam === 'new';
        if (!this.isNewStore) {
          this.storeService
            .getStoreByIdAsync(Number(this.storeIdParam))
            .subscribe({
              next: (data) => {
                this.store = data;
                this.storeForm.setValue({
                  storeName: data.storeName,
                  categoryId: data.categoryId,
                  leaseAgreementId: data.leaseAgreementId ?? null,
                });
      
                this.storeForm.disable();
                this.isEditable = false;
              },
              error: (error) => {
                this.toastr.error(error.error);
              }
            });
        } else {
          this.storeService.getStoreByIdAsync(0)
          .subscribe({
            next: (data) => {
              this.store = data;
              this.storeForm.setValue({
                storeName: data.storeName,
                categoryId: data.categoryId,
                leaseAgreementId: data.leaseAgreementId ?? null,
              });
      
              this.storeForm.enable();
              this.isEditable = true;
            },
            error: (error) => {
              this.toastr.error(error.error);
            }
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.error);
      }
    });
  }

  // Get the list of categories
  getCategories() {
    this.storeService.getCategoryListAsync()
    .subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.toastr.error(error.error);
      }
    });
  }

  // Enable editing of the form
  editForm() {
    this.storeForm.enable();
    this.isEditable = true;
  }

  // Submit the form
  submitForm() {
    this.storeForm.markAllAsTouched();
    if (this.storeForm.invalid) {
      return;
    }
    const store: Store = {
      storeId: this.store.storeId,
      storeName: this.storeForm.value.storeName ?? '',
      categoryId: this.storeForm.value.categoryId ?? 0,
      leaseAgreementId: null,
    };
    this.saveStore(store);
  }

  // Save the store
  saveStore(store: Store) {
    if (this.store.storeId > 0) {
      this.storeService.updateStore(store)
      .subscribe({
        next: (data) => {
          this.store = data;
          this.storeForm.setValue({
            storeName: data.storeName,
            categoryId: data.categoryId,
            leaseAgreementId: data.leaseAgreementId ?? null,
          });
          this.storeForm.disable();
          this.isEditable = false;
        },
        error: (error) => {
          this.toastr.error(error.error);
        }
      });
    } else {
      this.storeService.createStore(store)
      .subscribe({
        next: (data) => {
          this.store = data;
          this.storeForm.setValue({
            storeName: data.storeName,
            categoryId: data.categoryId,
            leaseAgreementId: data.leaseAgreementId ?? null,
          });
          this.storeForm.disable();
          this.isEditable = false;
        },
        error: (error) => {
          this.toastr.error(error.error);
        }
      });
    }
  }

  // Delete the store
  deletePayment() {
    if (this.store.storeId && this.store.storeId > 0) {
      if (confirm('Are you sure you want to delete this store?')) {
        this.storeService.deleteStore(this.store.storeId)
        .subscribe({
          next: (data) => {
            this.router.navigateByUrl('/stores');
          },
          error: (error) => {
            this.toastr.error(error.error);
          }
        });
      }
    }
  }
}
