import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-container bg-white">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Agenda tu <span class="text-primary-600">asesoría gratuita</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Completa el formulario y el equipo de ZenuLab se pondrá en contacto contigo para analizar cómo podemos automatizar y optimizar tus procesos administrativos
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div 
          *ngIf="!submitted; else successMessage"
          class="card">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="nombre" class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input 
                type="text" 
                id="nombre"
                [(ngModel)]="formData.nombre"
                name="nombre"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            </div>

            <div>
              <label for="empresa" class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de empresa *
              </label>
              <input 
                type="text" 
                id="empresa"
                [(ngModel)]="formData.empresa"
                name="empresa"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="fecha" class="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha preferida *
                </label>
                <input 
                  type="date" 
                  id="fecha"
                  [(ngModel)]="formData.fecha"
                  name="fecha"
                  required
                  [min]="minDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              </div>

              <div>
                <label for="hora" class="block text-sm font-semibold text-gray-700 mb-2">
                  Hora preferida *
                </label>
                <select 
                  id="hora"
                  [(ngModel)]="formData.hora"
                  name="hora"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Selecciona una hora</option>
                  <option *ngFor="let hora of horasDisponibles" [value]="hora">
                    {{ hora }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label for="mensaje" class="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje adicional (opcional)
              </label>
              <textarea 
                id="mensaje"
                [(ngModel)]="formData.mensaje"
                name="mensaje"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
            </div>

            <button 
              type="submit"
              class="w-full btn-primary">
              Agendar reunión
            </button>
          </form>
        </div>

        <ng-template #successMessage>
          <div class="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
            <div class="text-center">
              <div class="text-6xl mb-4">✅</div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">
                ¡Gracias por confiar en ZenuLab!
              </h3>
              <p class="text-lg text-gray-700 mb-6">
                Recibirás en tu correo el resumen de requerimientos y el enlace de tu reunión.
              </p>
              <p class="text-sm text-gray-600">
                Nos pondremos en contacto contigo pronto para confirmar los detalles.
              </p>
            </div>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: []
})
export class AppointmentComponent {
  submitted = false;
  formData = {
    nombre: '',
    email: '',
    empresa: '',
    fecha: '',
    hora: '',
    mensaje: ''
  };

  horasDisponibles = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.isFormValid()) {
      // Aquí se integraría con el backend para enviar el correo
      console.log('Datos del formulario:', this.formData);
      
      // Simular envío
      setTimeout(() => {
        this.submitted = true;
        // En producción, aquí se enviaría el correo con el resumen y confirmación
        this.sendEmailConfirmation();
      }, 500);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.nombre &&
      this.formData.email &&
      this.formData.empresa &&
      this.formData.fecha &&
      this.formData.hora
    );
  }

  sendEmailConfirmation() {
    // En producción, esto se haría mediante un servicio backend
    // que enviaría el correo con:
    // 1. Resumen de requerimientos (IEEE830)
    // 2. Confirmación y enlace de la reunión
    console.log('Enviando correo de confirmación...');
  }
}

