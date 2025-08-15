import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  standalone: false
})
export class ContactComponent {
  constructor(private router: Router) {}

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  onBookNow() {
    // Add booking functionality here
    console.log('Book Now clicked');
  }
}
