import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';


@NgModule({
  declarations: [],
 
  imports: [
    CommonModule, LazyLoadImageModule, FormsModule, FlatpickrModule
  ]
  , exports: [LazyLoadImageModule, FormsModule,FlatpickrModule]
})
export class myLazyLoadImageModule { }
