import { Component, OnInit, Renderer2, Inject, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { PaypalService } from '../../services/paypal.service';
import { DOCUMENT, CommonModule } from '@angular/common';
import { BOOKING_PRICES } from '../../config/pricing.config';
import { environment } from '../../../environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-art-class-booking',
  templateUrl: './art-class-booking.component.html',
  styleUrls: ['./art-class-booking.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, NavbarComponent, CommonModule]
})
export class ArtClassBookingComponent implements OnInit {
  showPayPal = false;
  bookingId: number | null = null;
  bookingData: any = null;
  enrollmentFee = BOOKING_PRICES.artClass;
  private document = inject(DOCUMENT);
  private readonly PAYPAL_CLIENT_ID = environment.paypalClientId;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private paypalService: PaypalService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadPayPalScript();
  }

  loadPayPalScript() {
    const script = this.renderer.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.onload = () => {
      console.log('PayPal SDK loaded (Sandbox mode)');
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK. Check your Client ID.');
    };
    this.renderer.appendChild(this.document.body, script);
  }

  onSubmitSignup(form: NgForm) {
    if (form.valid) {
      const formData = form.value;
      this.bookingData = formData;
      console.log('Art Class Enrollment:', formData);
      
      // First, create the booking in the database
      this.http.post(`${environment.apiUrl}/art-classes`, formData).subscribe({
        next: (response: any) => {
          console.log('✅ Booking created:', response);
          this.bookingId = response.id;
          
          // Show PayPal payment form
          this.showPayPal = true;
          
          // Initialize PayPal button after a short delay
          setTimeout(() => this.initPayPalButton(), 100);
        },
        error: (err) => {
          console.error('❌ Booking creation error:', err);
          alert('Failed to create booking. Please try again.');
        }
      });
    }
  }

  initPayPalButton() {
    if (!paypal) {
      console.error('PayPal SDK not loaded');
      return;
    }

    const paypalButtonContainer = this.document.getElementById('paypal-button-container');
    if (!paypalButtonContainer) {
      console.error('PayPal button container not found');
      return;
    }

    // Clear any existing buttons
    paypalButtonContainer.innerHTML = '';

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return this.paypalService.createOrder(
          this.enrollmentFee,
          'Art Class',
          this.bookingData
        ).toPromise().then((order: any) => {
          return order.orderID;
        });
      },
      onApprove: (data: any, actions: any) => {
        return this.paypalService.captureOrder(data.orderID).toPromise().then((details: any) => {
          console.log('Payment captured:', details);
          
          // Update the booking with payment information
          return this.paypalService.updateBookingPayment(
            this.bookingId!,
            'art-classes',
            {
              paypalOrderId: details.orderID,
              paypalCaptureId: details.captureID,
              paymentAmount: this.enrollmentFee
            }
          ).toPromise();
        }).then(() => {
          // Let PayPal close, then show success
          setTimeout(() => {
            alert('🎓 Payment successful! Your enrollment is confirmed. We\'ll contact you within 24 hours! 💜');
            this.showPayPal = false;
            this.bookingId = null;
            this.bookingData = null;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.router.navigate(['/']);
          }, 1000);
        }).catch((error) => {
          console.error('Payment update error:', error);
          throw error;
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again or contact us for assistance.');
      },
      onCancel: (data: any) => {
        console.log('Payment cancelled by user');
        alert('Payment cancelled. Your booking is saved but not confirmed until payment is completed.');
        this.showPayPal = false;
      }
    }).render('#paypal-button-container');
  }
}
