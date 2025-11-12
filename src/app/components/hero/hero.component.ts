import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style="animation-delay: 2s;"></div>
      </div>

      <div class="section-container relative z-10 text-center animate-fade-in">
        <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
          Transforma tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">MiPyme</span> con Inteligencia Artificial
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.2s;">
          Automatizamos tus procesos para que te concentres en hacer crecer tu negocio
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.4s;">
          <button 
            (click)="scrollToZenubot()" 
            class="btn-primary">
            Habla con Zenubot
          </button>
          <button 
            (click)="scrollToAppointment()" 
            class="btn-secondary">
            Agenda una reunión
          </button>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  `,
  styles: []
})
export class HeroComponent {
  scrollToZenubot() {
    const element = document.querySelector('app-zenubot');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToAppointment() {
    const element = document.querySelector('app-appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

