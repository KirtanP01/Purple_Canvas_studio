import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-art-classes',
  templateUrl: './art-classes.component.html',
  styleUrls: ['./art-classes.component.css'],
  standalone: false
})
export class ArtClassesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Force scroll to top when component loads
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  navigateToEnrollment() {
    // Add enrollment functionality here
    console.log('Enroll Now clicked');
  }

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
