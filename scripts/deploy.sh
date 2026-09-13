#!/bin/bash

# =========================================================
# Capimarket - Script de Despliegue de Producción
# =========================================================
# Este script ayuda a desplegar la aplicación en producción
# =========================================================

set -e

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que Docker está disponible
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Por favor instale Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado. Por favor instale Docker Compose primero."
        exit 1
    fi
    
    log_info "Docker y Docker Compose están disponibles."
}

# Verificar que los archivos de configuración existen
check_config_files() {
    log_info "Verificando archivos de configuración..."
    
    if [ ! -f ".env.pb_password" ]; then
        log_warn "Archivo .env.pb_password no encontrado. Creando archivo vacío."
        echo "TODO_MUY_SEGURO_123" > .env.pb_password
        log_info "Archivo .env.pb_password creado. ¡EDITA ESTO CON UNA CONTRASEÑA REAL!"
    fi
    
    if [ ! -f ".env.production" ]; then
        log_warn "Archivo .env.production no encontrado. Copiando desde ejemplo."
        cp .env.production.example .env.production
        log_info "Archivo .env.production creado desde ejemplo."
    fi
    
    if [ ! -f ".env.production" ] || [ ! -f ".env.pb_password" ]; then
        log_error "Archivos de configuración faltantes. Abortando."
        exit 1
    fi
    
    log_info "Archivos de configuración verificados."
}

# Construir imágenes
build() {
    log_info "Construyendo imágenes Docker..."
    docker-compose -f deploy/docker-compose.prod.yml build
    log_info "Imágenes construidas."
}

# Levantar servicios
up() {
    log_info "Levantando servicios en producción..."
    docker-compose -f deploy/docker-compose.prod.yml up -d
    log_info "Servicios levantados."
}

# Verificar estado
status() {
    log_info "Verificando estado de los servicios..."
    docker-compose -f deploy/docker-compose.prod.yml ps
}

# Verificar que todos los servicios están saludables
health_check() {
    log_info "Verificando healthchecks de los servicios..."
    sleep 10  # Esperar un poco para que los healthchecks corran
    
    local healthy=0
    local total=3
    
    for service in frontend pocketbase nginx; do
        local status=$(docker-compose -f deploy/docker-compose.prod.yml ps --filter "name=.*$service.*" --format "{{.Status}}")
        if [[ "$status" == *"healthy"* ]]; then
            log_info "✓ $service: healthy"
            ((healthy++))
        elif [[ "$status" == *"running"* ]]; then
            log_warn "⚠ $service: running (pero no healthy)"
        else
            log_error "✗ $service: $status"
        fi
    done
    
    log_info "Status: $healthy/$total servicios healthy"
    
    if [ $healthy -eq $total ]; then
        log_info "¡Todos los servicios están saludables!"
    else
        log_warn "Algunos servicios no están saludables. Revisa los logs."
    fi
}

# Detener servicios
down() {
    log_info "Deteniendo servicios..."
    docker-compose -f deploy/docker-compose.prod.yml down
    log_info "Servicios detenidos."
}

# Reiniciar servicios
restart() {
    log_info "Reiniciando servicios..."
    docker-compose -f deploy/docker-compose.prod.yml up -d --force-recreate
    log_info "Servicios reiniciados."
}

# Mostrar menú de opciones
show_menu() {
    echo ""
    echo "============================================================"
    echo "  Capimarket - Despliegue de Producción"
    echo "============================================================"
    echo "1. Verificar y levantar (recomendado para primera vez)"
    echo "2. Construir y levantar"
    echo "3. Verificar estado y healthchecks"
    echo "4. Ver logs"
    echo "5. Reiniciar servicios"
    echo "6. Detener servicios"
    echo "7. Detener y limpiar (quita todos los datos)"
    echo "8. Salir"
    echo "============================================================"
    echo -n "Selecciona una opción [1-8]: "
    read -r choice
}

# Ejecutar acción según selección
run_action() {
    case $choice in
        1)
            check_docker
            check_config_files
            up
            status
            ;;
        2)
            check_docker
            check_config_files
            build
            up
            status
            ;;
        3)
            check_docker
            up
            sleep 10
            health_check
            ;;
        4)
            check_docker
            docker-compose -f deploy/docker-compose.prod.yml logs -f
            ;;
        5)
            check_docker
            restart
            status
            ;;
        6)
            check_docker
            down
            ;;
        7)
            check_docker
            log_warn "¡ATENCIÓN! Esto eliminará todos los datos de la base de datos!"
            read -p "¿Estás seguro? (yes/no): " confirm
            if [ "$confirm" == "yes" ]; then
                docker-compose -f deploy/docker-compose.prod.yml down -v
                log_info "Datos eliminados. Reinicia con: scripts/deploy.sh 1"
            else
                log_info "Cancelado."
            fi
            ;;
        8)
            exit 0
            ;;
        *)
            log_error "Opción inválida. Intenta de nuevo."
            ;;
    esac
}

# Ejecutar menú interactivo
while true; do
    show_menu
    run_action
done
