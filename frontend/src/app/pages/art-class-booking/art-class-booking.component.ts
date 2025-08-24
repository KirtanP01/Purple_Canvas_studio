import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-art-class-booking',
  templateUrl: './art-class-booking.component.html',
  styleUrls: ['./art-class-booking.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, NavbarComponent]
})
export class ArtClassBookingComponent {
  formData: any = {};
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.http.post('/api/art-classes', this.formData).subscribe({
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
