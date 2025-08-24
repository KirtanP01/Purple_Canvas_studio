import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HomeComponent as HomeCopyComponent } from './pages/home copy/home.component';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { PaintingPartiesComponent } from './pages/painting-parties/painting-parties.component';
import { BirthdayPartiesComponent } from './pages/birthday-parties/birthday-parties.component';
import { ArtClassesComponent } from './pages/art-classes/art-classes.component';
// Removed missing SignUpComponent import
import { Gallery } from './pages/gallery/gallery';
import { Reviews } from './pages/reviews/reviews';
import { BirthdayPartyBookingComponent } from './pages/birthday-party-booking/birthday-party-booking.component';
import { PaintingPartyBookingComponent } from './pages/painting-party-booking/painting-party-booking.component';
import { ArtClassBookingComponent } from './pages/art-class-booking/art-class-booking.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home-copy', component: HomeCopyComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'painting-parties', component: PaintingPartiesComponent },
  { path: 'birthday-parties', component: BirthdayPartiesComponent },
  { path: 'art-classes', component: ArtClassesComponent },
  // Removed missing SignUpComponent route
  { path: 'gallery', component: Gallery },
  { path: 'reviews', component: Reviews },
  { path: 'book-birthday-party', loadComponent: () => import('./pages/birthday-party-booking/birthday-party-booking.component').then(m => m.BirthdayPartyBookingComponent) },
  { path: 'book-painting-party', loadComponent: () => import('./pages/painting-party-booking/painting-party-booking.component').then(m => m.PaintingPartyBookingComponent) },
  { path: 'book-art-class', loadComponent: () => import('./pages/art-class-booking/art-class-booking.component').then(m => m.ArtClassBookingComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
