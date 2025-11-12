import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  company: string;
  role: string;
  text: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-container bg-gray-50">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Empresas que han transformado sus procesos con nosotros
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div 
          *ngFor="let testimonial of testimonials; let i = index"
          class="card bg-white"
          [style.animation-delay]="(i * 0.1) + 's'">
          <div class="flex items-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-2xl text-white font-bold">
              {{ testimonial.avatar }}
            </div>
            <div class="ml-4">
              <h4 class="font-bold text-gray-900">{{ testimonial.name }}</h4>
              <p class="text-sm text-gray-600">{{ testimonial.role }}</p>
              <p class="text-sm text-primary-600 font-semibold">{{ testimonial.company }}</p>
            </div>
          </div>
          <p class="text-gray-700 italic">"{{ testimonial.text }}"</p>
        </div>
      </div>

      <!-- Logos de empresas -->
      <div class="text-center">
        <p class="text-lg font-semibold text-gray-700 mb-8">
          Empresas que confían en nosotros
        </p>
        <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div class="text-4xl font-bold text-gray-400">Empresa A</div>
          <div class="text-4xl font-bold text-gray-400">Empresa B</div>
          <div class="text-4xl font-bold text-gray-400">Empresa C</div>
          <div class="text-4xl font-bold text-gray-400">Empresa D</div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      name: 'María González',
      company: 'TechSolutions S.A.',
      role: 'Directora de Operaciones',
      text: 'Mente Zenú transformó completamente nuestros procesos internos. La automatización nos ahorró más del 40% de tiempo en tareas administrativas.',
      avatar: 'MG'
    },
    {
      name: 'Carlos Ramírez',
      company: 'Innovación Retail',
      role: 'CEO',
      text: 'El chatbot que implementaron ha mejorado significativamente la atención a nuestros clientes. Nuestro equipo puede enfocarse en tareas más estratégicas.',
      avatar: 'CR'
    },
    {
      name: 'Ana Martínez',
      company: 'Servicios Digitales Plus',
      role: 'Gerente General',
      text: 'La consultoría y acompañamiento fueron excepcionales. Nos ayudaron a identificar oportunidades que no habíamos considerado antes.',
      avatar: 'AM'
    }
  ];
}

