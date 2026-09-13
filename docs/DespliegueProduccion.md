# Guía de Despliegue de Producción - Capimarket

Este documento describe todos los cambios realizados para preparar Capimarket para producción.

## 📁 Estructura de Archivos

```
.
├── deploy/
│   ├── docker-compose.prod.yml    # Definición de servicios para producción
│   ├── Dockerfile                 # Imagen del frontend con Nginx
│   ├── Dockerfile.pb              # Imagen de PocketBase
│   ├── nginx/
│   │   ├── nginx.conf             # Configuración principal de Nginx
│   │   └── frontend.conf          # Configuración del frontend
│   └── README.md                  # Documentación de despliegue
├── scripts/
│   └── deploy.sh                  # Script interactivo de despliegue
├── .env.pb_password               # Contraseña de PocketBase
├── .env.production                # Variables de entorno de producción
├── .env.production.example        # Plantilla de variables
├── .dockerignore                  # Archivos excluidos de Docker
└── docs/
    └── DespliegueProduccion.md    # Este archivo
```

## 🔄 Cambios Realizados

### 1. docker-compose.prod.yml

#### Servicios Actualizados

**Frontend:**
- Imagen definida como `capimarket/frontend:latest`
- Healthcheck con wget para verificar disponibilidad
- Resource limits: 0.5 CPU, 256MB RAM (límite)
- Restart policy con timeout y delay
- Logging con rotación automática (10MB max, 3 archivos)
- Labels para gestión (app, service, env)
- `pids_limit: 200` para evitar ZOMBIE storms
- `security_opt: no-new-privileges:true`

**PocketBase:**
- Imagen definida como `capimarket/pocketbase:latest`
- Healthcheck para monitoreo
- Resource limits: 1.0 CPU, 512MB RAM (límite)
- Secrets para `PB_ADMIN_PASSWORD`
- Volumes con `:Z` flag para mapeo correcto de nombres de usuario
- `ulimits: nofile: 65536` para manejar muchas conexiones
- `pids_limit: 200`
- Labels y security options

**Nginx:**
- Healthcheck para monitoreo
- Resource limits: 0.25 CPU, 128MB RAM (límite)
- Configuración actualizada para usar upstreams
- `pids_limit: 100`
- `ulimits: nofile: 65536`

#### Nuevas Secciones

- **Secrets**: Definición para `pb_admin_password` que lee de `.env.pb_password`
- **Networks**: Red bridge `capimarket_prod` con subnet `172.28.0.0/16`
- **Volumes**: Volumes nombrados para persistencia

### 2. nginx.conf

- **Upstreams**: Definición de backend pools para frontend y pocketbase
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS
- **Gzip**: Compresión para múltiples tipos de contenido
- **Logging**: Formato personalizado con tiempos de respuesta
- **Timeouts**: Configuración específica para cada tipo de endpoint
- **Limitación de conexiones**: `limit_conn 10` por IP

### 3. Dockerfile (Frontend)

- **Multi-stage build**: Etapa de construcción separada de producción
- **Cache cleanup**: `npm cache clean --force`
- **Usuario no-root**: Seguridad mejorada
- **Configuración Nginx**: Uso de `frontend.conf` como upstream

### 4. Dockerfile.pb (PocketBase)

- **Usuario no-root**: Creación de usuario `pb` con UID/GID 1000
- **Security**: `chown -R pb:pb /pb` para permisos correctos
- **Cleanup**: Eliminación de caché de apt y npm
- **Versión**: Argumento `PB_VERSION` para fácil actualización

### 5. .dockerignore

Archivos excluidos de Docker:
- `node_modules`, `npm-debug.log`
- `pb/pb_data`, `postgres-data`, `*.db`, `*.sqlite`
- `.env`, `.env.local`, `.env.production`, `.env.pb_password`
- `dist`, `build`, `*.log`
- Archivos de IDE, Docker, test, scripts

### 6. scripts/deploy.sh

Script interactivo con menú:
- Verificar y levantar
- Construir y levantar
- Verificar estado y healthchecks
- Ver logs
- Reiniciar servicios
- Detener servicios
- Detener y limpiar (con confirmación)

### 7. Variables de Entorno

Archivos creados:
- `.env.pb_password`: Contraseña de administrador de PocketBase
- `.env.production`: Variables de entorno completas
- `.env.production.example`: Plantilla documentada

## 🚀 Instrucciones de Despliegue

### Método 1: Script Interactivo (Recomendado)

```bash
# Dar permisos de ejecución
chmod +x scripts/deploy.sh

# Ejecutar script
./scripts/deploy.sh
```

### Método 2: Comandos Manuales

