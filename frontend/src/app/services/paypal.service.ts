import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PayPalOrder {
  orderID: string;
  status: string;
}

export interface PayPalCapture {
  orderID: string;
  status: string;
  payerEmail?: string;
  captureID?: string;
  amount?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createOrder(amount: number, bookingType: string, bookingData: any): Observable<PayPalOrder> {
    return this.http.post<PayPalOrder>(`${this.apiUrl}/create-order`, {
      amount,
      currency: 'USD',
      bookingType,
      bookingData
    });
  }

  captureOrder(orderID: string): Observable<PayPalCapture> {
    return this.http.post<PayPalCapture>(`${this.apiUrl}/capture-order`, {
      orderID
    });
  }

  updateBookingPayment(bookingId: number, bookingType: string, paymentData: any): Observable<any> {
    const endpoint = `${environment.apiUrl}/${bookingType}/${bookingId}/payment`;
    return this.http.post(endpoint, paymentData);
  }
}
