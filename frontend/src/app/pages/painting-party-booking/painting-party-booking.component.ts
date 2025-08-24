import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-painting-party-booking',
  templateUrl: './painting-party-booking.component.html',
  styleUrls: ['./painting-party-booking.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, NavbarComponent]
})
export class PaintingPartyBookingComponent {
  formData: any = {};
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.http.post('/api/painting-parties', this.formData).subscribe({
      next: () => {
        this.successMessage = 'Booking submitted successfully!';
        this.formData = {};
        this.submitting = false;
      },
      error: err => {
        this.errorMessage = 'Failed to submit booking.';
        this.submitting = false;
      }
    });
  }
}
