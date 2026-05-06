/**
 * ============================================================
 * 👥 CapiMercado - Prueba de Escalabilidad de Usuarios
 * ============================================================
 * 
 * Prueba cuántos usuarios y tiendas puede soportar la base de datos:
 * - Creación masiva de usuarios
 * - Creación masiva de tiendas
 * - Velocidad de registro bajo carga
 * - Consultas con muchos datos
 * - Uso de memoria/disco
 * 
 * USO: node scripts/user_scalability_test.js [BASE_URL] [NUM_USERS]
 * Ejemplo: node scripts/user_scalability_test.js http://localhost 100
 *          node scripts/user_scalability_test.js http://178.104.63.243 500
 */

const BASE_URL = process.argv[2] || 'http://localhost';
const NUM_USERS = parseInt(process.argv[3]) || 50;
const API = `${BASE_URL}/api`;

const timestamp = Date.now();
const BATCH_SIZE = 10; // Usuarios en paralelo por lote
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

async function apiCall(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

function progressBar(current, total, width = 30) {
  const pct = current / total;
  const filled = Math.round(width * pct);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  return `[${bar}] ${current}/${total} (${(pct * 100).toFixed(0)}%)`;
}

async function run() {
  console.log(`\n${COLORS.bold}👥 CapiMercado - User Scalability Test${COLORS.reset}`);
  console.log(`${COLORS.dim}Servidor: ${BASE_URL}${COLORS.reset}`);
  console.log(`${COLORS.dim}Usuarios a crear: ${NUM_USERS}${COLORS.reset}`);
  console.log(`${COLORS.dim}Tamaño de lote: ${BATCH_SIZE} en paralelo${COLORS.reset}`);
  console.log('═'.repeat(60));

  // ── Pre-check: cuántos usuarios/tiendas hay ──
  console.log(`\n${COLORS.cyan}📊 Estado Actual de la Base de Datos:${COLORS.reset}`);

  const [usersCount, storesCount, productsCount, servicesCount] = await Promise.all([
    apiCall('GET', '/collections/users/records?perPage=1'),
    apiCall('GET', '/collections/stores/records?perPage=1'),
    apiCall('GET', '/collections/products/records?perPage=1'),
    apiCall('GET', '/collections/services/records?perPage=1'),
  ]);

  const initialCounts = {
    users: usersCount.data.totalItems || 0,
    stores: storesCount.data.totalItems || 0,
    products: productsCount.data.totalItems || 0,
    services: servicesCount.data.totalItems || 0,
  };

  console.log(`  Usuarios:   ${initialCounts.users}`);
  console.log(`  Tiendas:    ${initialCounts.stores}`);
  console.log(`  Productos:  ${initialCounts.products}`);
  console.log(`  Servicios:  ${initialCounts.services}`);

  // Obtener categoría
  const { data: cats } = await apiCall('GET', '/collections/categories/records?perPage=1');
  const catId = cats.items?.[0]?.id || '';

  // ══════════════════════════════════════════════════
  // TEST 1: Creación masiva de usuarios
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 1: Creación Masiva de ${NUM_USERS} Usuarios ━━━${COLORS.reset}`);

  const createdUsers = [];
  const registrationTimes = [];
  let failedRegistrations = 0;
  const startReg = performance.now();

  for (let batch = 0; batch < Math.ceil(NUM_USERS / BATCH_SIZE); batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, NUM_USERS);
    
    process.stdout.write(`\r  ${progressBar(batchStart, NUM_USERS)} `);

    const promises = [];
    for (let i = batchStart; i < batchEnd; i++) {
      const uid = `scale_${timestamp}_${i}`;
      const start = performance.now();
      
      promises.push(
        apiCall('POST', '/collections/users/records', {
          email: `${uid}@capimercado.test`,
          password: 'ScaleTest123!',
          passwordConfirm: 'ScaleTest123!',
          name: `Scale User ${i}`,
        }).then(result => {
          const dur = performance.now() - start;
          registrationTimes.push(dur);
          if (result.ok) {
            createdUsers.push({
              id: result.data.id,
              email: `${uid}@capimercado.test`,
              index: i,
            });
          } else {
            failedRegistrations++;
          }
          return result;
        }).catch(err => {
          failedRegistrations++;
          registrationTimes.push(performance.now() - start);
        })
      );
    }

    await Promise.all(promises);
    
    // Pequeña pausa entre lotes para no saturar
    await new Promise(r => setTimeout(r, 100));
  }

  const totalRegTime = ((performance.now() - startReg) / 1000).toFixed(1);
  process.stdout.write(`\r  ${progressBar(NUM_USERS, NUM_USERS)} \n`);

  const avgRegTime = registrationTimes.length > 0 
    ? (registrationTimes.reduce((a, b) => a + b, 0) / registrationTimes.length).toFixed(0) 
    : 'N/A';
  const maxRegTime = registrationTimes.length > 0 
    ? Math.max(...registrationTimes).toFixed(0) 
    : 'N/A';
  const minRegTime = registrationTimes.length > 0 
    ? Math.min(...registrationTimes).toFixed(0) 
    : 'N/A';

  console.log(`  ${COLORS.green}✅ Creados: ${createdUsers.length}${COLORS.reset}`);
  console.log(`  ${failedRegistrations > 0 ? COLORS.red : COLORS.green}❌ Fallidos: ${failedRegistrations}${COLORS.reset}`);
  console.log(`  ⏱️  Tiempo total: ${totalRegTime}s`);
  console.log(`  ⏱️  Promedio/usuario: ${avgRegTime}ms`);
  console.log(`  ⏱️  Más rápido: ${minRegTime}ms | Más lento: ${maxRegTime}ms`);
  console.log(`  📈 Velocidad: ${(createdUsers.length / parseFloat(totalRegTime)).toFixed(1)} usuarios/s`);

  // ══════════════════════════════════════════════════
  // TEST 2: Login masivo
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 2: Login Masivo (${createdUsers.length} usuarios) ━━━${COLORS.reset}`);

  const loginTimes = [];
  let failedLogins = 0;
  const tokens = [];
  const startLogin = performance.now();

  for (let batch = 0; batch < Math.ceil(createdUsers.length / BATCH_SIZE); batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, createdUsers.length);
    
    process.stdout.write(`\r  ${progressBar(batchStart, createdUsers.length)} `);

    const promises = createdUsers.slice(batchStart, batchEnd).map(user => {
      const start = performance.now();
      return apiCall('POST', '/collections/users/auth-with-password', {
        identity: user.email,
        password: 'ScaleTest123!',
      }).then(result => {
        loginTimes.push(performance.now() - start);
        if (result.ok) {
          tokens.push({ userId: user.id, token: result.data.token, index: user.index });
        } else {
          failedLogins++;
        }
      }).catch(() => {
        failedLogins++;
        loginTimes.push(performance.now() - start);
      });
    });

    await Promise.all(promises);
    await new Promise(r => setTimeout(r, 50));
  }

  const totalLoginTime = ((performance.now() - startLogin) / 1000).toFixed(1);
  process.stdout.write(`\r  ${progressBar(createdUsers.length, createdUsers.length)} \n`);

  console.log(`  ${COLORS.green}✅ Logins exitosos: ${tokens.length}${COLORS.reset}`);
  console.log(`  ❌ Fallidos: ${failedLogins}`);
  console.log(`  ⏱️  Tiempo total: ${totalLoginTime}s`);
  console.log(`  📈 Velocidad: ${(tokens.length / parseFloat(totalLoginTime)).toFixed(1)} logins/s`);

  // ══════════════════════════════════════════════════
  // TEST 3: Crear tienda por cada usuario
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 3: Crear ${tokens.length} Tiendas ━━━${COLORS.reset}`);

  const createdStores = [];
  let failedStores = 0;
  const storeTimes = [];
  const startStores = performance.now();

  for (let batch = 0; batch < Math.ceil(tokens.length / BATCH_SIZE); batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, tokens.length);
    
    process.stdout.write(`\r  ${progressBar(batchStart, tokens.length)} `);

    const promises = tokens.slice(batchStart, batchEnd).map(({ userId, token, index }) => {
      const start = performance.now();
      return apiCall('POST', '/collections/stores/records', {
        owner: userId,
        name: `Scale Store #${index}`,
        slug: `scale-store-${timestamp}-${index}`,
        instagram: `@scale_${index}`,
        whatsapp: `1809${String(index).padStart(7, '0')}`,
        correo: `scale_${timestamp}_${index}@capimercado.test`,
        category: catId || 'general',
        description: `Tienda de escalabilidad #${index}`,
        location: 'Santo Domingo',
        status: 'pending',
        membership_type: 'free',
      }, token).then(result => {
        storeTimes.push(performance.now() - start);
        if (result.ok) {
          createdStores.push({ storeId: result.data.id, token, userId, index });
        } else {
          failedStores++;
        }
      }).catch(() => {
        failedStores++;
        storeTimes.push(performance.now() - start);
      });
    });

    await Promise.all(promises);
    await new Promise(r => setTimeout(r, 100));
  }

  const totalStoreTime = ((performance.now() - startStores) / 1000).toFixed(1);
  process.stdout.write(`\r  ${progressBar(tokens.length, tokens.length)} \n`);

  console.log(`  ${COLORS.green}✅ Tiendas creadas: ${createdStores.length}${COLORS.reset}`);
  console.log(`  ❌ Fallidas: ${failedStores}`);
  console.log(`  ⏱️  Tiempo total: ${totalStoreTime}s`);
  console.log(`  📈 Velocidad: ${(createdStores.length / parseFloat(totalStoreTime)).toFixed(1)} tiendas/s`);

  // ══════════════════════════════════════════════════
  // TEST 4: Crear productos por cada tienda (2 por tienda)
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 4: Crear ${createdStores.length * 2} Productos ━━━${COLORS.reset}`);

  let createdProducts = 0;
  let failedProducts = 0;
  const startProducts = performance.now();

  for (let batch = 0; batch < Math.ceil(createdStores.length / BATCH_SIZE); batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, createdStores.length);
    
    process.stdout.write(`\r  ${progressBar(batchStart * 2, createdStores.length * 2)} `);

    const promises = [];
    for (const store of createdStores.slice(batchStart, batchEnd)) {
      for (let p = 0; p < 2; p++) {
        promises.push(
          apiCall('POST', '/collections/products/records', {
            store: store.storeId,
            name: `Scale Product ${store.index}-${p}`,
            description: 'Producto de escalabilidad',
            brand: 'ScaleBrand',
            category: catId,
            condition: ['new', 'used', 'open_box'][p % 3],
            price: Math.floor(Math.random() * 5000) + 100,
            stock: 'available',
            listed: true,
          }, store.token).then(result => {
            if (result.ok) createdProducts++;
            else failedProducts++;
          }).catch(() => failedProducts++)
        );
      }
    }

    await Promise.all(promises);
    await new Promise(r => setTimeout(r, 100));
  }

  const totalProductTime = ((performance.now() - startProducts) / 1000).toFixed(1);
  process.stdout.write(`\r  ${progressBar(createdStores.length * 2, createdStores.length * 2)} \n`);

  console.log(`  ${COLORS.green}✅ Productos creados: ${createdProducts}${COLORS.reset}`);
  console.log(`  ❌ Fallidos: ${failedProducts}`);
  console.log(`  ⏱️  Tiempo total: ${totalProductTime}s`);
  console.log(`  📈 Velocidad: ${(createdProducts / parseFloat(totalProductTime)).toFixed(1)} productos/s`);

  // ══════════════════════════════════════════════════
  // TEST 5: Consultas con los datos masivos
  // ══════════════════════════════════════════════════
  console.log(`\n${COLORS.cyan}${COLORS.bold}━━━ TEST 5: Velocidad de Consultas con Datos Masivos ━━━${COLORS.reset}`);

  // Verificar conteos finales
  const [finalUsers, finalStores, finalProducts] = await Promise.all([
    apiCall('GET', '/collections/users/records?perPage=1'),
    apiCall('GET', '/collections/stores/records?perPage=1'),
    apiCall('GET', '/collections/products/records?perPage=1'),
  ]);

  console.log(`\n  ${COLORS.dim}Datos en la BD ahora:${COLORS.reset}`);
  console.log(`  Usuarios:   ${finalUsers.data.totalItems} (+${(finalUsers.data.totalItems || 0) - initialCounts.users})`);
  console.log(`  Tiendas:    ${finalStores.data.totalItems} (+${(finalStores.data.totalItems || 0) - initialCounts.stores})`);
  console.log(`  Productos:  ${finalProducts.data.totalItems} (+${(finalProducts.data.totalItems || 0) - initialCounts.products})`);

  const queries = [
    { name: 'Listar 20 productos (c/ expand)', url: '/collections/products/records?perPage=20&expand=store,category' },
    { name: 'Listar 100 productos', url: '/collections/products/records?perPage=100' },
    { name: 'Listar 500 productos', url: '/collections/products/records?perPage=500' },
    { name: 'Filtrar por tienda aprobada', url: '/collections/products/records?filter=store.status="approved"&perPage=20' },
    { name: 'Buscar por nombre "Scale"', url: '/collections/products/records?filter=(name~"Scale")&perPage=50' },
    { name: 'Listar 50 tiendas c/ filtro', url: '/collections/stores/records?perPage=50&filter=status="pending"' },
    { name: 'Listar todas las tiendas', url: `/collections/stores/records?perPage=${finalStores.data.totalItems || 100}` },
    { name: 'Contar productos totales', url: '/collections/products/records?perPage=1' },
  ];

  console.log(`\n  📊 Latencia de consultas:`);
  for (const q of queries) {
    const times = [];
    // Hacer 3 iteraciones para promediar
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      try {
        await fetch(`${API}${q.url}`);
        times.push(performance.now() - start);
      } catch (e) { times.push(-1); }
    }
    
    const validTimes = times.filter(t => t >= 0);
    const avg = validTimes.length > 0 ? (validTimes.reduce((a, b) => a + b, 0) / validTimes.length).toFixed(0) : 'ERR';
    const icon = avg === 'ERR' ? '🔴' : parseInt(avg) < 200 ? '🟢' : parseInt(avg) < 1000 ? '🟡' : '🔴';
    console.log(`  ${icon} ${q.name}: ${avg}ms`);
  }

  // ── Prueba de concurrencia extrema en lectura ──
  console.log(`\n  🔥 Prueba de concurrencia (50 reads simultáneos):`);
  const concStart = performance.now();
  const concPromises = Array(50).fill().map(() =>
    fetch(`${API}/collections/products/records?perPage=20&expand=store`)
      .then(r => ({ ok: r.ok, dur: performance.now() - concStart }))
      .catch(() => ({ ok: false, dur: performance.now() - concStart }))
  );
  const concResults = await Promise.all(concPromises);
  const concOk = concResults.filter(r => r.ok).length;
  const concMaxDur = Math.max(...concResults.map(r => r.dur)).toFixed(0);
  console.log(`  ${concOk === 50 ? '🟢' : '🟡'} ${concOk}/50 exitosos, tiempo máximo: ${concMaxDur}ms`);

  // ══════════════════════════════════════════════════
  // REPORTE FINAL
  // ══════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log(`${COLORS.bold}📊 REPORTE FINAL DE ESCALABILIDAD${COLORS.reset}`);
  console.log('═'.repeat(60));

  console.log(`
  👥 USUARIOS:
     Intentados:     ${NUM_USERS}
     Creados:        ${createdUsers.length}
     Tasa de éxito:  ${((createdUsers.length / NUM_USERS) * 100).toFixed(1)}%
     Velocidad:      ${(createdUsers.length / parseFloat(totalRegTime)).toFixed(1)} registros/s

  🏪 TIENDAS:
     Creadas:        ${createdStores.length}
     Tasa de éxito:  ${tokens.length > 0 ? ((createdStores.length / tokens.length) * 100).toFixed(1) : 0}%
     Velocidad:      ${(createdStores.length / parseFloat(totalStoreTime)).toFixed(1)} tiendas/s

  📦 PRODUCTOS:
     Creados:        ${createdProducts}
     Velocidad:      ${(createdProducts / parseFloat(totalProductTime)).toFixed(1)} productos/s

  📈 TOTALES EN BD:
     Usuarios:       ${finalUsers.data.totalItems || 'N/A'}
     Tiendas:        ${finalStores.data.totalItems || 'N/A'}
     Productos:      ${finalProducts.data.totalItems || 'N/A'}

  💡 ESTIMACIÓN TEÓRICA:
     SQLite (PocketBase) puede manejar ~50,000-100,000 registros
     con buen rendimiento. Tu nivel actual es:
     ${(finalProducts.data.totalItems || 0) < 1000 ? '🟢 BAJO - Mucho margen de crecimiento' :
       (finalProducts.data.totalItems || 0) < 10000 ? '🟡 MEDIO - Aún hay margen' :
       '🔴 ALTO - Considerar migrar a PostgreSQL'}
  `);

  console.log('═'.repeat(60));
}

run().catch(err => {
  console.error(`\n${COLORS.red}💀 Error fatal: ${err.message}${COLORS.reset}`);
  console.error(err);
  process.exit(1);
});
