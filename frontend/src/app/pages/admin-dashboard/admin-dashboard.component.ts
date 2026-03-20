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
  pendingReviews: any[] = [];
  isLoading = true;
  errorMessage = '';
  activeTab = 'all';
  reviewActionInProgress: Record<number, boolean> = {};

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
    this.loadPendingReviews();
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

  loadPendingReviews(): void {
    this.adminAuthService.getPendingReviews().subscribe({
      next: (reviews: any[]) => {
        this.pendingReviews = reviews || [];
      },
      error: (error) => {
        if (error.status === 401) {
          this.logout();
          return;
        }
        console.error('Failed to load pending reviews:', error);
      }
    });
  }

  approveReview(id: number): void {
    this.reviewActionInProgress[id] = true;
    this.adminAuthService.approveReview(id).subscribe({
      next: () => {
        this.pendingReviews = this.pendingReviews.filter((review) => review.id !== id);
        this.reviewActionInProgress[id] = false;
      },
      error: (error) => {
        this.reviewActionInProgress[id] = false;
        if (error.status === 401) {
          this.logout();
          return;
        }
        alert('Failed to approve review. Please try again.');
      }
    });
  }

  rejectReview(id: number): void {
    this.reviewActionInProgress[id] = true;
    this.adminAuthService.rejectReview(id).subscribe({
      next: () => {
        this.pendingReviews = this.pendingReviews.filter((review) => review.id !== id);
        this.reviewActionInProgress[id] = false;
      },
      error: (error) => {
        this.reviewActionInProgress[id] = false;
        if (error.status === 401) {
          this.logout();
          return;
        }
        alert('Failed to reject review. Please try again.');
      }
    });
  }

  deleteReview(id: number): void {
    if (!confirm('Delete this review permanently?')) {
      return;
    }

    this.reviewActionInProgress[id] = true;
    this.adminAuthService.deleteReview(id).subscribe({
      next: () => {
        this.pendingReviews = this.pendingReviews.filter((review) => review.id !== id);
        this.reviewActionInProgress[id] = false;
      },
      error: (error) => {
        this.reviewActionInProgress[id] = false;
        if (error.status === 401) {
          this.logout();
          return;
        }
        alert('Failed to delete review. Please try again.');
      }
    });
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

  getArtClassTime(artClass: any): string {
    const notes = artClass?.special_requests;
    if (!notes || typeof notes !== 'string') return 'N/A';

    const match = notes.match(/Preferred time:\s*([^|]+)/i);
    return match?.[1]?.trim() || 'N/A';
  }

  formatShortDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
