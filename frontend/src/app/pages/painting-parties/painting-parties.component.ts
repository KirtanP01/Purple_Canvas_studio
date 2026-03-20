import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  navigateToBooking() {
    this.router.navigate(['/book-painting-party']);
  }

  onSubmitSignup(form: NgForm) {
    if (form.valid) {
      const formData = form.value;
      console.log('Painting Party Reservation:', formData);
      
      // Here you would typically send this data to your backend
      // For now, we'll just show a success message
      alert('🎉 Thank you for your reservation request! We\'ll contact you within 24 hours to confirm your painting party details. 💜');
      
      // Reset the form
      form.reset();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
