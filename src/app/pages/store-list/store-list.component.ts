import { Component, OnInit } from '@angular/core';
import { Category, PagedData, Store } from '../../common/common.types';
import { StoreService } from '../../services/store.service';
import { storeNameSignal } from 'src/app/common/common.signals';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css'],
})
export class StoreListComponent implements OnInit {
  pagedList: PagedData<Store> = {} as PagedData<Store>;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  categoryId: number = 0;
  categories: Category[] = [];

  constructor(private storeService: StoreService, private toastr: ToastrService
    ) {}
  ngOnInit(): void {
    this.refreshStoreList();
    this.getCategories();
  }

  // Get the categories for the dropdown list
  getCategories() {
    this.storeService.getCategoryListAsync()
    .subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.toastr.error(error.error.Message);
      },
    });
  }

  // Refresh the store list when the user clicks the Search button.
  refreshStoreList() {
    this.storeService
      .getStoreListAsync(
        this.searchTerm,
        this.currentPage,
        this.pageSize,
        this.categoryId
      )
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

  // set selected store name to signal
  setSelectedStoreName(storeName: string) {
    storeNameSignal.set(storeName);
  }
}
