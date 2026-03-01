import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'admin_token';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('admin_user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('admin_user');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        this.userSubject.next(JSON.parse(userStr));
      } catch (e) {
        this.logout();
      }
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/bookings`, { headers: this.getAuthHeaders() });
  }

  getPaintingPartyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/painting-parties`, { headers: this.getAuthHeaders() });
  }

  getBirthdayPartyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/birthday-parties`, { headers: this.getAuthHeaders() });
  }

  getArtClassBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/art-classes`, { headers: this.getAuthHeaders() });
  }
}
