# Instrucciones de Instalación y Uso

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- Node.js (versión 18 o superior)
- npm (viene con Node.js)

## 🚀 Pasos para iniciar el proyecto

1. **Navega al directorio del proyecto:**
   ```bash
   cd C:\Users\force\mente-zenu-landing
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:4200
   ```

## 🔧 Configuración Adicional

### Integración con Backend

Para integrar el envío de correos automatizados:

1. Crea un servicio en `src/app/services/email.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://tu-api.com/api';

  constructor(private http: HttpClient) {}

  sendAppointmentEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email`, data);
  }
}
```

2. Actualiza `appointment.component.ts` para usar el servicio.

3. Actualiza `zenubot.component.ts` para enviar el resumen IEEE830 por correo.

### Personalización de Colores

Los colores se pueden personalizar en `tailwind.config.js`:
- `primary`: Tonos verdes (tecnología + naturaleza)
- `secondary`: Tonos azules (confianza)

### Integración con Botpress

Si deseas integrar Botpress en lugar del chatbot actual:

1. Instala el SDK de Botpress
2. Reemplaza el componente `zenubot.component.ts` con la integración de Botpress
3. Configura las credenciales en variables de entorno

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/mente-zenu-landing/`.

## 🌐 Despliegue

Puedes desplegar en:
- **Vercel**: Conecta tu repositorio Git
- **Netlify**: Arrastra la carpeta `dist/mente-zenu-landing`
- **Firebase Hosting**: Usa `firebase deploy`
- **AWS S3 + CloudFront**: Sube los archivos a S3

## 📝 Notas Importantes

- El chatbot Zenubot actualmente funciona con lógica básica. Para producción, considera integrar con Botpress o un servicio similar.
- El formulario de agendamiento requiere integración con backend para enviar correos.
- Los testimonios y logos de empresas son ejemplos. Reemplázalos con contenido real.

## 🐛 Solución de Problemas

### Error: "Cannot find module '@angular/...'"
```bash
npm install
```

### Error: "Tailwind CSS no funciona"
Verifica que `tailwind.config.js` esté en la raíz del proyecto y que `styles.scss` incluya las directivas de Tailwind.

### Error: "Port 4200 already in use"
```bash
ng serve --port 4201
```

