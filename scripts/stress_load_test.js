/**
 * ============================================================
 * 🔥 CapiMercado - Prueba de Carga Avanzada con k6
 * ============================================================
 * 
 * Prueba progresiva que mide:
 * - Cuántos usuarios simultáneos aguanta
 * - Tiempo de respuesta bajo carga
 * - Tasa de errores
 * - Punto de quiebre (breakpoint)
 * 
 * REQUIERE: k6 (https://k6.io)
 * INSTALAR: 
 *   Windows: choco install k6  (o winget install k6)
 *   Linux:   sudo snap install k6
 *   Mac:     brew install k6
 * 
 * USO:
 *   k6 run scripts/stress_load_test.js
 *   k6 run --env BASE_URL=http://178.104.63.243 scripts/stress_load_test.js
 *   k6 run --out json=results.json scripts/stress_load_test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// ── Métricas Personalizadas ──
const errorRate = new Rate('errors');
const productListDuration = new Trend('product_list_duration');
const categoryListDuration = new Trend('category_list_duration');
const storeListDuration = new Trend('store_list_duration');
const userRegistrations = new Counter('user_registrations');
const productCreations = new Counter('product_creations');

// ── Configuración ──
const BASE_URL = __ENV.BASE_URL || 'http://localhost';
const API = `${BASE_URL}/api`;

export const options = {
  // ═══════════════════════════════════════════════════════
  // ESCENARIOS DE PRUEBA (se ejecutan todos)
  // ═══════════════════════════════════════════════════════
  scenarios: {
    // ── Escenario 1: Navegación de compradores (80% del tráfico real) ──
    compradores: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },    // Ramp-up suave
        { duration: '1m', target: 200 },    // Carga media
        { duration: '1m', target: 500 },    // Carga alta
        { duration: '2m', target: 1000 },   // Carga extrema
        { duration: '1m', target: 1500 },   // PICO MÁXIMO
        { duration: '30s', target: 0 },     // Ramp-down
      ],
      gracefulRampDown: '10s',
      exec: 'browsing',
      tags: { scenario: 'compradores' },
    },

    // ── Escenario 2: Vendedores registrándose y creando tiendas ──
    vendedores: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '1m', target: 300 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'sellerFlow',
      tags: { scenario: 'vendedores' },
    },

    // ── Escenario 3: Spike Test (ataque repentino) ──
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      startTime: '3m', // Empieza después de los otros
      stages: [
        { duration: '10s', target: 2000 },  // Spike brutal
        { duration: '30s', target: 2000 },  // Mantener
        { duration: '10s', target: 0 },     // Bajar
      ],
      gracefulRampDown: '5s',
      exec: 'browsing',
      tags: { scenario: 'spike' },
    },
  },

  // ── Umbrales de Aceptación ──
  thresholds: {
    http_req_duration: [
      'p(50)<300',     // 50% de requests < 300ms
      'p(90)<1000',    // 90% < 1 segundo
      'p(95)<2000',    // 95% < 2 segundos
      'p(99)<5000',    // 99% < 5 segundos
    ],
    http_req_failed: ['rate<0.10'],       // Menos del 10% de errores
    errors: ['rate<0.15'],                // Tasa de error personalizada < 15%
    product_list_duration: ['p(95)<2000'], // Listar productos < 2s
    category_list_duration: ['p(95)<500'], // Categorías < 500ms
  },
};

// ══════════════════════════════════════════════════════════
// ESCENARIO: Navegación de compradores
// ══════════════════════════════════════════════════════════
export function browsing() {
  group('📱 Navegación del Marketplace', () => {
    // 1. Cargar página principal (productos)
    const productsStart = new Date();
    const productsRes = http.get(`${API}/collections/products/records?page=1&perPage=20&expand=store,category&filter=store.status="approved"`, {
      tags: { endpoint: 'products_list' },
    });
    productListDuration.add(new Date() - productsStart);

    const productsOk = check(productsRes, {
      'productos: status 200': (r) => r.status === 200,
      'productos: tiene items': (r) => {
        try { return r.json().items !== undefined; } catch { return false; }
      },
      'productos: responde < 3s': (r) => r.timings.duration < 3000,
    });
    errorRate.add(!productsOk);

    // 2. Cargar categorías
    const catStart = new Date();
    const catRes = http.get(`${API}/collections/categories/records`, {
      tags: { endpoint: 'categories' },
    });
    categoryListDuration.add(new Date() - catStart);

    check(catRes, {
      'categorías: status 200': (r) => r.status === 200,
    });

    // 3. Ver un producto aleatorio (si hay)
    try {
      const products = productsRes.json();
      if (products.items && products.items.length > 0) {
        const randomProduct = products.items[Math.floor(Math.random() * products.items.length)];
        const detailRes = http.get(`${API}/collections/products/records/${randomProduct.id}?expand=store,category`, {
          tags: { endpoint: 'product_detail' },
        });
        check(detailRes, {
          'detalle producto: status 200': (r) => r.status === 200,
        });
      }
    } catch (e) { /* ignorar errores de parsing */ }

    // 4. Listar tiendas
    const storeStart = new Date();
    const storesRes = http.get(`${API}/collections/stores/records?perPage=20&filter=status="approved"`, {
      tags: { endpoint: 'stores_list' },
    });
    storeListDuration.add(new Date() - storeStart);

    check(storesRes, {
      'tiendas: status 200': (r) => r.status === 200,
    });

    // 5. Simular búsqueda
    const searchTerms = ['zapato', 'camisa', 'laptop', 'iphone', 'nike', 'reloj', 'perfume', 'mueble'];
    const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const searchRes = http.get(`${API}/collections/products/records?filter=(name~"${term}")`, {
      tags: { endpoint: 'search' },
    });
    check(searchRes, {
      'búsqueda: status 200': (r) => r.status === 200,
    });
  });

  // Espera aleatoria simulando comportamiento real
  sleep(Math.random() * 3 + 0.5);
}

