import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedData, LeasePayment } from '../common/common.types';

@Injectable({
  providedIn: 'root',
})
export class FinancialReportService {
  private apiUrl = 'https://localhost:7038/api';
  constructor(private http: HttpClient) {}

  getPagedLeasePaymentsByDateRange(
    startDate: string,
    endDate: string,
    currentPage?: number,
    pageSize?: number
  ): Observable<PagedData<LeasePayment>> {
    let url = `${this.apiUrl}/LeasePayment/GetPagedLeasePaymentsByDateRange?startDate=${startDate}&endDate=${endDate}`;
    if (currentPage != null && pageSize != null) {
      url += `&currentPage=${currentPage}&pageSize=${pageSize}`;
    }
    return this.http.get<PagedData<LeasePayment>>(url);
  }
}
