import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  navigateToActivities() {
    this.router.navigate(['/art-classes']);
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  onBookNow() {
    this.navigateToSignUp();
  }
}
