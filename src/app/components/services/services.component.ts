import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-container bg-white">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ¿Qué hacemos?
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Soluciones inteligentes diseñadas para impulsar tu negocio
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          *ngFor="let service of services; let i = index" 
          class="card"
          [style.animation-delay]="(i * 0.1) + 's'">
          <div class="text-5xl mb-4 text-primary-600">{{ service.icon }}</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ service.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ service.description }}</p>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: '🤖',
      title: 'Automatización de Procesos',
      description: 'Optimizamos tus operaciones internas mediante sistemas inteligentes que reducen tareas manuales y aumentan la eficiencia.'
    },
    {
      icon: '💬',
      title: 'Chatbots Empresariales',
      description: 'Asistentes virtuales personalizados que atienden a tus clientes 24/7, mejorando la experiencia y liberando tiempo de tu equipo.'
    },
    {
      icon: '🔗',
      title: 'Integraciones de IA',
      description: 'Conectamos herramientas de IA con tus sistemas existentes para crear flujos de trabajo más inteligentes y productivos.'
    },
    {
      icon: '📊',
      title: 'Consultoría Digital',
      description: 'Acompañamiento estratégico en tu transformación digital, identificando oportunidades y diseñando soluciones a medida.'
    }
  ];
}

