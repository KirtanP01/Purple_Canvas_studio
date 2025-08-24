import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeComponent as HomeCopyComponent } from './pages/home copy/home.component';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { PaintingPartiesComponent } from './pages/painting-parties/painting-parties.component';
import { BirthdayPartiesComponent } from './pages/birthday-parties/birthday-parties.component';
import { ArtClassesComponent } from './pages/art-classes/art-classes.component';
// Removed missing SignUpComponent import
import { BirthdayPartyBookingComponent } from './pages/birthday-party-booking/birthday-party-booking.component';
import { PaintingPartyBookingComponent } from './pages/painting-party-booking/painting-party-booking.component';
import { ArtClassBookingComponent } from './pages/art-class-booking/art-class-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeCopyComponent,
    AboutComponent,
    ContactComponent,
    PaintingPartiesComponent,
    BirthdayPartiesComponent,
    ArtClassesComponent,
  // Removed missing SignUpComponent from declarations
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    BirthdayPartyBookingComponent,
    PaintingPartyBookingComponent,
    ArtClassBookingComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
