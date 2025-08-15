import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-painting-parties',
  templateUrl: './painting-parties.component.html',
  styleUrls: ['./painting-parties.component.css'],
  standalone: false
})
export class PaintingPartiesComponent {

  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  onBookNow() {
    // Navigate to booking page or open booking modal
    console.log('Book Now clicked');
  }

  onLearnMore(packageType: string) {
    // Handle learn more for specific package
    console.log('Learn More clicked for:', packageType);
  }

  onSignUp() {
    // Handle sign up action
    console.log('Sign Up clicked');
  }
}
