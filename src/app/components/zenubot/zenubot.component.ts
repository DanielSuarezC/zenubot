import { Component, AfterViewInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-zenubot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-container bg-gradient-to-br from-gray-50 to-primary-50">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Interactúa con <span class="text-primary-600">Zenubot</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Habla con nuestro asistente Zenubot para contarnos sobre tu negocio y obtén asesoría personalizada.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 class="text-xl font-bold">Zenubot</h3>
                <p class="text-sm opacity-90">Asistente de Mente Zenú</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div id="bp-embedded-webchat"></div>
          </div>
        </div>

        <div class="mt-8 bg-blue-50 border-l-4 border-secondary-600 p-6 rounded-lg">
          <div class="flex items-start gap-3">
            <div class="text-2xl">ℹ️</div>
            <div>
              <h4 class="font-bold text-gray-900 mb-2">¿Qué hace Zenubot?</h4>
              <p class="text-gray-700">
                Zenubot recopila tus necesidades y te conecta con nuestro equipo para diseñar soluciones de inteligencia artificial a medida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host ::ng-deep #bp-embedded-webchat {
        position: relative;
        width: 100%;
        height: 500px;
      }

      :host ::ng-deep #bp-embedded-webchat .bpWebchat {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
      }

      :host ::ng-deep #bp-embedded-webchat .bpFab {
        display: none;
      }
    `
  ]
})
export class ZenubotComponent implements AfterViewInit, OnDestroy {
  private readonly scriptId = 'botpress-webchat-script';
  private botpressInitialized = false;
  private readyHandlerRegistered = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.loadBotpressScript();
  }

  ngOnDestroy(): void {
    if (window.botpress) {
      try {
        window.botpress.close();
      } catch (error) {
        console.warn('No fue posible cerrar Botpress limpiamente.', error);
      }
    }
  }

  private loadBotpressScript(): void {
    const existingScript = this.document.getElementById(this.scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.botpress) {
        this.initializeBotpress();
      } else {
        existingScript.addEventListener('load', () => this.initializeBotpress(), { once: true });
      }
      return;
    }

    const script = this.renderer.createElement('script') as HTMLScriptElement;
    script.id = this.scriptId;
    script.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script.async = true;
    script.onload = () => this.initializeBotpress();

    this.renderer.appendChild(this.document.body, script);
  }

  private initializeBotpress(): void {
    if (!window.botpress) {
      console.warn('Botpress aún no está disponible.');
      return;
    }

    if (!this.readyHandlerRegistered) {
      window.botpress.on('webchat:ready', () => {
        window.botpress?.open();
      });
      this.readyHandlerRegistered = true;
    }

    if (this.botpressInitialized) {
      window.botpress.open();
      return;
    }

    window.botpress.init({
      botId: '25d96f48-f43b-427c-a5d6-952ecfbeacf4',
      configuration: {
        version: 'v2',
        botName: 'Zenubot',
        botDescription: '🤖 Soy Zenubot, el asistente inteligente de Mente Zenú. Ayudo a emprendedores y dueños de MiPymes en Montería y Córdoba a descubrir cómo la automatización y la inteligencia artificial pueden impulsar sus negocios. 💡',
        website: {},
        email: {email: 'contactozenulab@gmail.com'},
        phone: {phone: '+57 3144714547'},
        termsOfService: {},
        privacyPolicy: {},
        color: '#159F48',
        variant: 'solid',
        headerVariant: 'glass',
        themeMode: 'light',
        fontFamily: 'inter',
        radius: 4,
        feedbackEnabled: true,
        footer: '[⚡ by Botpress](https://botpress.com/?from=webchat)',
        soundEnabled: true,
        proactiveMessageEnabled: true,
        proactiveBubbleMessage: '¿Cuál es el proceso de tu negocio que más te gustaría automatizar o mejorar con ayuda de la tecnología?',
        proactiveBubbleTriggerType: 'afterDelay',
        proactiveBubbleDelayTime: 10
      },
      clientId: '96122d4a-eff7-459e-bf53-3a9c2bad7d19',
      selector: '#bp-embedded-webchat'
    });

    this.botpressInitialized = true;
  }
}

