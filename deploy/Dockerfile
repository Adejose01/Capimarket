# =========================================================
# Dockerfile para Frontend de Producción
# =========================================================
# Este Dockerfile se usa en docker-compose.prod.yml para construir
# la imagen del frontend y el servidor de producción.
# =========================================================

# =======================================================
# Etapa 1: Construcción (Builder)
# =======================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos los manifiestos de dependencias desde la subcarpeta correcta
COPY apps/frontend/package*.json ./

# Instalamos dependencias en caché (npm cache se limpia después)
RUN npm ci && npm cache clean --force

# Copiamos TODO el contenido de la subcarpeta del frontend al WORKDIR
COPY apps/frontend/ .

# Variable de entorno para la URL de PocketBase
ARG VITE_PB_URL
ENV VITE_PB_URL=$VITE_PB_URL

# Construcción de la aplicación
RUN npm run build

# =======================================================
# Etapa 2: Servidor Ligero (Nginx de Producción)
# =======================================================
FROM nginx:1.25-alpine

# Copiamos el frontend construido
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos la configuración de Nginx específica para frontend
COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/frontend.conf

# Eliminamos la configuración por defecto si existe
RUN rm -f /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]