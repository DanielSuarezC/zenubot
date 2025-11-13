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
          Nuestras Soluciones
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Automatización y optimización de procesos administrativos con Inteligencia Artificial
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
      icon: '⚙️',
      title: 'Automatización de Procesos Administrativos',
      description: 'Optimizamos y automatizamos tus procesos administrativos mediante sistemas inteligentes que reducen tareas manuales, eliminan errores y aumentan la eficiencia operativa.'
    },
    {
      icon: '🤖',
      title: 'Agentes de IA Personalizados',
      description: 'Desarrollamos agentes de inteligencia artificial como Zenubot, diseñados específicamente para tu negocio, que optimizan procesos y mejoran la productividad.'
    },
    {
      icon: '🔗',
      title: 'Integraciones Inteligentes',
      description: 'Conectamos herramientas de IA con tus sistemas existentes para crear flujos de trabajo automatizados y optimizados que se adaptan a tu operación.'
    },
    {
      icon: '📊',
      title: 'Optimización de Procesos',
      description: 'Analizamos y optimizamos tus procesos administrativos identificando cuellos de botella y oportunidades de mejora con soluciones tecnológicas a medida.'
    }
  ];
}

