import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';

import { Observable, combineLatest, of } from 'rxjs';

import flatpickr from 'flatpickr';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { myLazyLoadImageModule } from './lazy-load-image/lazy-load-image.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NasaServiceService } from './service/nasa-service.service';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import 'flatpickr/dist/flatpickr.min.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    myLazyLoadImageModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent implements OnInit {
onSelectionChange(event: any) {
console.log('Cam Selection', event);
}
  // Definiere ein Array von Dropdown-Optionen
dropdownOptions: string[] = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM', 'PANCAM', 'MINITES'];

  todayISO: any
  endDateBiggerThanToday: boolean = false;
  
loadImages() {
this.getOldAPODs(this.startDate, this.endDate);
}
  title = 'nasaApiProject';

  selectedView: string = '';
  dropdownOpen: boolean = true;
  
  //dates
  today = new Date();
  yesterday = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1);
  selectedDate: string = "";
  startDate: string = "";
  endDate: string;


  selectedImage: any;

  showPopup = false;

  imageSrc = 'assets/noDataImage.png';

  images = [
    'assets/noDataImage.png',

    'assets/EagleStars.jpg',

    'assets/irisNebula.jpg',

    'assets/Lagoon Nebula.jpg',

    'assets/MeteorMountain.jpg',

    'assets/road-mountains-aurora-borealis-nature.jpg',
  ];

  gridItemsPerRow = 4;
  imagesPerPage = 16;

  imageDiv: any;
  videoDiv: any;

  
  showErrorMessage = false;
  errorMessage = '';
cachedData: any;
  cachedImages: any;


  constructor(private nasaServ: NasaServiceService, private cdr: ChangeDetectorRef) {
  
    const yesterday = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 1
    );

    this.todayISO = this.today.toISOString().slice(0, 10);
   this.selectedDate = '2024-05-15';

   this.startDate = this.selectedDate;

    this.endDate = formatDate(yesterday, 'yyyy-MM-dd', 'en') as string;

   
  }

  marsRoverImages$!: Observable<any>;

  @ViewChild('imageElement') imageElement: ElementRef | undefined;

  defaultImage = 'assets/noDataImage.png';
  loadedImages: Set<string> = new Set();

  apodImages$!: Observable<any[]>;

  storedImages: { url: string; title: string; date: string }[] = [];
  // yeah i have two arrays
  image$: Observable<any> | undefined;

  apodImage: string | undefined;
  descI: string = '';

  generalTitle: string = 'Celestial beauty knows no boundaries';
  message: string =
    'Spanning across galaxies and constellations. Each twinkling star whispers secrets of the universe, inviting us to explore its infinite wonders.';

  ngOnInit(): void {

    //this.marsRoverImages$ = this.nasaServ.getMarsRoverImages('2022-05-15', 'MAST');
    this.selectView('month');

    const combined$: Observable<[any, any, any]> = combineLatest([
      this.nasaServ.getCurrent(),
      this.nasaServ.getImages(this.startDate, this.endDate),
      this.nasaServ.getMarsRoverImages('2023-01-01', 'MAST')
    ]);

    combined$.subscribe({
      next: async ([currentData, apodData, marsRoverImgs]) => {
        console.log('image$  received from the service:', currentData);
        console.log('apodImages$  received from the service:', apodData);
        console.log('marsRoverImgs  received from the service:', marsRoverImgs);
        this.image$ = of(currentData);
        this.apodImages$ = of(apodData);
        this.marsRoverImages$ = of(marsRoverImgs);
      },
      error: (error) => {
        console.error('Error while fetching data:', error);
      },
    });
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  
  selectView(view: string) {
   
    let startDateObj = new Date(this.startDate);

    this.selectedView = view;

    switch (view) {
      case 'day':
        this.endDate = this.startDate;
        console.log('day', this.startDate, ' Bis ' , this.endDate);
        break;
      case 'week':
      
       startDateObj.setDate(startDateObj.getDate() + 6);
        this.endDate = startDateObj.toISOString().slice(0, 10);
        console.log('week', this.startDate, ' Bis ' , this.endDate);

        break;
      case 'month':      
        startDateObj.setDate(startDateObj.getDate() + 30);
        this.endDate = startDateObj.toISOString().slice(0, 10);
        console.log('month', this.startDate, ' Bis ' ,this.endDate);
        break;

        case 'three months':
          startDateObj.setDate(startDateObj.getDate() + 90); // Adding 90 days for three months
          this.endDate = startDateObj.toISOString().slice(0, 10); 
          console.log('three Months', this.startDate, ' Bis ' ,this.endDate);
          break;

      default:
        break;
    }

      // Überprüfe Enddatum darf nicht größer als heute 
      const endDateObj: Date = new Date(this.endDate);
      if ( endDateObj > this.today) {
        this.endDate = this.today.toISOString().slice(0, 10);
       // this.endDateBiggerThanToday = !this.endDateBiggerThanToday;
        console.log('endDateBiggerThanToday', this.endDateBiggerThanToday)
      }  
    
    this.toggleDropdown();
    console.log('selectView', view, this.startDate, this.endDate);
  }

  onDateRangeSelected(date: Event) {

    this.startDate = this.selectedDate;  
 
    console.log('todayISO',  this.todayISO);
    this.selectView(this.selectedView);
    console.log('onDateRangeSelected', this.startDate, this.endDate); 
    
  }


  getVideoId(url: string): string {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  }

  openImage(url: string) {
    window.open(url, '_blank');
  }

  getResponsiveImageURL(imagePath: string, size: string): string {
    return `assets/${size}/${imagePath}`;
  }

  getOldAPODs(startDate: string, endDate: string): Observable<any> {
    
    return  this.apodImages$ = this.nasaServ.getImages(startDate, endDate).pipe(
      map((data: any) =>
        data.map((image: any) => ({
          url: image.url,
          explanation: image.explanation,
          title: image.title,
          date: image.date,
          media_type: image.media_type,
        }))
      )
    );
    console.log('getOldAPODs()');
  } 

  
  getCurrentAPOD(): void {
    //  observer argument instead of separate callback arguments
    //   provide multiple handlers for different events in a more structured way
    this.nasaServ.getCurrent().subscribe({
      next: ({ url, explanation, title, date }) => {
        this.apodImage = url;
        this.descI = explanation;

        const imageObject = {
          url: url,
          title: title,
          date: date,
        };
        this.storedImages.push(imageObject);
        console.log(url, 'getCurrentAPOD:', this.storedImages);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
