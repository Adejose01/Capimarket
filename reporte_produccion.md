# Reporte de Despliegue — CapiMercado

## Estado: ✅ PRODUCTION READY

---

## 1. Stack Técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | React | ^19 |
| Build Tool | Vite | ^6 |
| Estilos | Tailwind CSS | ^4 |
| Animaciones | Framer Motion | instalada |
| Iconos | Lucide React | instalada |
| Backend/DB | PocketBase | SDK `pocketbase` |
| Gráficos | Recharts | instalada |

---

## 2. Conexión a PocketBase

```js
// App.jsx — línea 18
const pb = new PocketBase('https://capimercado.com');
```

> **El SDK se conecta automáticamente** al dominio de producción. Nginx en tu servidor rutea las llamadas API sin exponer el puerto 8090.

---

## 3. Colecciones Requeridas en PocketBase

### 3.1 Colección `stores`

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | Text | ✅ | Nombre comercial |
| `slug` | Text | ✅ | URL amigable (único) |
| `status` | Select | ✅ | Valores: `pending`, `approved`, `rejected` |
| `category` | Text | ✅ | Debe coincidir con Bento Grid: `Smartphones`, `Laptops`, `Audio`, `Accesorios` |
| `location` | Text | ❌ | Ciudad/sede (ej: `Valencia, Sambil`) |
| `description` | Text | ❌ | Bio de la tienda |
| `whatsapp` | Text | ✅ | Formato `584141234567` (sin espacios) |
| `instagram` | Text | ❌ | Usuario sin `@` |
| `facebook` | Text | ❌ | URL o usuario |
| `tiktok` | Text | ❌ | Usuario |
| `logo` | File | ❌ | Imagen cuadrada recomendada |
| `banner` | File | ❌ | Proporción 3:1 recomendada |
| `primaryColor` | Text | ❌ | HEX (ej: `#10b981`) |
| `owner` | Relation → users | ✅ | ID del usuario dueño |

> ⚠️ **CRÍTICO:** El filtrado del Bento Grid compara `store.category` exacto. Si en PocketBase tienes `smartphones` (minúscula), cambia el array `CATEGORY_BENTO` en el código **o** normaliza el dato en la DB.

### 3.2 Colección `products`

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | Text | ✅ | Nombre del producto |
| `price` | Number | ✅ | Precio en USDT |
| `brand` | Text | ❌ | Marca (Apple, Samsung…) |
| `condition` | Select | ✅ | Valores: `new`, `open_box`, `used` |
| `stock` | Select | ✅ | Valores: `available`, `out_of_stock` |
| `description` | Text | ❌ | Descripción larga |
| `usage_details` | Text | ❌ | Detalles si es usado |
| `images` | File (múltiple) | ❌ | Hasta N imágenes. Max recomendado: 5MB c/u |
| `store` | Relation → stores | ✅ | FK a la tienda |

> ⚠️ **CRÍTICO:** En PocketBase, la colección `products` debe tener activado **"Expand relations"** con `store` para que `expand: 'store'` funcione en el fetch.

### 3.3 Colección `users` (Sistema integrado de PocketBase)

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | Text | Nombre completo |
| `email` | Email | Login |
| `password` | Password | Cifrada por PocketBase |

---

## 4. Reglas de API en PocketBase (API Rules)

Configura estas reglas en el panel admin de PocketBase:

### `stores`
```
List/Search: status = "approved"    ← Solo se muestran las aprobadas
View:        status = "approved"
Create:      @request.auth.id != ""  ← Solo usuarios autenticados
Update:      @request.auth.id = owner
Delete:      @request.auth.id = owner
```

### `products`
```
List/Search: store.status = "approved"   ← Solo productos de tiendas aprobadas
View:        store.status = "approved"
Create:      @request.auth.id = store.owner
Update:      @request.auth.id = store.owner
Delete:      @request.auth.id = store.owner
```

---

## 5. Pasos de Despliegue

### Paso 1 — Build local

```bash
cd C:\Users\Usuario\Desktop\Capimarket
npm run build
```

Esto genera la carpeta `/dist`. Verifica que no haya errores de compilación.

### Paso 2 — Subir archivos al servidor

