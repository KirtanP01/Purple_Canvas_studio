import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class SignUpComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Load PayPal JS SDK
    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = 'https://www.paypal.com/sdk/js?client-id=Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv&currency=USD';
      script.onload = () => this.renderPayPalButton();
      document.body.appendChild(script);
    } else {
      this.renderPayPalButton();
    }
  }

  renderPayPalButton() {
    // @ts-ignore
    if (window.paypal) {
      // Remove old button if exists
      const container = document.getElementById('paypal-btn-container');
      if (container) container.innerHTML = '';
      // @ts-ignore
      window.paypal.Buttons({
        createOrder: async (data: any, actions: any) => {
          // Call backend to create order
          try {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: '10.00' }) // Test amount
            });
            const dataRes = await res.json();
            // Use dummy order id if backend fails
            return dataRes.id || 'DUMMY_ORDER_ID';
          } catch (e) {
            return 'DUMMY_ORDER_ID';
          }
        },
        onApprove: async (data: any, actions: any) => {
          // Call backend to capture order
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
          });
          const captureRes = await res.json();
          alert('Payment successful! Transaction ID: ' + captureRes.id);
        },
        onError: (err: any) => {
          alert('PayPal error: ' + err);
        }
      }).render('#paypal-btn-container');
    }
  }
}
