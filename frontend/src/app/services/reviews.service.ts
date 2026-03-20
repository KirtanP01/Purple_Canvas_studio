import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReviewDto {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreateRequest {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getApprovedReviews(): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/reviews`);
  }

  submitReview(payload: ReviewCreateRequest): Observable<{ message: string; review: ReviewDto }> {
    return this.http.post<{ message: string; review: ReviewDto }>(`${this.apiUrl}/reviews`, payload);
  }
}
