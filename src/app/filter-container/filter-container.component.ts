import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-container',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.css',
})
export class FilterContainerComponent {
  startDate: string = '';
  endDate: string = '';
  

  today = new Date();
  yesterday = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() - 1
  );
  todayISO: any;

  selectedView: string = '';
  endDateBiggerThanToday: boolean = false;

dropdownOpen: boolean = false;

@Output() filterStateChanged = new EventEmitter<{
  dateRange: { startDate: string; endDate: string };
  selectedView: string;
}>();


  constructor() {
    this.todayISO = this.today.toISOString().slice(0, 10);
    this.startDate = new Date(this.today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    this.endDate = this.today.toISOString().slice(0, 10);
    this.selectedView = 'Week'

  }

  ngOnInit(): void {
    this.submitFilter();
    console.log('start and enddate:', this.startDate, this.endDate);
    console.log('dropdownOpen:', this.dropdownOpen);
  }

  onDateRangeChange(start: any){
    this.startDate = start;
    this.onViewChange(this.selectedView)
    console.log('onDateRangeChange() this.startDate:', this.startDate);
  }

  onViewChange(view: string) {
    let startDateObj = new Date(this.startDate);
    this.selectedView = view;
    switch (view) {
      case 'Day':
        this.endDate = this.startDate;
        console.log('day', this.startDate, ' Bis ', this.endDate);
        break;
      case 'Week':
        startDateObj.setDate(startDateObj.getDate() + 6);
        this.endDate = startDateObj.toISOString().slice(0, 10);
        console.log('week', this.startDate, ' Bis ', this.endDate);

        break;
      case 'Month':
        startDateObj.setDate(startDateObj.getDate() + 30);
        this.endDate = startDateObj.toISOString().slice(0, 10);
        console.log('month', this.startDate, ' Bis ', this.endDate);
        break;

      case 'Three months':
        startDateObj.setDate(startDateObj.getDate() + 90); // Adding 90 days for three months
        this.endDate = startDateObj.toISOString().slice(0, 10);
        console.log('three Months', this.startDate, ' Bis ', this.endDate);
        break;

      default:
        break;
   
      }
    // Überprüfe Enddatum darf nicht größer als heute
    const endDateObj: Date = new Date(this.endDate);
    if (endDateObj > this.today) {
      this.endDate = this.today.toISOString().slice(0, 10);

      console.log('endDateBiggerThanToday', this.endDateBiggerThanToday);
    }
   
    console.log('selectView', view, this.startDate, this.endDate);
    this.dropdownOpen = false;
  }

  submitFilter() {
    this.filterStateChanged.emit({
      dateRange: { startDate: this.startDate, endDate: this.endDate },
      selectedView: this.selectedView
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
