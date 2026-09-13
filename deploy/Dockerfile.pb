# =========================================================
# Dockerfile para PocketBase de Producción
# =========================================================
# Este Dockerfile se usa en docker-compose.prod.yml para construir
# la imagen del backend PocketBase con las mejores prácticas.
# =========================================================

FROM node:22-bookworm-slim

# =======================================================
# Configuración de seguridad y optimizaciones
# =======================================================

# Establecer variables de entorno por defecto
ENV NODE_ENV=production \
    PB_DATA_DIR=/pb/pb_data \
    PB_MIGRATIONS_DIR=/pb/pb_migrations \
    PB_HOOKS_DIR=/pb/pb_hooks

# Crear usuario no root para seguridad
RUN groupadd --gid 1000 pb && \
    useradd --uid 1000 --gid 1000 --shell /bin/sh --create-home pb

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    unzip \
    ca-certificates \
    libvips-dev \
    libvips \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# =======================================================
# Versión de PocketBase
# =======================================================
ARG PB_VERSION=0.23.0

# Descargar y extraer PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /tmp/ && \
    mv /tmp/pocketbase_* /tmp/pocketbase && \
    rm -rf /tmp/pb.zip /tmp/pocketbase_*

# Copiar PocketBase a la ruta final
COPY --from=builder /tmp/pocketbase/pocketbase /pb/pocketbase
RUN chmod +x /pb/pocketbase

# =======================================================
# Instalación de Sharp para optimización de imágenes
# =======================================================
WORKDIR /pb
RUN npm install sharp \
    && npm cache clean --force

# =======================================================
# Autocontener el código en producción
# =======================================================

# Copiamos tus migraciones y hooks locales dentro de la imagen
COPY apps/pocketbase/pb_migrations /pb/pb_migrations
COPY apps/pocketbase/pb_hooks /pb/pb_hooks

# Creamos las carpetas necesarias con permisos correctos
RUN chown -R pb:pb /pb && \
    mkdir -p /pb/pb_data && \
    chown -R pb:pb /pb/pb_data

# =======================================================
# Entrypoint y CMD
# =======================================================

# Cambiamos a usuario no root
USER pb

# Exponemos el puerto 8090
EXPOSE 8090

# Arrancar PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]