// ══════════════════════════════════════════════════════════
// ESCENARIO: Flujo de vendedores
// ══════════════════════════════════════════════════════════
export function sellerFlow() {
  const uniqueId = `${__VU}_${__ITER}_${Date.now()}`;

  group('🏪 Registro de Vendedor', () => {
    // 1. Registrar usuario
    const registerRes = http.post(`${API}/collections/users/records`, JSON.stringify({
      email: `loadtest_${uniqueId}@capimercado.test`,
      password: 'LoadTest123!',
      passwordConfirm: 'LoadTest123!',
      name: `LoadTest User ${uniqueId}`,
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'user_register' },
    });

    const regOk = check(registerRes, {
      'registro: status 200': (r) => r.status === 200,
    });
    if (regOk) userRegistrations.add(1);
    errorRate.add(!regOk);

    if (!regOk) {
      sleep(1);
      return;
    }

    const userId = registerRes.json().id;

    // 2. Login
    const loginRes = http.post(`${API}/collections/users/auth-with-password`, JSON.stringify({
      identity: `loadtest_${uniqueId}@capimercado.test`,
      password: 'LoadTest123!',
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'user_login' },
    });

    const loginOk = check(loginRes, {
      'login: status 200': (r) => r.status === 200,
      'login: tiene token': (r) => {
        try { return r.json().token !== undefined; } catch { return false; }
      },
    });

    if (!loginOk) {
      sleep(1);
      return;
    }

    const token = loginRes.json().token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // 3. Crear tienda
    const storeRes = http.post(`${API}/collections/stores/records`, JSON.stringify({
      owner: userId,
      name: `LoadTest Store ${uniqueId}`,
      slug: `loadtest-store-${uniqueId}`,
      instagram: `@loadtest_${__VU}`,
      whatsapp: `1809${String(__VU).padStart(7, '0')}`,
      correo: `loadtest_${uniqueId}@capimercado.test`,
      category: 'general',
      description: 'Tienda de prueba de carga',
      location: 'Test Location',
      status: 'pending',
      membership_type: 'free',
    }), {
      headers: authHeaders,
      tags: { endpoint: 'store_create' },
    });

    const storeOk = check(storeRes, {
      'tienda creada: status 200': (r) => r.status === 200,
    });

    if (!storeOk) {
      sleep(1);
      return;
    }

    const storeId = storeRes.json().id;

    // 4. Crear productos (2 por tienda)
    for (let i = 0; i < 2; i++) {
      // Obtener categorías
      const catRes = http.get(`${API}/collections/categories/records?perPage=1`);
      let catId = '';
      try { catId = catRes.json().items[0]?.id || ''; } catch (e) { /* ignorar */ }

      const prodRes = http.post(`${API}/collections/products/records`, JSON.stringify({
        store: storeId,
        name: `LoadTest Product ${uniqueId}_${i}`,
        description: 'Producto generado por prueba de carga',
        brand: 'LoadTestBrand',
        category: catId,
        condition: ['new', 'used', 'open_box'][Math.floor(Math.random() * 3)],
        price: Math.floor(Math.random() * 10000) + 100,
        stock: 'available',
        listed: true,
      }), {
        headers: authHeaders,
        tags: { endpoint: 'product_create' },
      });

      const prodOk = check(prodRes, {
        'producto creado': (r) => r.status === 200,
      });
      if (prodOk) productCreations.add(1);
      errorRate.add(!prodOk);
    }
  });

  sleep(Math.random() * 2 + 1);
}

