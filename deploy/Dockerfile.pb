FROM node:22-bookworm-slim

# Instalar dependencias del sistema necesarias (unzip para PB, libvips para Sharp)
RUN apt-get update && apt-get install -y \
    unzip \
    ca-certificates \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Versión de PocketBase
ARG PB_VERSION=0.23.0

# Descargar y extraer PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Instalar sharp en el directorio de PocketBase para los hooks
WORKDIR /pb
RUN npm install sharp

# =========================================================
# PASO PROFESIONAL: Autocontener el código en producción
# =========================================================

# Copiamos tus migraciones y hooks locales dentro de la imagen
COPY apps/pocketbase/pb_migrations /pb/pb_migrations
COPY apps/pocketbase/pb_hooks /pb/pb_hooks

# Creamos la carpeta de la base de datos (se mantendrá vacía en la imagen,
# ya que en producción mapearemos un volumen externo para conservar los datos de SQLite)
RUN mkdir -p /pb/pb_data

EXPOSE 8090

# Arrancar PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]