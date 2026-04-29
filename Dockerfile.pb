FROM alpine:latest

# Instalar dependencias necesarias
RUN apk add --no-cache unzip ca-certificates

# Versión de PocketBase para compatibilidad con la nueva API del objeto app
ARG PB_VERSION=0.23.0

# Descargar y extraer PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Crear directorios si no existen para evitar errores de montaje
RUN mkdir -p /pb/pb_data /pb/pb_migrations /pb/pb_hooks

EXPOSE 8090

# Arrancar PocketBase permitiendo conexiones externas (0.0.0.0)
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]
