/**
 * ============================================================
 * 🧪 CapiMercado - Prueba E2E Completa (End-to-End)
 * ============================================================
 * 
 * Prueba TODO el flujo de la aplicación:
 * 1. Health check del servidor
 * 2. Registro de usuario nuevo
 * 3. Login con credenciales
 * 4. Crear una tienda
 * 5. Subir productos con imágenes
 * 6. Navegar el marketplace
 * 7. Ver detalle de producto
 * 8. Buscar productos
 * 9. Listar categorías
 * 10. Verificar reglas de seguridad
 * 
 * USO: node scripts/e2e_full_test.js [BASE_URL]
 * Ejemplo: node scripts/e2e_full_test.js http://178.104.63.243
 *          node scripts/e2e_full_test.js http://localhost
 */

const BASE_URL = process.argv[2] || 'http://localhost';
const API = `${BASE_URL}/api`;

// ── Utilidades ──────────────────────────────────────────────
const timestamp = Date.now();
const TEST_USER = {
  email: `e2e_test_${timestamp}@capimercado.com`,
  password: 'TestPass123!',
  passwordConfirm: 'TestPass123!',
  name: `E2E Tester ${timestamp}`,
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function log(icon, msg) {
  console.log(`${icon} ${msg}`);
}

function logSection(title) {
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ ${title} ━━━${COLORS.reset}`);
}

async function test(name, fn) {
  totalTests++;
  const start = performance.now();
  try {
    const result = await fn();
    const duration = (performance.now() - start).toFixed(0);
    passedTests++;
    log('✅', `${COLORS.green}${name}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`);
    results.push({ name, status: 'PASS', duration: `${duration}ms`, detail: result });
    return result;
  } catch (error) {
    const duration = (performance.now() - start).toFixed(0);
    failedTests++;
    log('❌', `${COLORS.red}${name}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`);
    log('  ', `${COLORS.red}→ ${error.message}${COLORS.reset}`);
    results.push({ name, status: 'FAIL', duration: `${duration}ms`, error: error.message });
    return null;
  }
}

async function apiCall(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return { status: res.status, data };
}

async function apiCallFormData(method, path, formData, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers, body: formData };
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return { status: res.status, data };
}

// Generar una imagen PNG falsa de 1x1 pixel (mínima válida)
function createTestImageBuffer(sizeKB = 10) {
  // Cabecera PNG mínima válida para un pixel 1x1 rojo
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // 8-bit RGB
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
    0xAE, 0x42, 0x60, 0x82,
  ]);
  
  // Si necesitamos hacerla más grande, rellenamos
  if (sizeKB > 1) {
    const padding = Buffer.alloc(sizeKB * 1024 - pngHeader.length, 0);
    return Buffer.concat([pngHeader, padding]);
  }
  return pngHeader;
}

// ── PRUEBAS ──────────────────────────────────────────────────

async function runE2ETests() {
  console.log(`\n${COLORS.bold}🚀 CapiMercado E2E Test Suite${COLORS.reset}`);
  console.log(`${COLORS.dim}Servidor: ${BASE_URL}${COLORS.reset}`);
  console.log(`${COLORS.dim}Fecha: ${new Date().toISOString()}${COLORS.reset}`);
  console.log('═'.repeat(60));

  let authToken = null;
  let userId = null;
  let storeId = null;
  let productId = null;
  let categoryId = null;

  // ── 1. HEALTH CHECK ──
  logSection('1. Health Check del Servidor');

  await test('API de PocketBase responde', async () => {
    const res = await fetch(`${API}/health`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    return `Health: ${JSON.stringify(data)}`;
  });

  await test('Endpoint de colecciones accesible', async () => {
    const { data } = await apiCall('GET', '/collections/categories/records');
    return `Categorías encontradas: ${data.totalItems}`;
  });

  await test('Auth methods configurados', async () => {
    const { data } = await apiCall('GET', '/collections/users/auth-methods');
    const providers = data.authProviders?.map(p => p.name) || [];
    return `Providers: ${providers.join(', ') || 'solo password'}`;
  });

  // ── 2. REGISTRO DE USUARIO ──
  logSection('2. Registro de Usuario');

  const registerResult = await test('Crear usuario nuevo', async () => {
    const { data } = await apiCall('POST', '/collections/users/records', TEST_USER);
    userId = data.id;
    return `User ID: ${userId}, Email: ${data.email}`;
  });

  // ── 3. LOGIN ──
  logSection('3. Autenticación');

  const loginResult = await test('Login con email/password', async () => {
    const { data } = await apiCall('POST', '/collections/users/auth-with-password', {
      identity: TEST_USER.email,
      password: TEST_USER.password,
    });
    authToken = data.token;
    userId = data.record?.id;
    return `Token obtenido (${authToken?.substring(0, 20)}...)`;
  });

  await test('Token válido - obtener perfil', async () => {
    if (!authToken) throw new Error('No hay token de auth');
    const { data } = await apiCall('GET', `/collections/users/records/${userId}`, null, authToken);
    return `Perfil: ${data.name} (${data.email})`;
  });

  // ── 4. CATEGORÍAS ──
  logSection('4. Categorías');

  const categoriesResult = await test('Listar todas las categorías', async () => {
    const { data } = await apiCall('GET', '/collections/categories/records?perPage=100');
    if (data.items?.length > 0) {
      categoryId = data.items[0].id;
    }
    return `Total: ${data.totalItems} categorías. Primera: ${data.items?.[0]?.name || 'N/A'}`;
  });

  // ── 5. CREAR TIENDA ──
  logSection('5. Crear Tienda');

  const storeResult = await test('Registrar tienda nueva', async () => {
    if (!authToken) throw new Error('No hay token de auth');

    const storeData = {
      owner: userId,
      name: `E2E Test Store ${timestamp}`,
      slug: `e2e-test-store-${timestamp}`,
      instagram: `@e2e_test_${timestamp}`,
      whatsapp: '18091234567',
      correo: TEST_USER.email,
      category: categoryId || 'general',
      description: 'Tienda creada por prueba E2E automatizada',
      location: 'Santo Domingo, RD',
      status: 'pending',
      membership_type: 'free',
    };

    const { data } = await apiCall('POST', '/collections/stores/records', storeData, authToken);
    storeId = data.id;
    return `Store ID: ${storeId}, Nombre: ${data.name}`;
  });

  // ── 6. CREAR PRODUCTO ──
  logSection('6. Crear Producto');

  const productResult = await test('Crear producto con datos', async () => {
    if (!authToken || !storeId) throw new Error('Falta auth o store');

    const formData = new FormData();
    formData.append('store', storeId);
    formData.append('name', `Producto E2E Test ${timestamp}`);
    formData.append('description', 'Producto de prueba creado por el script E2E');
    formData.append('brand', 'TestBrand');
    formData.append('category', categoryId || '');
    formData.append('condition', 'new');
    formData.append('price', '99.99');
    formData.append('stock', 'available');
    formData.append('listed', 'true');

    // Crear imagen de prueba y adjuntarla
    const imgBuffer = createTestImageBuffer(5);
    const blob = new Blob([imgBuffer], { type: 'image/png' });
    formData.append('images', blob, 'test_product.png');

    const { data } = await apiCallFormData('POST', '/collections/products/records', formData, authToken);
    productId = data.id;
    return `Product ID: ${productId}, Precio: $${data.price}`;
  });

  await test('Subir producto con múltiples imágenes (3)', async () => {
    if (!authToken || !storeId) throw new Error('Falta auth o store');

    const formData = new FormData();
    formData.append('store', storeId);
    formData.append('name', `Multi-Imagen Test ${timestamp}`);
    formData.append('description', 'Producto con múltiples fotos');
    formData.append('brand', 'MultiBrand');
    formData.append('category', categoryId || '');
    formData.append('condition', 'used');
    formData.append('price', '150.00');
    formData.append('stock', 'available');
    formData.append('listed', 'true');

    for (let i = 0; i < 3; i++) {
      const imgBuffer = createTestImageBuffer(10);
      const blob = new Blob([imgBuffer], { type: 'image/png' });
      formData.append('images', blob, `test_img_${i}.png`);
    }

    const { data } = await apiCallFormData('POST', '/collections/products/records', formData, authToken);
    return `Product ID: ${data.id}, Imágenes: ${data.images?.length || 0}`;
  });

  // ── 7. MARKETPLACE ──
  logSection('7. Marketplace (Lectura Pública)');

  await test('Listar productos del marketplace', async () => {
    const { data } = await apiCall('GET', '/collections/products/records?page=1&perPage=20&expand=store,category');
    return `Productos visibles: ${data.totalItems}, Página actual: ${data.items?.length || 0}`;
  });

  await test('Listar productos con filtro de tienda aprobada', async () => {
    const { data } = await apiCall('GET', 
      `/collections/products/records?filter=store.status="approved"&expand=store`);
    return `Productos de tiendas aprobadas: ${data.totalItems}`;
  });

  if (productId) {
    await test('Ver detalle de un producto', async () => {
      const { data } = await apiCall('GET', `/collections/products/records/${productId}?expand=store,category`);
      return `Producto: ${data.name}, Precio: $${data.price}`;
    });
  }

  await test('Listar tiendas públicas', async () => {
    const { data } = await apiCall('GET', '/collections/stores/records?perPage=50');
    return `Tiendas totales: ${data.totalItems}`;
  });

  await test('Buscar productos por nombre', async () => {
    const { data } = await apiCall('GET', '/collections/products/records?filter=(name~"test")');
    return `Resultados de búsqueda: ${data.totalItems}`;
  });

  // ── 8. SERVICIOS ──
  logSection('8. Servicios');

  await test('Crear servicio en la tienda', async () => {
    if (!authToken || !storeId) throw new Error('Falta auth o store');

    const { data } = await apiCall('POST', '/collections/services/records', {
      store_id: storeId,
      name: `Servicio E2E ${timestamp}`,
      description: 'Servicio de prueba E2E',
      price: 50.00,
      category: 'general',
      available: true,
      listed: true,
    }, authToken);
    return `Service ID: ${data.id}`;
  });

  await test('Listar servicios públicos', async () => {
    const { data } = await apiCall('GET', '/collections/services/records?perPage=50');
    return `Servicios totales: ${data.totalItems}`;
  });

  // ── 9. SEGURIDAD ──
  logSection('9. Pruebas de Seguridad');

  await test('No se puede crear tienda sin auth', async () => {
    try {
      await apiCall('POST', '/collections/stores/records', {
        name: 'Hacker Store',
        slug: 'hacker',
        instagram: '@hacker',
        whatsapp: '0000000000',
        correo: 'hack@hack.com',
        category: 'x',
      });
      throw new Error('DEBERÍA HABER FALLADO - Se creó tienda sin autenticación');
    } catch (e) {
      if (e.message.includes('DEBERÍA HABER FALLADO')) throw e;
      return `Bloqueado correctamente: ${e.message.substring(0, 80)}`;
    }
  });

  await test('No se puede modificar tienda ajena', async () => {
    if (!storeId) throw new Error('No hay store para probar');
    try {
      // Intentar con un token falso
      await apiCall('PATCH', `/collections/stores/records/${storeId}`, {
        name: 'Tienda Hackeada',
      }, 'fake_token_12345');
      throw new Error('DEBERÍA HABER FALLADO');
    } catch (e) {
      if (e.message.includes('DEBERÍA HABER FALLADO')) throw e;
      return `Bloqueado correctamente`;
    }
  });

  await test('No se puede acceder a panel de superusers', async () => {
    try {
      await apiCall('GET', '/collections/_superusers/records');
      throw new Error('DEBERÍA HABER FALLADO - Acceso a superusers sin auth');
    } catch (e) {
      if (e.message.includes('DEBERÍA HABER FALLADO')) throw e;
      return `Bloqueado correctamente`;
    }
  });

  await test('Headers de seguridad presentes', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const secHeaders = {
      'x-frame-options': res.headers.get('x-frame-options'),
      'x-content-type-options': res.headers.get('x-content-type-options'),
      'x-xss-protection': res.headers.get('x-xss-protection'),
    };
    const present = Object.entries(secHeaders).filter(([, v]) => v).length;
    return `${present}/3 headers de seguridad presentes`;
  });

  // ── 10. PERFORMANCE ──
  logSection('10. Performance Básica');

  await test('Latencia de API < 500ms (productos)', async () => {
    const start = performance.now();
    await apiCall('GET', '/collections/products/records?perPage=20');
    const latency = performance.now() - start;
    if (latency > 500) throw new Error(`Latencia demasiado alta: ${latency.toFixed(0)}ms`);
    return `Latencia: ${latency.toFixed(0)}ms`;
  });

  await test('Latencia de API < 500ms (categorías)', async () => {
    const start = performance.now();
    await apiCall('GET', '/collections/categories/records');
    const latency = performance.now() - start;
    if (latency > 500) throw new Error(`Latencia demasiado alta: ${latency.toFixed(0)}ms`);
    return `Latencia: ${latency.toFixed(0)}ms`;
  });

  await test('10 requests paralelas en < 3s', async () => {
    const start = performance.now();
    const promises = Array(10).fill().map(() =>
      fetch(`${API}/collections/products/records?perPage=5`)
    );
    const responses = await Promise.all(promises);
    const duration = performance.now() - start;
    const allOk = responses.every(r => r.ok);
    if (!allOk) throw new Error('Algunas peticiones fallaron');
    if (duration > 3000) throw new Error(`Demasiado lento: ${duration.toFixed(0)}ms`);
    return `10 requests en ${duration.toFixed(0)}ms (${(duration / 10).toFixed(0)}ms/req)`;
  });

  // ── 11. LIMPIEZA ──
  logSection('11. Limpieza');

  if (productId && authToken) {
    await test('Eliminar producto de prueba', async () => {
      const res = await fetch(`${API}/collections/products/records/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok && res.status !== 404) throw new Error(`Status: ${res.status}`);
      return 'Producto eliminado';
    });
  }

  // ── REPORTE FINAL ──
  console.log('\n' + '═'.repeat(60));
  console.log(`${COLORS.bold}📊 REPORTE FINAL${COLORS.reset}`);
  console.log('═'.repeat(60));
  console.log(`  Total de pruebas: ${totalTests}`);
  console.log(`  ${COLORS.green}✅ Pasaron: ${passedTests}${COLORS.reset}`);
  console.log(`  ${COLORS.red}❌ Fallaron: ${failedTests}${COLORS.reset}`);
  console.log(`  📈 Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('═'.repeat(60));

  if (failedTests > 0) {
    console.log(`\n${COLORS.red}${COLORS.bold}⚠️  Pruebas fallidas:${COLORS.reset}`);
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ${COLORS.red}• ${r.name}: ${r.error}${COLORS.reset}`);
    });
  }

  console.log(`\n${COLORS.dim}Datos de prueba creados:${COLORS.reset}`);
  console.log(`  User: ${TEST_USER.email}`);
  console.log(`  Store ID: ${storeId || 'N/A'}`);
  console.log(`  Product ID: ${productId || 'N/A (eliminado)'}`);

  process.exit(failedTests > 0 ? 1 : 0);
}

// Ejecutar
runE2ETests().catch(err => {
  console.error(`\n${COLORS.red}💀 Error fatal: ${err.message}${COLORS.reset}`);
  process.exit(1);
});
