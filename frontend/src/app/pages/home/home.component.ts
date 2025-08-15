import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {

  // Slideshow properties
  currentSlideIndex = 0;
  slideInterval: any;
  
  // Array of slideshow images
  slideImages = [
    'assets/test.jpg',
    'assets/slideshow/slide2.jpg',
    'assets/slideshow/slide3.jpg',
    'assets/slideshow/slide4.jpg',
    'assets/slideshow/slide5.jpg'
  ];

  // Kids artwork slideshow properties
  currentArtworkIndex = 0;
  artworkInterval: any;
  
  // Array of kids' artwork images
  kidsArtworkImages = [
    'assets/kids-artwork/IMG-20250812-WA0009.jpg',
    'assets/kids-artwork/IMG-20250812-WA0010.jpg',
    'assets/kids-artwork/IMG-20250812-WA0011.jpg',
    'assets/kids-artwork/IMG-20250812-WA0012.jpg',
    'assets/kids-artwork/IMG-20250812-WA0013.jpg',
    'assets/kids-artwork/IMG-20250812-WA0014.jpg',
    'assets/kids-artwork/IMG-20250812-WA0015.jpg',
    'assets/kids-artwork/IMG-20250812-WA0016.jpg',
    'assets/kids-artwork/IMG-20250812-WA0017.jpg',
    'assets/kids-artwork/IMG-20250812-WA0018.jpg',
    'assets/kids-artwork/IMG-20250812-WA0019.jpg',
    'assets/kids-artwork/IMG-20250812-WA0020.jpg',
    'assets/kids-artwork/IMG-20250812-WA0021.jpg',
    'assets/kids-artwork/IMG-20250812-WA0022.jpg',
    'assets/kids-artwork/IMG-20250812-WA0023.jpg',
    'assets/kids-artwork/IMG-20250812-WA0024.jpg',
    'assets/kids-artwork/IMG-20250812-WA0025.jpg',
    'assets/kids-artwork/IMG-20250812-WA0026.jpg',
    'assets/kids-artwork/IMG-20250812-WA0027.jpg',
    'assets/kids-artwork/IMG-20250812-WA0028.jpg',
    'assets/kids-artwork/IMG-20250812-WA0029.jpg',
    'assets/kids-artwork/IMG-20250812-WA0030.jpg',
    'assets/kids-artwork/IMG-20250812-WA0031.jpg',
    'assets/kids-artwork/IMG-20250812-WA0032.jpg',
    'assets/kids-artwork/IMG-20250812-WA0033.jpg',
    'assets/kids-artwork/IMG-20250812-WA0034.jpg',
    'assets/kids-artwork/IMG-20250812-WA0035.jpg',
    'assets/kids-artwork/IMG-20250812-WA0036.jpg',
    'assets/kids-artwork/IMG-20250812-WA0037.jpg',
    'assets/kids-artwork/IMG-20250812-WA0038.jpg',
    'assets/kids-artwork/IMG-20250812-WA0039.jpg',
    'assets/kids-artwork/IMG-20250812-WA0040.jpg',
    'assets/kids-artwork/IMG-20250812-WA0041.jpg',
    'assets/kids-artwork/IMG-20250812-WA0042.jpg',
    'assets/kids-artwork/IMG-20250812-WA0043.jpg',
    'assets/kids-artwork/IMG-20250812-WA0044.jpg',
    'assets/kids-artwork/IMG-20250812-WA0045.jpg',
    'assets/kids-artwork/IMG-20250812-WA0046.jpg',
    'assets/kids-artwork/IMG-20250812-WA0047.jpg',
    'assets/kids-artwork/IMG-20250812-WA0048.jpg',
    'assets/kids-artwork/IMG-20250812-WA0049.jpg',
    'assets/kids-artwork/IMG-20250812-WA0050.jpg',
    'assets/kids-artwork/IMG-20250812-WA0051.jpg',
    'assets/kids-artwork/IMG-20250812-WA0052.jpg',
    'assets/kids-artwork/IMG-20250812-WA0053.jpg',
    'assets/kids-artwork/IMG-20250812-WA0054.jpg',
    'assets/kids-artwork/IMG-20250812-WA0055.jpg',
    'assets/kids-artwork/IMG-20250812-WA0056.jpg',
    'assets/kids-artwork/IMG-20250812-WA0057.jpg',
    'assets/kids-artwork/IMG-20250812-WA0058.jpg'
  ];

  constructor(private router: Router, private viewportScroller: ViewportScroller) { }

  ngOnInit() {
    this.startSlideshow();
    this.startArtworkSlideshow();
  }

  ngOnDestroy() {
    this.stopSlideshow();
    this.stopArtworkSlideshow();
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  stopSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideImages.length;
  }

  prevSlide() {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.slideImages.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  onSlideMouseEnter() {
    this.stopSlideshow();
  }

  onSlideMouseLeave() {
    this.startSlideshow();
  }

  // Kids artwork slideshow methods
  startArtworkSlideshow() {
    this.artworkInterval = setInterval(() => {
      this.nextArtwork();
    }, 3000); // Change artwork every 3 seconds
  }

  stopArtworkSlideshow() {
    if (this.artworkInterval) {
      clearInterval(this.artworkInterval);
    }
  }

  nextArtwork() {
    this.currentArtworkIndex = (this.currentArtworkIndex + 1) % this.kidsArtworkImages.length;
  }

  prevArtwork() {
    this.currentArtworkIndex = this.currentArtworkIndex === 0 
      ? this.kidsArtworkImages.length - 1 
      : this.currentArtworkIndex - 1;
  }

  onArtworkMouseEnter() {
    this.stopArtworkSlideshow();
  }

  onArtworkMouseLeave() {
    this.startArtworkSlideshow();
  }

  // Get visible artwork images for collage (show 6 at a time)
  getVisibleArtworks() {
    const visibleCount = 6;
    const artworks = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (this.currentArtworkIndex + i) % this.kidsArtworkImages.length;
      artworks.push({
        src: this.kidsArtworkImages[index],
        index: index
      });
    }
    return artworks;
  }

  navigateToAbout() {
    this.router.navigate(['/about']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToContact() {
    this.router.navigate(['/contact']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  onBookNow() {
    // Add booking functionality here
    console.log('Book Now clicked');
  }

  navigateToPaintingParties() {
    this.router.navigate(['/painting-parties']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToBirthdayParties() {
    this.router.navigate(['/birthday-parties']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToArtClasses() {
    this.router.navigate(['/art-classes']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    });
  }
}
