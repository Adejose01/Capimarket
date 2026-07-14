# =========================================================
# Etapa 1: Construcción (Builder)
# =========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos los manifiestos desde la subcarpeta correcta
COPY apps/frontend/package*.json ./

RUN npm ci

# Copiamos TODO el contenido de la subcarpeta del frontend al WORKDIR
COPY apps/frontend/ .

ARG VITE_PB_URL
ENV VITE_PB_URL=$VITE_PB_URL

RUN npm run build

# =========================================================
# Etapa 2: Servidor Ligero (Nginx de Producción)
# =========================================================
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Ajustado a la ruta real de tu árbol de archivos
COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]