import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function testFilter(name, filterString) {
  try {
    const res = await pb.collection('products').getList(1, 20, {
      expand: 'store',
      filter: filterString,
      sort: '-created'
    });
    console.log(`[TEST: ${name}] SUCCESS - Items found: ${res.items.length}`);
  } catch (err) {
    console.log(`[TEST: ${name}] FAILED - Error: ${err.message}`, err.originalError);
  }
}

async function run() {
  await testFilter('Aislamiento (Vacío)', '');
  await testFilter('Relación Store Status', 'store.status = "approved"');
  await testFilter('Store Status Expand', 'expand.store.status = "approved"');
  await testFilter('Store Category', 'store.category = "Todos"');
}
run();