Sube el **contenido de `/dist`** (no la carpeta en sí) a la raíz pública de tu servidor web (`/var/www/capimercado.com/html/` o equivalente).

```
dist/
  index.html        → sube al root del dominio
  assets/           → sube completo
```

### Paso 3 — Configurar Nginx (SPA Routing)

Tu `nginx.conf` necesita esta directiva para que el hash routing funcione:

```nginx
server {
    listen 80;
    server_name capimercado.com www.capimercado.com;
    root /var/www/capimercado.com/html;
    index index.html;

    # SPA fallback — redirige todo a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy al PocketBase (evita exponer puerto 8090)
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /_/ {
        proxy_pass http://127.0.0.1:8090/_/;
        proxy_set_header Host $host;
    }
    location /pocketbase-files/ {
        proxy_pass http://127.0.0.1:8090/;
    }
}
```

### Paso 4 — Verificar PocketBase corriendo

```bash
# En el servidor (Linux)
systemctl status pocketbase
# o
pm2 status pocketbase
```

---

## 6. Variables de Entorno (Recomendado para producción)

Actualmente la URL de PocketBase está hardcodeada en el código. Para hacerlo más limpio, crea un `.env` en la raíz:

```env
VITE_PB_URL=https://capimercado.com
```

Y en `App.jsx` línea 18, cambia a:

```js
const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'https://capimercado.com');
```

> El `.env` **no se sube al servidor**, solo se usa en build time. El valor queda embebido en el bundle JS.

---

## 7. Checklist Pre-Lanzamiento

- [ ] `npm run build` sin errores
- [ ] PocketBase corriendo en el servidor (`https://capimercado.com/_/` accessible)
- [ ] Colecciones `stores`, `products`, `users` creadas en PocketBase
- [ ] Al menos 1 store con `status = approved` para que el marketplace no esté vacío
- [ ] APIs Rules de PocketBase configuradas (sección 4)
- [ ] Campo `category` de las tiendas coincide exactamente con los labels del Bento Grid
- [ ] Campo `whatsapp` en formato `58XXXXXXXXXX` (sin `+`, sin espacios)
- [ ] Imágenes de stores/products de max 5MB cada una
- [ ] Nginx configurado con el `try_files` para SPA routing
- [ ] SSL activo en `capimercado.com` (HTTPS)

---

## 8. Arquitectura del Frontend

```
src/
  App.jsx          — Monolito (2028 líneas). Contiene:
    SafeImage            — Componente de imagen con fallback
    SPRING / SPRING_SLOW — Configuración de física de animaciones
    HeroCinematic        — Hero de pantalla completa
    CategoryBentoGrid    — Grid bento de categorías
    App()                — Router hash-based (#/, #/auth, #/panel, etc.)
    AuthView             — Login / Registro
    BuyerPortalView      — Panel del comprador
    MarketplaceView      — Vista principal del e-commerce
    SellerPortalView     — Panel del vendedor
    SuperAdminView       — Admin (acceso por hash secreto)

  index.css        — Plus Jakarta Sans + utilidades CSS custom
tailwind.config.js — luxury-green, shadow-premium, font family
```

---

## 9. Rutas del Sistema

| Hash URL | Vista |
|---|---|
| `#/` | Marketplace principal |
| `#/auth` | Login / Registro |
| `#/mi-cuenta` | Panel del comprador |
| `#/panel` | Panel del vendedor |
| `#/store/<id>` | Tienda individual (URL compartible) |
| `#/admin-control-valencia-2026` | SuperAdmin (secreto) |

---

## 10. Características de UI Implementadas

- ✅ Navbar `fixed` transparente → glassmorphism al scroll (`isScrolled` state)
- ✅ Hero cinematográfico full-bleed (`min-h-[100svh]`)
- ✅ Gradiente protector `from-black/50` para visibilidad del navbar
- ✅ Bento Grid de categorías con spring animations
- ✅ Product cards con `motion.div` spring + `transform-gpu`
- ✅ WhatsApp Bottom Bar fija en detalle de producto (mobile)
- ✅ Galería de fotos con eliminación individual en el editor del vendedor
- ✅ Scroll-aware mobile menu en tema oscuro coherente
- ✅ Plus Jakarta Sans (Google Fonts) con `will-change` y `text-rendering: optimizeLegibility`
