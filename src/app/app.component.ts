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

import { Observable, Subscription, combineLatest, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { myLazyLoadImageModule } from './lazy-load-image/lazy-load-image.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NasaServiceService } from './service/nasa-service.service';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import 'flatpickr/dist/flatpickr.min.css';
import { FilterContainerComponent } from './filter-container/filter-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    myLazyLoadImageModule,
    FilterContainerComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [NO_ERRORS_SCHEMA],
})

export class AppComponent implements OnInit, OnDestroy  {
 
  @ViewChild('imageElement') imageElement: ElementRef | undefined;

  dropdownOptions: string[] = [
    'FHAZ',
    'RHAZ',
    'MAST',
    'CHEMCAM',
    'MAHLI',
    'MARDI',
    'NAVCAM',
    'PANCAM',
    'MINITES',
  ];

  title = 'nasaApiProject';

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
  cachedData: any;
  cachedImages: any;
  marsRoverImages$!: Observable<any>;

  defaultImage = 'assets/noDataImage.png';
  loadedImages: Set<string> = new Set();
  apodImages$!: Observable<any[]>;
  storedImages: { url: string; title: string; date: string }[] = [];
  image$: Observable<any> | undefined;
  apodImage: string | undefined;
  descI: string = '';
  generalTitle: string = 'Celestial beauty knows no boundaries';
  message: string =
    'Spanning across galaxies and constellations. Each twinkling star whispers secrets of the universe, inviting us to explore its infinite wonders.';

  startDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  endDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  private subscription: Subscription = new Subscription();

    constructor(
      private nasaServ: NasaServiceService,
      private cdr: ChangeDetectorRef
    ) {  }

  ngOnInit(): void {
    //this.marsRoverImages$ = this.nasaServ.getMarsRoverImages('2022-05-15', 'MAST');    
    this.loadCombinedData();    
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCombinedData(): void {
    const combined$ = combineLatest([
      this.nasaServ.getCurrent(),
      this.nasaServ.getImages(this.startDate, this.endDate),
      this.nasaServ.getMarsRoverImages('2023-01-01', 'MAST')
    ]);

    this.subscription.add(
      combined$.subscribe({
        next: async ([currentData, apodData, marsRoverImgs]) => {
          console.log('image$ received from the service:', currentData);
          console.log('apodImages$ received from the service:', apodData);
          console.log('marsRoverImgs received from the service:', marsRoverImgs);
          this.image$ = of(currentData);
          this.apodImages$ = of(apodData);
          this.marsRoverImages$ = of(marsRoverImgs);
        },
        error: (error) => {
          console.error('Error while fetching data:', error);
        },
      })
    );
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
    return (this.apodImages$ = this.nasaServ.getImages(startDate, endDate).pipe(
      map((data: any) =>
        data.map((image: any) => ({
          url: image.url,
          explanation: image.explanation,
          title: image.title,
          date: image.date,
          media_type: image.media_type,
        }))),
        tap(mappedData => console.log('Mapped APOD data:', mappedData))
    ));
  
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


  onFilterStateChanged(filterState: {
    dateRange: { startDate: string; endDate: string };
    selectedView: string;
  }) {
    this.startDate = filterState.dateRange.startDate;
    this.endDate = filterState.dateRange.endDate;
    this.getOldAPODs(this.startDate, this.endDate);
  }
  
  
}
