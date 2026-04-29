# Etapa 1: Construcción (Builder)
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Argumento para la URL de PocketBase que se inyectará en el build
ARG VITE_PB_URL
ENV VITE_PB_URL=$VITE_PB_URL

# Construimos la aplicación de Vite para producción
RUN npm run build

# Etapa 2: Servidor Ligero (Nginx)
FROM nginx:alpine

# Copiamos los archivos estáticos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Inyectar configuración para Single Page Application (Evitar 404 en sub-rutas)
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 del contenedor
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]