```bash
# 1. Configurar contraseña
echo "TuContraseñaMuySegura123!" > .env.pb_password

# 2. Configurar variables de entorno
cp .env.production.example .env.production

# 3. Construir imágenes
docker-compose -f deploy/docker-compose.prod.yml build

# 4. Levantar servicios
docker-compose -f deploy/docker-compose.prod.yml up -d

# 5. Verificar estado
docker-compose -f deploy/docker-compose.prod.yml ps

# 6. Ver logs
docker-compose -f deploy/docker-compose.prod.yml logs -f

# 7. Detener
docker-compose -f deploy/docker-compose.prod.yml down
```

## 📊 Estructura de Servicios

| Servicio | Imagen | Puertos | Recursos | Descripción |
|----------|--------|---------|----------|-------------|
| frontend | capimarket/frontend:latest | 80 | 0.5 CPU, 256MB | Nginx con SPA construida |
| pocketbase | capimarket/pocketbase:latest | 8090 (interno) | 1.0 CPU, 512MB | Backend API con SQLite |
| nginx | nginx:alpine | 80 | 0.25 CPU, 128MB | Reverse proxy |

## 🔐 Seguridad Implementada

- ✅ **No-root users**: PocketBase y frontend corren como usuario `pb`
- ✅ **no-new-privileges**: Previene elevación de privilegios
- ✅ **Resource limits**: CPU y memoria limitados
- ✅ **Healthchecks**: Monitoreo automático de salud
- ✅ **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS
- ✅ **Secrets management**: Contraseña fuera del YAML
- ✅ **Network isolation**: Red dedicada con subnet propia
- ✅ **Volume persistence**: Datos persistentes nombrados
- ✅ **PID limits**: Evita ZOMBIE storms
- ✅ **Ulimits**: Control de file descriptors

## 📝 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_PB_URL` | URL de PocketBase | `http://pocketbase:8090` |
| `PB_ADMIN_EMAIL` | Email de administrador | Configurar |
| `PB_ADMIN_PASSWORD` | Contraseña de administrador | Configurar |
| `PB_PASSWORD_FILE` | Archivo de contraseña | `.env.pb_password` |
| `PB_DATA_DIR` | Directorio de datos | `/pb/pb_data` |
| `PB_MIGRATIONS_DIR` | Directorio de migraciones | `/pb/pb_migrations` |
| `PB_HOOKS_DIR` | Directorio de hooks | `/pb/pb_hooks` |
| `NGINX_SERVER_NAMES` | Dominios permitidos | `localhost capimercado.com` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `APP_NAME` | Nombre de la app | `Capimarket` |
| `APP_URL` | URL del sitio | `https://capimercado.com` |
| `ENABLE_HSTS` | Habilitar HSTS | `true` |
| `HSTS_MAX_AGE` | Tiempo de HSTS | `31536000` |
| `MAINTENANCE_MODE` | Modo de mantenimiento | `false` |

## 🔄 Actualización

```bash
# 1. Construir nuevas imágenes
docker-compose -f deploy/docker-compose.prod.yml build

# 2. Detener y reiniciar
docker-compose -f deploy/docker-compose.prod.yml down
docker-compose -f deploy/docker-compose.prod.yml up -d

# O forzar recreación
docker-compose -f deploy/docker-compose.prod.yml up -d --force-recreate
```

## 🐛 Troubleshooting

### Servicios no se inician
```bash
docker-compose -f deploy/docker-compose.prod.yml logs
docker-compose -f deploy/docker-compose.prod.yml ps
```

### Contraseña incorrecta
```bash
docker-compose -f deploy/docker-compose.prod.yml up -d pocketbase
sleep 5
# Acceder a http://localhost:8090 y cambiar contraseña
```

### Nginx no responde
```bash
docker exec nginx nginx -t
docker logs nginx
```

## 📚 Documentación Adicional

- [`deploy/README.md`](../deploy/README.md) - Documentación técnica de despliegue
- [`docs/Produccion.md`](./Produccion.md) - Guía general de producción
- [`docs/Configuración del Backend de CapiMercado.md`](./Configuración del Backend de CapiMercado.md) - Configuración del backend

## ✏️ Historial de Cambios

### Versión 2.0 - Docker Nativo (2026-09-13)
- ✅ Migración de Podman a Docker nativo
- ✅ Actualización de todos los comandos de despliegue
- ✅ Mejoras de seguridad (no-root, secrets, limits)
- ✅ Healthchecks para todos los servicios
- ✅ Network isolation con subnet dedicada
- ✅ Volumes nombrados para persistencia
- ✅ Logging con rotación automática
- ✅ Restart policies robustos
- ✅ Resource limits por servicio
- ✅ Security headers en Nginx
- ✅ Script interactivo de despliegue

### Versión 1.0 - Desarrollo
- Configuración inicial de desarrollo
- Docker Compose sin optimizaciones
- Sin healthchecks
- Sin resource limits
