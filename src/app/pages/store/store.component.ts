import { Component, OnInit } from '@angular/core';
import { Category, Store } from 'src/app/common/common.types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storeIdParam: string | null = "";
  isNewStore: boolean = false;
  store: Store = {} as Store;
  isEditable: boolean = false;
  categories: Category[] = [];



  storeForm = new FormGroup({
    storeName: new FormControl("", Validators.required),
    categoryId: new FormControl<number|null>(null, Validators.required),
    leaseAgreementId: new FormControl<number|null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.route.paramMap.subscribe((params) => {
      this.storeIdParam = params.get("id");
      this.isNewStore = this.storeIdParam === 'new';
      if (!this.isNewStore) {
        this.storeService.getStoreByIdAsync(Number(this.storeIdParam)).subscribe(
          data => {
            this.store = data;
            this.storeForm.setValue({
              storeName: data.storeName,
              categoryId: data.categoryId,
              leaseAgreementId: data.leaseAgreementId ?? null,
            });
    
            this.storeForm.disable();
            this.isEditable = false;
          }
        );
      }else{
        this.storeService.getStoreByIdAsync(0).subscribe(
          data => {
            this.store = data;
            this.storeForm.setValue({
              storeName: data.storeName,
              categoryId: data.categoryId,
              leaseAgreementId: data.leaseAgreementId ?? null,
            });
    
            this.storeForm.enable();
            this.isEditable = true;
          }
        );
      }
    });
  }

  getCategories(){
    this.storeService.getCategoryListAsync().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  editForm() {
    this.storeForm.enable();
    this.isEditable = true;
  }

  submitForm() {
    this.storeForm.markAllAsTouched();
    if(this.storeForm.invalid){
      return;
    }
    const store: Store = {
      storeId: this.store.storeId,
      storeName: this.storeForm.value.storeName ?? "",
      categoryId: this.storeForm.value.categoryId ?? 0,
      leaseAgreementId:  null,
    };
    this.saveStore(store);
  }

  saveStore(store:Store) {
    if(this.store.storeId > 0){
      this.storeService.updateStore(store).subscribe((data)=>{
        this.store = data;
        this.storeForm.setValue({
          storeName: data.storeName,
          categoryId: data.categoryId,
          leaseAgreementId: data.leaseAgreementId ?? null,
        });
        this.storeForm.disable();
        this.isEditable = false;
      }
      );
    }else{
      this.storeService.createStore(store).subscribe((data)=>{
        this.store = data;
        this.storeForm.setValue({
          storeName: data.storeName,
          categoryId: data.categoryId,
          leaseAgreementId: data.leaseAgreementId ?? null,
        });
        this.storeForm.disable();
        this.isEditable = false;
      }
      );
    }
  }

  async deleteProduct(){
    if (this.store.storeId && this.store.storeId  > 0) {
      const confirmed: boolean = await confirm("do you want to delete this product? ")
      if (confirmed) {
        this.storeService.deleteStore(this.store.storeId).subscribe((data) => {
          this.router.navigateByUrl("/stores")
        });
      }

    }
  }
}