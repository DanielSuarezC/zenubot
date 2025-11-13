import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="section-container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div>
            <div class="mb-4">
              <img 
                src="assets/zenulab-logo.svg" 
                alt="ZenuLab Logo" 
                class="h-12 mb-2"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div class="hidden text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 via-blue-500 to-blue-700">
                ZenuLab
              </div>
            </div>
            <p class="text-gray-400 mb-2">
              Soluciones de software con identidad colombiana
            </p>
            <p class="text-gray-400 mb-4 text-sm">
              Automatización y optimización de procesos administrativos con Inteligencia Artificial
            </p>
            <p class="text-gray-500 text-sm italic mb-4">
              Innovación que Fluye, Raíces que Crecen
            </p>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Services -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Servicios</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Automatización de Procesos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Agentes de IA</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Optimización Administrativa</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integraciones Inteligentes</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Empresa</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Equipo</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Casos de éxito</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Contacto</h4>
            <ul class="space-y-2 text-gray-400">
              <li>📧 contactozenulab&#64;gmail.com</li>
              <li>📱 +57 314 471 4547</li>
              <li>📍 Montería y Córdoba, Colombia</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 ZenuLab. Todos los derechos reservados.
          </p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </a>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
}

