# CapiMercado 🚀

El ecosistema líder de comercio tecnológico en Venezuela. Construido con React, Vite y PocketBase.

---

## ⚙️ Entornos de Ejecución

Este proyecto está diseñado para trabajar principalmente dentro de un contenedor de desarrollo, lo que garantiza que todo el equipo comparta exactamente las mismas versiones de Node.js, PocketBase y herramientas del sistema.

---

## 💻 Modo Desarrollo (Recomendado)

En desarrollo no necesitas instalar Node, PocketBase ni configurar Docker Compose a mano. Todo el entorno (Frontend + Backend) se levanta automáticamente al abrir el proyecto dentro de su **Dev Container**.

### 🚀 Pasos para iniciar en un minuto:

1. **Clonar el repositorio y configurar variables:**

```bash
git clone https://github.com/tu-usuario/capimercado.git
cd capimercado

```

2. **Abrir en VS Code:**

```bash
code .

```

3. **Iniciar el Dev Container:**

- Cuando VS Code te lo pregunte en la esquina inferior derecha, haz clic en **"Reopen in Container"** (Reabrir en contenedor).
- _O abre la paleta de comandos (`Ctrl + Shift + P`) y escribe:_ `Dev Containers: Rebuild and Reopen in Container`.

### ⚡ ¿Qué ocurre automáticamente tras abrirlo?

El Dev Container está configurado para encargarse de todo el trabajo sucio en segundo plano:

- Arranca el servidor de **PocketBase (Backend)**.
- Ejecuta `npm install` en la carpeta del frontend.
- Levanta el servidor de desarrollo de **Vite (Frontend)** exponiéndolo correctamente.

### 🔑 Primer Paso Requerido (Crear Administrador)

Pocketbase no crea el SuperUsuario del panel por defecto

### 📍 Direcciones Locales de Desarrollo

| Servicio        | URL Local                                             | Descripción                                           |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **Frontend**    | [http://localhost:5173](http://localhost:5173)        | Aplicación React + Vite con recarga en vivo           |
| **Backend API** | [http://localhost:8090](http://localhost:8090)        | API REST y bases de datos de PocketBase               |
| **Panel Admin** | [http://localhost:8090/\_/](http://localhost:8090/_/) | Interfaz gráfica de PocketBase para administrar la DB |

---

## 🌐 Modo Producción

> ⚠️ **Nota:** Las instrucciones para el despliegue automatizado y la integración continua (CI/CD) a producción se encuentran actualmente **en fase de diseño**.

Para emular o probar el comportamiento del entorno de producción de manera local utilizando Docker, puedes utilizar el archivo compose tradicional:

```bash
# Ejecutar la build de producción localmente
docker-compose up -d --build

```

_En este modo, el frontend se sirve compilado de forma estática a través de un servidor web seguro (Nginx) en el puerto estándar `http://localhost`._

---

## 🧪 Pruebas

### Pruebas de Carga (k6)

Para simular 500 usuarios concurrentes contra la API:

```bash
k6 run scripts/load_test.js

```

### Verificación E2E

Para correr las pruebas de extremo a extremo:

```bash
node scripts/e2e_verify.js

```

---

## 📄 Licencia

Propiedad de ADJML LLC. Todos los derechos reservados.
