import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  paintingParties: any[] = [];
  birthdayParties: any[] = [];
  artClasses: any[] = [];
  isLoading = true;
  errorMessage = '';
  activeTab = 'all';

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  loadAllBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminAuthService.getAllBookings().subscribe({
      next: (data: any) => {
        this.paintingParties = data.paintingParties || [];
        this.birthdayParties = data.birthdayParties || [];
        this.artClasses = data.artClasses || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
        if (error.status === 401) {
          this.logout();
        }
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getTotalBookings(): number {
    return this.paintingParties.length + this.birthdayParties.length + this.artClasses.length;
  }

  logout(): void {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
