import {Component, OnInit} from '@angular/core';
import {Category, PagedData, Store} from "../../common/common.types";
import {StoreService} from "../../services/store.service";

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit{
  pagedList: PagedData<Store> = {} as PagedData<Store>;
  searchTerm: string = "";
  currentPage:number = 1;
  pageSize:number = 10;
  categoryId:number = 0;
  categories: Category[] = [];

  constructor(private storeService: StoreService) {
  }
  ngOnInit(): void {
    this.refreshStoreList();
    this.getCategories();
  }

  getCategories(){
    this.storeService.getCategoryListAsync().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  refreshStoreList() {
		this.storeService.getStoreListAsync(this.searchTerm,this.currentPage,this.pageSize,this.categoryId).subscribe(
      data => {
        this.pagedList = data;
        this.currentPage = data.currentPage;
        this.pageSize = data.pageSize;

      }
    );
	}


}
