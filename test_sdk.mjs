import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function testFilter(name, filterString) {
  try {
    const res = await pb.collection('products').getList(1, 20, {
      expand: 'store,category',
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
  await testFilter('Solo listed', 'listed = true');
  await testFilter('Listed + Stock', 'listed = true && stock = "available"');
  await testFilter('Relación Store Status', 'listed = true && store.status = "approved"');
  await testFilter('Relación Store Category', 'store.category = "Todos"');
  await testFilter('Relación Product Category', 'category = "Todos"');
  await testFilter('Solo Store Status', 'store.status = "approved"');
}
run();
