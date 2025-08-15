import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  standalone: false
})
export class AboutComponent {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  navigateToArtClasses() {
    this.router.navigate(['/art-classes']);
  }

  navigateToPaintingParties() {
    this.router.navigate(['/painting-parties']);
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  onBookNow() {
    this.navigateToSignUp();
  }
}
