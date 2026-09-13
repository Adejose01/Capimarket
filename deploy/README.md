# Capimarket - Configuración de Producción

Esta carpeta contiene todos los archivos necesarios para desplegar Capimarket en producción.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.prod.yml` | Definición de servicios para producción |
| `Dockerfile` | Imagen del frontend con Nginx |
| `Dockerfile.pb` | Imagen de PocketBase |
| `nginx/` | Configuración de Nginx |
| `README.md` | Esta documentación |

## Requisitos Previos

- [Docker](https://www.docker.com/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/) v2.0+

## Configuración Inicial

### 1. Copiar y configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.production.example .env.production

# Editar las credenciales
nano .env.production
```

### 2. Configurar la contraseña de PocketBase

```bash
# Método 1: Usar el archivo .env.pb_password (RECOMENDADO)
echo "TuContraseñaMuySegura123!" > .env.pb_password

# Método 2: Usar la variable directa en .env.production
# PB_ADMIN_PASSWORD=TuContraseñaMuySegura123!
```

### 3. Construir las imágenes

```bash
docker-compose -f docker-compose.prod.yml build
```

### 4. Levantar los servicios

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Verificar el estado

```bash
docker-compose -f docker-compose.prod.yml ps
```

## Estructura de Servicios

### Frontend
- **Imágenes**: `capimarket/frontend:latest`
- **Puertos**: 80 (expuesto externamente)
- **Descripción**: Nginx con la aplicación construida con Vite
- **Recursos**: 0.5 CPU, 256MB RAM (límite)

### PocketBase
- **Imágenes**: `capimarket/pocketbase:latest`
- **Puertos**: 8090 (interno, proxy por Nginx)
- **Descripción**: Backend API con SQLite
- **Recursos**: 1.0 CPU, 512MB RAM (límite)

### Nginx
- **Imágenes**: `nginx:alpine`
- **Puertos**: 80 (expuesto externamente)
- **Descripción**: Reverse proxy y servidor web
- **Recursos**: 0.25 CPU, 128MB RAM (límite)

## Variables de Entorno

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
| `HSTS_MAX_AGE` | Tiempo de HSTS (segundos) | `31536000` |
| `MAINTENANCE_MODE` | Modo de mantenimiento | `false` |

## Gestión de Secretos

### Usar Docker Secrets (Opcional)

```bash
# Crear secreto para la contraseña
docker secret create pb_admin_password .env.pb_password

# Reiniciar con el secreto
docker-compose -f docker-compose.prod.yml up -d
```

### Eliminar secretos

```bash
docker secret rm pb_admin_password
```

## Logs

Ver los logs de los servicios:

```bash
# Ver todos los logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f pocketbase
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## Detener los servicios

```bash
docker-compose -f docker-compose.prod.yml down
```

## Reiniciar servicios específicos

```bash
# Reiniciar frontend
docker-compose -f docker-compose.prod.yml up -d --force-recreate frontend

# Reiniciar todos
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## Network

La aplicación usa una red bridge llamada `capimarket_prod` con subnet `172.28.0.0/16`.

Los servicios se comunican entre sí por nombre de servicio:
- `frontend` → `http://pocketbase:8090`
- `nginx` → `frontend:80`, `pocketbase:8090`

## Volumes

| Volumen | Descripción |
|---------|-------------|
| `capimarket_pb_data` | Base de datos SQLite de PocketBase |
| `capimarket_pb_migrations` | Migraciones de PocketBase |
| `capimarket_pb_hooks` | Hooks de PocketBase |

## Seguridad

- **No-root users**: PocketBase y Nginx corren como usuario `pb`
- **no-new-privileges**: Previene la elevación de privilegios
- **Resource limits**: CPU y memoria limitados por servicio
- **Healthchecks**: Monitoreo de salud de cada servicio
- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS

## Troubleshooting

### Problema: Servicios no se inician

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs

# Verificar healthchecks
docker-compose -f docker-compose.prod.yml ps
```

### Problema: Contraseña incorrecta

```bash
# Resetear PocketBase
docker-compose -f docker-compose.prod.yml up -d pocketbase
sleep 5
# Acceder a la UI de PocketBase y cambiar la contraseña
```

### Problema: Nginx no responde

```bash
# Ver configuración de Nginx
docker exec nginx nginx -t

# Ver logs de Nginx
docker logs nginx
```

## Actualización

Para actualizar la aplicación:

```bash
# 1. Construir nuevas imágenes
docker-compose -f docker-compose.prod.yml build

# 2. Detener servicios
docker-compose -f docker-compose.prod.yml down

# 3. Reiniciar
docker-compose -f docker-compose.prod.yml up -d
```

## Documentación Adicional

- [Producción.md](../docs/Produccion.md) - Guía general de producción
- [Configuración del Backend de CapiMercado.md](../docs/Configuración del Backend de CapiMercado.md) - Configuración del backend
