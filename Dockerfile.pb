FROM node:22-bookworm-slim

# Instalar dependencias necesarias (unzip para PB, libvips para Sharp)
RUN apt-get update && apt-get install -y \
    unzip \
    ca-certificates \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Versión de PocketBase para compatibilidad con la nueva API del objeto app
ARG PB_VERSION=0.23.0

# Descargar y extraer PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Instalar sharp en el directorio de PocketBase para que los hooks puedan usarlo
WORKDIR /pb
RUN npm install sharp

# Crear directorios si no existen para evitar errores de montaje
RUN mkdir -p /pb/pb_data /pb/pb_migrations /pb/pb_hooks

EXPOSE 8090

# Arrancar PocketBase permitiendo conexiones externas (0.0.0.0)
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]
