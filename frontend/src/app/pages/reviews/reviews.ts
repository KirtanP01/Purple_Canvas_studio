import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: Date;
  approved: boolean;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews implements OnInit {
  // Review submission form data
  newReview = {
    name: '',
    email: '',
    rating: 5,
    comment: ''
  };

  // Sample approved reviews (in a real app, these would come from a backend)
  approvedReviews: Review[] = [];

  // Form submission state
  submissionMessage = '';
  showSubmissionForm = false;

  ngOnInit() {
    // Sort reviews by date (newest first)
    this.approvedReviews.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Generate star rating array for display
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  // Toggle review submission form
  toggleSubmissionForm() {
    this.showSubmissionForm = !this.showSubmissionForm;
    if (!this.showSubmissionForm) {
      this.resetForm();
    }
  }

  // Submit new review
  submitReview() {
    if (this.validateForm()) {
      // In a real application, you would send this to a backend service
      console.log('Review submitted:', this.newReview);
      
      this.submissionMessage = 'Thank you for your review! We\'ll review it and publish it soon.';
      this.resetForm();
      this.showSubmissionForm = false;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        this.submissionMessage = '';
      }, 5000);
    }
  }

  // Validate form data
  validateForm(): boolean {
    if (!this.newReview.name.trim()) {
      alert('Please enter your name.');
      return false;
    }
    if (!this.newReview.email.trim()) {
      alert('Please enter your email.');
      return false;
    }
    if (!this.newReview.comment.trim()) {
      alert('Please enter a comment.');
      return false;
    }
    if (this.newReview.rating < 1 || this.newReview.rating > 5) {
      alert('Please select a valid rating.');
      return false;
    }
    return true;
  }

  // Reset form to initial state
  resetForm() {
    this.newReview = {
      name: '',
      email: '',
      rating: 5,
      comment: ''
    };
  }

  // Get average rating
  getAverageRating(): number {
    if (this.approvedReviews.length === 0) return 0;
    const sum = this.approvedReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.approvedReviews.length) * 10) / 10;
  }

  // Get total number of reviews
  getTotalReviews(): number {
    return this.approvedReviews.length;
  }
}