// ── Resumen personalizado ──
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    metrics: {
      total_requests: data.metrics.http_reqs?.values?.count || 0,
      failed_requests: data.metrics.http_req_failed?.values?.passes || 0,
      avg_duration_ms: Math.round(data.metrics.http_req_duration?.values?.avg || 0),
      p50_duration_ms: Math.round(data.metrics.http_req_duration?.values?.['p(50)'] || 0),
      p90_duration_ms: Math.round(data.metrics.http_req_duration?.values?.['p(90)'] || 0),
      p95_duration_ms: Math.round(data.metrics.http_req_duration?.values?.['p(95)'] || 0),
      p99_duration_ms: Math.round(data.metrics.http_req_duration?.values?.['p(99)'] || 0),
      max_vus: data.metrics.vus_max?.values?.value || 0,
      users_registered: data.metrics.user_registrations?.values?.count || 0,
      products_created: data.metrics.product_creations?.values?.count || 0,
      error_rate_pct: ((data.metrics.errors?.values?.rate || 0) * 100).toFixed(2),
    },
    thresholds: {},
  };

  // Evaluar thresholds
  for (const [key, threshold] of Object.entries(data.metrics)) {
    if (threshold.thresholds) {
      for (const [name, result] of Object.entries(threshold.thresholds)) {
        summary.thresholds[`${key} [${name}]`] = result.ok ? '✅ PASS' : '❌ FAIL';
      }
    }
  }

  // Generar reporte de texto
  let report = `
═══════════════════════════════════════════════════════════════
  🔥 REPORTE DE PRUEBA DE CARGA - CapiMercado
═══════════════════════════════════════════════════════════════
  Fecha: ${summary.timestamp}
  Servidor: ${BASE_URL}
  VUs máximos: ${summary.metrics.max_vus}
───────────────────────────────────────────────────────────────
  📊 RESULTADOS:
  
  Total de requests:    ${summary.metrics.total_requests.toLocaleString()}
  Requests fallidos:    ${summary.metrics.failed_requests.toLocaleString()}
  Tasa de error:        ${summary.metrics.error_rate_pct}%
  
  Usuarios registrados: ${summary.metrics.users_registered}
  Productos creados:    ${summary.metrics.products_created}
  
  ⏱️  LATENCIA:
  Promedio:    ${summary.metrics.avg_duration_ms}ms
  P50:         ${summary.metrics.p50_duration_ms}ms
  P90:         ${summary.metrics.p90_duration_ms}ms
  P95:         ${summary.metrics.p95_duration_ms}ms
  P99:         ${summary.metrics.p99_duration_ms}ms

  📋 UMBRALES:
`;

  for (const [name, result] of Object.entries(summary.thresholds)) {
    report += `  ${result} ${name}\n`;
  }

  report += `\n═══════════════════════════════════════════════════════════════\n`;

  console.log(report);

  return {
    'scripts/load_test_results.json': JSON.stringify(summary, null, 2),
    stdout: report,
  };
}
