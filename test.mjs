async function run() {
  const fetchProducts = async (f) => {
    const url = `http://localhost:8090/api/collections/products/records?filter=${encodeURIComponent(f)}&expand=store,category`;
    const res = await fetch(url);
    const data = await res.text();
    return { status: res.status, data };
  };
  
  let r = await fetchProducts('');
  console.log('1 Empty:', r.status, r.data.substring(0, 100));
  
  r = await fetchProducts('store.status = "approved"');
  console.log('2 store.status:', r.status, r.data.substring(0, 100));
  
  r = await fetchProducts('expand.store.status = "approved"');
  console.log('3 expand.store.status:', r.status, r.data.substring(0, 100));
  
  r = await fetchProducts('store.category = "Todos"');
  console.log('4 store.category:', r.status, r.data.substring(0, 100));
}
run();
