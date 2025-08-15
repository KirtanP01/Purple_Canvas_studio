import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeComponent as HomeCopyComponent } from './pages/home copy/home.component';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { PaintingPartiesComponent } from './pages/painting-parties/painting-parties.component';
import { BirthdayPartiesComponent } from './pages/birthday-parties/birthday-parties.component';
import { ArtClassesComponent } from './pages/art-classes/art-classes.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

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
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
