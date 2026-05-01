# CapiMercado 🚀

El ecosistema líder de comercio tecnológico en Venezuela. Construido con React, Vite y PocketBase.

## 🛠️ Requisitos Previos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- Node.js 22+ (solo para desarrollo local sin Docker)

## 🚀 Instalación Rápida

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/capimercado.git
   cd capimercado
   ```

2. **Configurar el entorno:**
   Copia el archivo de ejemplo y rellena tus credenciales (Google OAuth, Resend SMTP):
   ```bash
   cp .env.example .env
   ```

3. **Levantar el sistema:**
   ```bash
   docker-compose up -d --build
   ```

4. **Acceder:**
   - **Frontend:** [http://localhost](http://localhost)
   - **Admin Panel:** [http://localhost:8090/_/](http://localhost:8090/_/)

## 🔒 Seguridad y Gestión de Secretos

- **Variables de Entorno:** Todas las llaves privadas se gestionan en el archivo `.env` (excluido de Git).
- **Hardening:** Nginx está configurado con políticas de **Rate Limiting** y encabezados de seguridad (**CSP, XSS Protection**).
- **Base de Datos:** PocketBase utiliza reglas de API granulares para proteger los datos de los usuarios.

## 🧪 Pruebas

### Pruebas de Carga (k6)
Para simular 500 usuarios concurrentes:
```bash
k6 run scripts/load_test.js
```

### Verificación E2E
```bash
node scripts/e2e_verify.js
```

## 📄 Licencia

Propiedad de ADJML LLC. Todos los derechos reservados.
