import { Component } from '@angular/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import {
  PagedData,
  LeasePayment,
  FinancialReport,
} from 'src/app/common/common.types';
import { FinancialReportService } from 'src/app/services/financial-report.service';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css'],
})
export class FinancialReportComponent {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  pagedList: PagedData<LeasePayment> = {} as PagedData<LeasePayment>;
  financialReport: FinancialReport = {} as FinancialReport;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private financialReportService: FinancialReportService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  getReport() {
    if (this.fromDate && this.toDate) {
      this.financialReportService
        .getFinancialReport(
          this.formatter.format(this.fromDate),
          this.formatter.format(this.toDate)
        )
        .subscribe((fr) => {
          this.financialReport = fr;
        });
    }
  }
}
