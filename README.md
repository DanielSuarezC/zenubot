# ZenuLab - Landing Page

Landing page profesional y moderna para ZenuLab, una empresa que crea soluciones de software con identidad colombiana, especializada en automatización y optimización de procesos administrativos con Inteligencia Artificial.

## 🚀 Tecnologías

- **Angular 17** - Framework principal
- **Tailwind CSS** - Estilos y diseño
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos personalizados

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm start
```

3. Abre tu navegador en `http://localhost:4200`

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero/              # Sección principal
│   │   ├── services/          # Servicios ofrecidos
│   │   ├── zenubot/           # Chatbot integrado
│   │   ├── appointment/       # Formulario de agendamiento
│   │   ├── testimonials/      # Testimonios y logos
│   │   └── footer/            # Pie de página
│   └── app.component.ts       # Componente principal
├── styles.scss                 # Estilos globales con Tailwind
└── index.html                  # HTML principal
```

## ✨ Características

- ✅ Diseño responsive y moderno
- ✅ Animaciones suaves al hacer scroll
- ✅ Chatbot Zenubot integrado con captura de requerimientos IEEE830
- ✅ Formulario de agendamiento de reuniones
- ✅ SEO optimizado
- ✅ Arquitectura modular y componentes reutilizables

## 🎨 Personalización

Los colores y estilos se pueden personalizar en:
- `tailwind.config.js` - Configuración de colores y temas
- `src/styles.scss` - Estilos globales y componentes

## 📧 Integración Backend

Para integrar con el backend y enviar correos automatizados:

1. Crea un servicio en `src/app/services/email.service.ts`
2. Integra con tu API en el componente `appointment.component.ts`
3. Configura el envío de correos con el resumen IEEE830 y confirmación de reunión

## 🌐 Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/mente-zenu-landing`.

## 🖼️ Logo de ZenuLab

Para agregar el logo de ZenuLab:

1. Coloca el archivo del logo (preferiblemente en formato SVG) en la carpeta `src/assets/`
2. Nombra el archivo como `zenulab-logo.svg`
3. El logo aparecerá automáticamente en:
   - Hero section (sección principal)
   - Footer (pie de página)

Si el logo no se encuentra, se mostrará un texto alternativo con el nombre "ZenuLab" en gradiente.

## 📝 Licencia

© 2025 ZenuLab. Todos los derechos reservados.

**Innovación que Fluye, Raíces que Crecen**

