const http = require('http');

function fetchProducts(filter) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:8090/api/collections/products/records?filter=${encodeURIComponent(filter)}&expand=store,category`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log("Test 1: Empty filter");
  let res = await fetchProducts('');
  console.log(res.status, res.data.substring(0, 100) + '...');

  console.log("\nTest 2: store.status = 'approved'");
  res = await fetchProducts('store.status = "approved"');
  console.log(res.status, res.data.substring(0, 100) + '...');
  
  console.log("\nTest 3: store.category = 'Electronics'");
  res = await fetchProducts('store.category = "Electronics"');
  console.log(res.status, res.data.substring(0, 100) + '...');
  
  console.log("\nTest 4: expand.store.status = 'approved'");
  res = await fetchProducts('expand.store.status = "approved"');
  console.log(res.status, res.data.substring(0, 100) + '...');
}

run();
