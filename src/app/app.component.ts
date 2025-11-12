import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { ZenubotComponent } from './components/zenubot/zenubot.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // RouterOutlet,
    HeroComponent,
    ServicesComponent,
    // ZenubotComponent,
    AppointmentComponent,
    TestimonialsComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen">
      <app-hero></app-hero>
      <app-services></app-services>
      <!-- <app-zenubot></app-zenubot> -->
      <app-appointment></app-appointment>
      <app-testimonials></app-testimonials>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Mente Zenú';
}

