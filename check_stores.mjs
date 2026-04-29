async function run() {
  const res = await fetch('http://localhost:8090/api/collections/stores/records');
  const data = await res.json();
  console.log("Stores:", data.items.map(s => ({ id: s.id, name: s.name, status: s.status })));
}
run();
