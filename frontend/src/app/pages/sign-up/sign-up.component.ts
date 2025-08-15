import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  numberOfGuests: number;
  package: string;
  theme: string;
  additionalNotes: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: false
})
export class SignUpComponent {
  
  formData: BookingFormData = {
    name: '',
    email: '',
    phone: '',
    date: '',
    numberOfGuests: 1,
    package: '',
    theme: '',
    additionalNotes: ''
  };

  packages = [
    { value: 'basic', label: 'Basic Package - $25/person' },
    { value: 'premium', label: 'Premium Package - $35/person' },
    { value: 'deluxe', label: 'Deluxe Package - $45/person' }
  ];

  themes = [
    { value: 'abstract', label: 'Abstract Art' },
    { value: 'landscape', label: 'Landscape Painting' },
    { value: 'portrait', label: 'Portrait Painting' },
    { value: 'still-life', label: 'Still Life' },
    { value: 'custom', label: 'Custom Theme' }
  ];

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

  navigateToActivities() {
    this.router.navigate(['/art-classes']);
  }

  onBookNow() {
    // Scroll to booking form
    const bookingSection = document.querySelector('.booking-form');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmitBooking() {
    // Validate required fields
    if (!this.formData.name || !this.formData.email || !this.formData.phone || 
        !this.formData.date || !this.formData.numberOfGuests) {
      alert('Please fill in all required fields.');
      return;
    }

    // Handle form submission
    console.log('Booking form submitted:', this.formData);
    
    // Here you would typically send the data to a backend service
    // For now, we'll just show an alert
    alert('Thank you for your booking request! We will contact you soon to confirm your painting party.');
    
    // Reset form
    this.formData = {
      name: '',
      email: '',
      phone: '',
      date: '',
      numberOfGuests: 1,
      package: '',
      theme: '',
      additionalNotes: ''
    };
  }
}
