/**
 * ============================================================
 * 🧹 CapiMercado - Script de Limpieza de Datos de Prueba
 * ============================================================
 * 
 * Elimina todos los datos generados por las pruebas.
 * Busca usuarios/tiendas/productos con prefijos de prueba.
 * 
 * USO: node scripts/cleanup_test_data.js [BASE_URL]
 * Ejemplo: node scripts/cleanup_test_data.js http://localhost
 * 
 * ⚠️  CUIDADO: Esto elimina datos reales si los patrones coinciden.
 */

const BASE_URL = process.argv[2] || 'http://localhost';
const API = `${BASE_URL}/api`;

// Los admin credentials de tu .env
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@capimarket.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'password123';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function run() {
  console.log(`\n${COLORS.bold}🧹 CapiMercado - Limpieza de Datos de Prueba${COLORS.reset}`);
  console.log(`${COLORS.dim}Servidor: ${BASE_URL}${COLORS.reset}`);
  console.log('═'.repeat(50));

  // Login como admin
  console.log(`\n${COLORS.cyan}🔐 Login como admin...${COLORS.reset}`);
  let adminToken;
  try {
    const res = await fetch(`${API}/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
    adminToken = data.token;
    console.log(`  ${COLORS.green}✅ Login de admin exitoso${COLORS.reset}`);
  } catch (err) {
    console.error(`  ${COLORS.red}❌ No se pudo autenticar como admin: ${err.message}${COLORS.reset}`);
    console.log(`  ${COLORS.yellow}Intentando sin admin token (solo podrá leer datos públicos)${COLORS.reset}`);
  }

  const testPatterns = [
    'e2e_test_', 'loadtest_', 'photobomb_', 'scale_', 'E2E', 'LoadTest', 'Mass'
  ];

  // ── Eliminar productos de prueba ──
  console.log(`\n${COLORS.cyan}📦 Buscando productos de prueba...${COLORS.reset}`);
  await cleanCollection('products', testPatterns, adminToken);

  // ── Eliminar servicios de prueba ──
  console.log(`\n${COLORS.cyan}🛠️  Buscando servicios de prueba...${COLORS.reset}`);
  await cleanCollection('services', testPatterns, adminToken);

  // ── Eliminar tiendas de prueba ──
  console.log(`\n${COLORS.cyan}🏪 Buscando tiendas de prueba...${COLORS.reset}`);
  await cleanCollection('stores', testPatterns, adminToken);

  // ── Eliminar usuarios de prueba ──
  console.log(`\n${COLORS.cyan}👤 Buscando usuarios de prueba...${COLORS.reset}`);
  await cleanUsers(testPatterns, adminToken);

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`${COLORS.green}${COLORS.bold}✅ Limpieza completada${COLORS.reset}`);
}

async function cleanCollection(collection, patterns, token) {
  const headers = token 
    ? { 'Authorization': `Bearer ${token}` } 
    : {};

  // Obtener todos los registros
  let page = 1;
  let deleted = 0;
  let total = 0;

  while (true) {
    const res = await fetch(`${API}/collections/${collection}/records?perPage=100&page=${page}`, { headers });
    if (!res.ok) {
      console.log(`  ${COLORS.yellow}⚠️ No se pudo leer ${collection}: HTTP ${res.status}${COLORS.reset}`);
      break;
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) break;

    for (const item of data.items) {
      const name = item.name || item.email || '';
      const isTest = patterns.some(p => name.includes(p));
      
      if (isTest) {
        total++;
        try {
          const delRes = await fetch(`${API}/collections/${collection}/records/${item.id}`, {
            method: 'DELETE',
            headers,
          });
          if (delRes.ok || delRes.status === 204) {
            deleted++;
          }
        } catch (e) { /* ignorar errores individuales */ }
      }
    }

    if (data.items.length < 100) break;
    page++;
  }

  console.log(`  ${deleted > 0 ? '🗑️' : '✅'} ${deleted}/${total} registros eliminados de ${collection}`);
}

async function cleanUsers(patterns, token) {
  if (!token) {
    console.log(`  ${COLORS.yellow}⚠️ Se necesita token de admin para eliminar usuarios${COLORS.reset}`);
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}` };
  let page = 1;
  let deleted = 0;
  let total = 0;

  while (true) {
    const res = await fetch(`${API}/collections/users/records?perPage=100&page=${page}`, { headers });
    if (!res.ok) break;

    const data = await res.json();
    if (!data.items || data.items.length === 0) break;

    for (const user of data.items) {
      const email = user.email || '';
      const name = user.name || '';
      const isTest = patterns.some(p => email.includes(p) || name.includes(p));
      
      if (isTest) {
        total++;
        try {
          const delRes = await fetch(`${API}/collections/users/records/${user.id}`, {
            method: 'DELETE',
            headers,
          });
          if (delRes.ok || delRes.status === 204) deleted++;
        } catch (e) { /* ignorar */ }
      }
    }

    if (data.items.length < 100) break;
    page++;
  }

  console.log(`  ${deleted > 0 ? '🗑️' : '✅'} ${deleted}/${total} usuarios eliminados`);
}

run().catch(err => {
  console.error(`💀 Error fatal: ${err.message}`);
  process.exit(1);
});
