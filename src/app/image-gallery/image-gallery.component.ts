import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { myLazyLoadImageModule } from '../lazy-load-image/lazy-load-image.module';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule,HttpClientModule, myLazyLoadImageModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css'
})
export class ImageGalleryComponent {

}
