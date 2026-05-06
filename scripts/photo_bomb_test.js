/**
 * ============================================================
 * 📸 CapiMercado - Prueba de Bombardeo de Fotos
 * ============================================================
 * 
 * Prueba los LÍMITES de almacenamiento de imágenes:
 * - Cuántas fotos puede soportar un producto
 * - Tamaño máximo de imagen aceptado
 * - Subida masiva de productos con imágenes
 * - Velocidad de upload bajo carga
 * - Cuánto espacio en disco se consume
 * 
 * USO: node scripts/photo_bomb_test.js [BASE_URL] [MAX_PRODUCTS]
 * Ejemplo: node scripts/photo_bomb_test.js http://localhost 50
 */

const BASE_URL = process.argv[2] || 'http://localhost';
const MAX_PRODUCTS = parseInt(process.argv[3]) || 20;
const API = `${BASE_URL}/api`;

const timestamp = Date.now();
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// ── Generar imagen PNG de tamaño específico ──
function createTestImageBuffer(sizeKB) {
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE,
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54,
    0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82,
  ]);
  const targetSize = sizeKB * 1024;
  if (targetSize <= pngHeader.length) return pngHeader;
  const padding = Buffer.alloc(targetSize - pngHeader.length, 0xAB);
  return Buffer.concat([pngHeader, padding]);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function apiCall(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data).substring(0, 200)}`);
  return { status: res.status, data };
}

async function run() {
  console.log(`\n${COLORS.bold}📸 CapiMercado - Photo Bomb Test${COLORS.reset}`);
  console.log(`${COLORS.dim}Servidor: ${BASE_URL}${COLORS.reset}`);
  console.log(`${COLORS.dim}Productos a crear: ${MAX_PRODUCTS}${COLORS.reset}`);
  console.log('═'.repeat(60));

  // ── Setup: Crear usuario y tienda de prueba ──
  console.log(`\n${COLORS.cyan}📋 Setup...${COLORS.reset}`);

  const email = `photobomb_${timestamp}@capimercado.test`;
  const { data: user } = await apiCall('POST', '/collections/users/records', {
    email, password: 'PhotoBomb123!', passwordConfirm: 'PhotoBomb123!',
    name: `Photo Bomber ${timestamp}`,
  });
  console.log(`  ✅ Usuario creado: ${email}`);

  const { data: auth } = await apiCall('POST', '/collections/users/auth-with-password', {
    identity: email, password: 'PhotoBomb123!',
  });
  const token = auth.token;
  console.log(`  ✅ Login exitoso`);

  // Obtener una categoría
  const { data: cats } = await apiCall('GET', '/collections/categories/records?perPage=1');
  const catId = cats.items?.[0]?.id || '';

  const { data: store } = await apiCall('POST', '/collections/stores/records', {
    owner: user.id,
    name: `Photo Bomb Store ${timestamp}`,
    slug: `photo-bomb-${timestamp}`,
    instagram: `@photobomb`,
    whatsapp: '18091234567',
    correo: email,
    category: catId || 'general',
    description: 'Tienda de prueba de fotos',
    location: 'Test',
    status: 'pending',
    membership_type: 'free',
  }, token);
  console.log(`  ✅ Tienda creada: ${store.id}`);

  const results = {
    imageSizeTests: [],
    massUploadResults: [],
    maxImagesPerProduct: 0,
    totalBytesUploaded: 0,
    totalProductsCreated: 0,
    errors: [],
  };

  // ══════════════════════════════════════════════════
  // TEST 1: Tamaños de imagen
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 1: Límites de Tamaño de Imagen ━━━${COLORS.reset}`);
  
  const testSizes = [10, 50, 100, 500, 1024, 2048, 5120, 10240, 20480, 51200, 102400]; // KB

  for (const sizeKB of testSizes) {
    const sizeMB = (sizeKB / 1024).toFixed(2);
    process.stdout.write(`  📸 Probando ${sizeMB}MB... `);
    
    try {
      const imgBuffer = createTestImageBuffer(sizeKB);
      const formData = new FormData();
      formData.append('store', store.id);
      formData.append('name', `Size Test ${sizeMB}MB`);
      formData.append('category', catId);
      formData.append('condition', 'new');
      formData.append('price', '1');
      formData.append('stock', 'available');
      formData.append('listed', 'true');
      
      const blob = new Blob([imgBuffer], { type: 'image/png' });
      formData.append('images', blob, `test_${sizeKB}kb.png`);

      const start = performance.now();
      const res = await fetch(`${API}/collections/products/records`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData,
      });
      const duration = performance.now() - start;

      if (res.ok) {
        const data = await res.json();
        results.imageSizeTests.push({ sizeKB, sizeMB, status: 'OK', duration: `${duration.toFixed(0)}ms` });
        results.totalBytesUploaded += sizeKB * 1024;
        console.log(`${COLORS.green}✅ OK${COLORS.reset} (${duration.toFixed(0)}ms)`);

        // Limpiar
        await fetch(`${API}/collections/products/records/${data.id}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        results.imageSizeTests.push({ sizeKB, sizeMB, status: 'FAIL', error: res.status });
        console.log(`${COLORS.red}❌ RECHAZADO (HTTP ${res.status})${COLORS.reset}`);
        
        // Si falló, no tiene sentido probar tamaños más grandes
        if (sizeKB >= 10240) break;
      }
    } catch (err) {
      results.imageSizeTests.push({ sizeKB, sizeMB, status: 'ERROR', error: err.message });
      console.log(`${COLORS.red}❌ ERROR: ${err.message.substring(0, 60)}${COLORS.reset}`);
    }
  }

  // ══════════════════════════════════════════════════
  // TEST 2: Máximo de imágenes por producto
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 2: Máximo de Imágenes por Producto ━━━${COLORS.reset}`);
  console.log(`  ${COLORS.dim}(El schema permite maxSelect: 8, probando hasta 12)${COLORS.reset}`);

  for (let numImages = 1; numImages <= 12; numImages++) {
    process.stdout.write(`  📸 Probando ${numImages} imágenes... `);
    
    try {
      const formData = new FormData();
      formData.append('store', store.id);
      formData.append('name', `Multi Image Test ${numImages}`);
      formData.append('category', catId);
      formData.append('condition', 'new');
      formData.append('price', '1');
      formData.append('stock', 'available');
      formData.append('listed', 'true');

      for (let i = 0; i < numImages; i++) {
        const imgBuffer = createTestImageBuffer(50); // 50KB cada una
        const blob = new Blob([imgBuffer], { type: 'image/png' });
        formData.append('images', blob, `multi_${i}.png`);
      }

      const res = await fetch(`${API}/collections/products/records`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        results.maxImagesPerProduct = numImages;
        console.log(`${COLORS.green}✅ OK${COLORS.reset} (${data.images?.length} guardadas)`);
        
        await fetch(`${API}/collections/products/records/${data.id}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        console.log(`${COLORS.yellow}⚠️ RECHAZADO en ${numImages} imágenes${COLORS.reset}`);
        break;
      }
    } catch (err) {
      console.log(`${COLORS.red}❌ ERROR en ${numImages}: ${err.message.substring(0, 60)}${COLORS.reset}`);
      break;
    }
  }

  // ══════════════════════════════════════════════════
  // TEST 3: Subida masiva de productos con fotos
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 3: Subida Masiva (${MAX_PRODUCTS} productos con 3 fotos c/u) ━━━${COLORS.reset}`);

  const createdProductIds = [];
  const startMass = performance.now();

  for (let i = 0; i < MAX_PRODUCTS; i++) {
    process.stdout.write(`  [${i + 1}/${MAX_PRODUCTS}] Creando producto... `);
    
    try {
      const formData = new FormData();
      formData.append('store', store.id);
      formData.append('name', `Mass Product #${i + 1} - ${timestamp}`);
      formData.append('description', `Producto masivo de prueba ${i + 1}`);
      formData.append('brand', 'MassTest');
      formData.append('category', catId);
      formData.append('condition', ['new', 'used', 'open_box'][i % 3]);
      formData.append('price', String(Math.floor(Math.random() * 5000) + 50));
      formData.append('stock', 'available');
      formData.append('listed', 'true');

      // 3 imágenes de 100KB cada una
      for (let j = 0; j < 3; j++) {
        const imgBuffer = createTestImageBuffer(100);
        const blob = new Blob([imgBuffer], { type: 'image/png' });
        formData.append('images', blob, `mass_${i}_${j}.png`);
      }

      const start = performance.now();
      const res = await fetch(`${API}/collections/products/records`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData,
      });
      const dur = performance.now() - start;

      if (res.ok) {
        const data = await res.json();
        createdProductIds.push(data.id);
        results.totalProductsCreated++;
        results.totalBytesUploaded += 300 * 1024; // 3 × 100KB
        console.log(`${COLORS.green}✅${COLORS.reset} (${dur.toFixed(0)}ms)`);
        results.massUploadResults.push({ index: i + 1, status: 'OK', duration: dur.toFixed(0) });
      } else {
        const errBody = await res.text();
        console.log(`${COLORS.red}❌ HTTP ${res.status}${COLORS.reset}`);
        results.massUploadResults.push({ index: i + 1, status: 'FAIL', error: res.status });
        results.errors.push(`Producto ${i + 1}: HTTP ${res.status}`);
      }
    } catch (err) {
      console.log(`${COLORS.red}❌ ${err.message.substring(0, 50)}${COLORS.reset}`);
      results.errors.push(`Producto ${i + 1}: ${err.message}`);
    }
  }

  const massDuration = ((performance.now() - startMass) / 1000).toFixed(1);

  // ══════════════════════════════════════════════════
  // TEST 4: Velocidad de lectura después de la carga
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 4: Velocidad de Lectura Post-Carga ━━━${COLORS.reset}`);

  const readTests = [
    { name: 'Listar 20 productos', url: '/collections/products/records?perPage=20&expand=store' },
    { name: 'Listar 50 productos', url: '/collections/products/records?perPage=50&expand=store' },
    { name: 'Listar 100 productos', url: '/collections/products/records?perPage=100&expand=store' },
    { name: 'Buscar por nombre', url: '/collections/products/records?filter=(name~"Mass")&expand=store' },
    { name: 'Contar total', url: '/collections/products/records?perPage=1' },
  ];

  for (const rt of readTests) {
    const start = performance.now();
    try {
      const res = await fetch(`${API}${rt.url}`);
      const dur = performance.now() - start;
      const data = await res.json();
      console.log(`  ${dur < 500 ? '🟢' : dur < 1000 ? '🟡' : '🔴'} ${rt.name}: ${dur.toFixed(0)}ms (${data.totalItems || '?'} items)`);
    } catch (err) {
      console.log(`  🔴 ${rt.name}: ERROR - ${err.message}`);
    }
  }

  // ══════════════════════════════════════════════════
  // REPORTE FINAL
  // ══════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log(`${COLORS.bold}📊 REPORTE DE PRUEBA DE FOTOS${COLORS.reset}`);
  console.log('═'.repeat(60));

  // Tamaño máximo aceptado
  const maxAccepted = results.imageSizeTests.filter(t => t.status === 'OK').pop();
  console.log(`\n  📸 LÍMITES DE IMAGEN:`);
  console.log(`     Tamaño máximo aceptado:    ${maxAccepted ? `${maxAccepted.sizeMB}MB` : 'N/A'}`);
  console.log(`     Max imágenes/producto:      ${results.maxImagesPerProduct}`);
  console.log(`     Límite del schema:          8 imágenes, 100MB/archivo`);

  console.log(`\n  📦 SUBIDA MASIVA:`);
  console.log(`     Productos creados:          ${results.totalProductsCreated}/${MAX_PRODUCTS}`);
  console.log(`     Fotos subidas totales:      ${results.totalProductsCreated * 3}`);
  console.log(`     Datos subidos:              ${formatBytes(results.totalBytesUploaded)}`);
  console.log(`     Tiempo total:               ${massDuration}s`);
  console.log(`     Velocidad promedio:         ${(results.totalProductsCreated / parseFloat(massDuration)).toFixed(1)} productos/s`);

  if (results.errors.length > 0) {
    console.log(`\n  ${COLORS.red}⚠️  ERRORES (${results.errors.length}):${COLORS.reset}`);
    results.errors.slice(0, 10).forEach(e => console.log(`     • ${e}`));
    if (results.errors.length > 10) console.log(`     ... y ${results.errors.length - 10} más`);
  }

  console.log(`\n  ${COLORS.dim}IDs de productos creados (para limpieza manual):${COLORS.reset}`);
  console.log(`     ${createdProductIds.slice(0, 10).join(', ')}${createdProductIds.length > 10 ? '...' : ''}`);

  console.log('\n' + '═'.repeat(60));
}

run().catch(err => {
  console.error(`\n${COLORS.red}💀 Error fatal: ${err.message}${COLORS.reset}`);
  console.error(err);
  process.exit(1);
});
