import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-birthday-parties',
  templateUrl: './birthday-parties.component.html',
  styleUrls: ['./birthday-parties.component.css'],
  standalone: false
})
export class BirthdayPartiesComponent {

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
}
