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
    // List of all the images in the collage folder
    const imageNames = [
      'IMG-20250727-WA0039.jpg',
      'IMG-20250727-WA0041.jpg',
      'IMG-20250727-WA0043.jpg',
      'IMG-20250729-WA0009.jpg',
      'IMG-20250729-WA0010.jpg',
      'IMG-20250729-WA0012.jpg',
      'IMG-20250729-WA0013.jpg',
      'IMG-20250729-WA0014.jpg',
      'IMG-20250729-WA0015.jpg',
      'IMG-20250729-WA0016.jpg',
      'IMG-20250729-WA0017.jpg',
      'IMG-20250729-WA0018.jpg',
      'IMG-20250729-WA0020.jpg',
      'IMG-20250729-WA0021.jpg',
      'IMG-20250730-WA0014.jpg',
      'IMG-20250730-WA0015.jpg',
      'IMG-20250730-WA0016.jpg',
      'IMG-20250730-WA0017.jpg',
      'IMG-20250730-WA0018.jpg',
      'IMG-20250730-WA0019.jpg',
      'IMG-20250730-WA0020.jpg',
      'IMG-20250730-WA0021.jpg',
      'IMG-20250730-WA0022.jpg',
      'IMG-20250730-WA0023.jpg',
      'IMG-20250730-WA0024.jpg',
      'IMG-20250730-WA0025.jpg',
      'IMG-20250730-WA0026.jpg',
      'IMG-20250730-WA0027.jpg',
      'IMG-20250730-WA0028.jpg',
      'IMG-20250730-WA0029.jpg',
      'IMG-20250730-WA0030.jpg',
      'IMG-20250730-WA0031.jpg',
      'IMG-20250730-WA0032.jpg',
      'IMG-20250730-WA0033.jpg',
      'IMG-20250730-WA0034.jpg',
      'IMG-20250730-WA0035.jpg',
      'IMG-20250730-WA0036.jpg',
      'IMG-20250730-WA0038.jpg',
      'IMG-20250730-WA0039.jpg',
      'IMG-20250730-WA0040.jpg',
      'IMG-20250730-WA0041.jpg',
      'IMG-20250730-WA0042.jpg',
      'IMG-20250730-WA0043.jpg',
      'IMG-20250730-WA0044.jpg',
      'IMG-20250730-WA0045.jpg',
      'IMG-20250730-WA0046.jpg',
      'IMG-20250730-WA0047.jpg',
      'IMG-20250730-WA0048.jpg',
      'IMG-20250730-WA0049.jpg',
      'IMG-20250730-WA0050.jpg',
      'IMG-20250730-WA0051.jpg',
      'IMG-20250730-WA0052.jpg',
      'IMG-20250730-WA0053.jpg',
      'IMG-20250730-WA0054.jpg',
      'IMG-20250730-WA0056.jpg',
      'IMG-20250730-WA0057.jpg',
      'IMG-20250730-WA0058.jpg',
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
