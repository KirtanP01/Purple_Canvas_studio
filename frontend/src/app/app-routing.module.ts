import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HomeComponent as HomeCopyComponent } from './pages/home copy/home.component';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { PaintingPartiesComponent } from './pages/painting-parties/painting-parties.component';
import { BirthdayPartiesComponent } from './pages/birthday-parties/birthday-parties.component';
import { ArtClassesComponent } from './pages/art-classes/art-classes.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { Gallery } from './pages/gallery/gallery';
import { Reviews } from './pages/reviews/reviews';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home-copy', component: HomeCopyComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'painting-parties', component: PaintingPartiesComponent },
  { path: 'birthday-parties', component: BirthdayPartiesComponent },
  { path: 'art-classes', component: ArtClassesComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'gallery', component: Gallery },
  { path: 'reviews', component: Reviews }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
