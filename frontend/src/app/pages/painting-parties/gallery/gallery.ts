import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface GalleryImage {
  name: string;
  path: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit {
  images: GalleryImage[] = [];
  lightboxOpen = false;
  currentImageIndex = 0;
  currentImage: GalleryImage | null = null;

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    // Strategically ordered images to match box shapes:
    // Positions 1,4,7,10... (item-1,item-4): TALL boxes for portrait images
    // Positions 2,5,8,11... (item-2,item-5): WIDE boxes for landscape images  
    // Positions 3,6,9,12... (item-3,item-6): REGULAR boxes for square/mixed images
    const imageNames = [
      // Position 1 (item-1 - TALL): Portrait image
      'IMG-20250730-WA0015.jpg',
      // Position 2 (item-2 - WIDE): Landscape image
      'IMG-20250730-WA0030.jpg',
      // Position 3 (item-3 - REGULAR): Mixed image
      'IMG-20250729-WA0014.jpg',
      // Position 4 (item-4 - TALL): Portrait image
      'IMG-20250730-WA0020.jpg',
      // Position 5 (item-5 - WIDE): Landscape image
      'IMG-20250730-WA0040.jpg',
      // Position 6 (item-6 - REGULAR): Mixed image
      'IMG-20250729-WA0015.jpg',
      // Position 7 (item-1 - TALL): Portrait image
      'IMG-20250730-WA0021.jpg',
      // Position 8 (item-2 - WIDE): Landscape image
      'IMG-20250730-WA0041.jpg',
      // Position 9 (item-3 - REGULAR): Mixed image
      'IMG-20250729-WA0016.jpg',
      // Position 10 (item-4 - TALL): Portrait image
      'IMG-20250730-WA0022.jpg',
      // Position 11 (item-5 - WIDE): Landscape image
      'IMG-20250730-WA0042.jpg',
      // Position 12 (item-6 - REGULAR): Mixed image
      'IMG-20250729-WA0017.jpg',
      // Position 13 (item-1 - TALL): Portrait image
      'IMG-20250730-WA0014.jpg',
      // Position 14 (item-2 - WIDE): Landscape image
      'IMG-20250730-WA0043.jpg',
      // Position 15 (item-3 - REGULAR): Mixed image
      'IMG-20250729-WA0018.jpg',
      // Position 16 (item-4 - TALL): Portrait image
      'IMG-20250730-WA0016.jpg',
      // Position 17 (item-5 - WIDE): Landscape image
      'IMG-20250730-WA0044.jpg',
      // Position 18 (item-6 - REGULAR): Mixed image
      'IMG-20250729-WA0020.jpg',
      // Position 19 (item-1 - TALL): Portrait image
      'IMG-20250730-WA0017.jpg',
      // Position 20 (item-2 - WIDE): Landscape image
      'IMG-20250730-WA0045.jpg',
      // Position 21 (item-3 - REGULAR): Mixed image
      'IMG-20250729-WA0021.jpg',
      // Position 22 (item-4 - TALL): Portrait image
      'IMG-20250730-WA0018.jpg',
      // Position 23 (item-5 - WIDE): Landscape image
      'IMG-20250730-WA0046.jpg',
      // Position 24 (item-6 - REGULAR): Mixed image
      'IMG-20250727-WA0039.jpg',
      // Position 25 (item-1 - TALL): Portrait image
      'IMG-20250730-WA0019.jpg',
      // Position 26 (item-2 - WIDE): Landscape image
      'IMG-20250730-WA0047.jpg',
      // Position 27 (item-3 - REGULAR): Mixed image
      'IMG-20250727-WA0041.jpg',
      // Position 28 (item-4 - TALL): Portrait image
      'IMG-20250730-WA0023.jpg',
      // Position 29 (item-5 - WIDE): Landscape image
      'IMG-20250730-WA0048.jpg',
      // Position 30 (item-6 - REGULAR): Mixed image
      'IMG-20250727-WA0043.jpg',
      // Continue pattern for remaining images
      'IMG-20250730-WA0024.jpg',
      'IMG-20250730-WA0049.jpg',
      'IMG-20250729-WA0009.jpg',
      'IMG-20250730-WA0025.jpg',
      'IMG-20250730-WA0050.jpg',
      'IMG-20250729-WA0010.jpg',
      'IMG-20250730-WA0026.jpg',
      'IMG-20250730-WA0051.jpg',
      'IMG-20250729-WA0012.jpg',
      'IMG-20250730-WA0027.jpg',
      'IMG-20250730-WA0052.jpg',
      'IMG-20250729-WA0013.jpg',
      'IMG-20250730-WA0028.jpg',
      'IMG-20250730-WA0053.jpg',
      'IMG-20250730-WA0031.jpg',
      'IMG-20250730-WA0029.jpg',
      'IMG-20250730-WA0054.jpg',
      'IMG-20250730-WA0032.jpg',
      'IMG-20250730-WA0033.jpg',
      'IMG-20250730-WA0056.jpg',
      'IMG-20250730-WA0034.jpg',
      'IMG-20250730-WA0035.jpg',
      'IMG-20250730-WA0057.jpg',
      'IMG-20250730-WA0036.jpg',
      'IMG-20250730-WA0038.jpg',
      'IMG-20250730-WA0058.jpg',
      'IMG-20250730-WA0039.jpg',
      'IMG-20250730-WA0059.jpg'
    ];

    this.images = imageNames.map(name => ({
      name: name.replace('.jpg', '').replace('IMG-', '').replace('-WA', ' '),
      path: `./assets/collage/${name}`
    }));
  }

  openLightbox(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.images[index];
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.currentImage = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }
}
