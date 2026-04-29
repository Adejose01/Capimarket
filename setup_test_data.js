import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function setup() {
  try {
    console.log("Autenticando como Admin/Superuser...");
    // Update for PocketBase v0.23+ which uses _superusers collection instead of admins
    await pb.collection('_superusers').authWithPassword('admin@capimercado.com', 'tu_password_seguro');
    console.log("Admin autenticado.");

    // 1. Crear Usuario
    let user;
    try {
      const users = await pb.collection('users').getFullList({ filter: `email="amilcarmonterola8@gmail.com"` });
      if (users.length > 0) {
        user = users[0];
        console.log("Usuario ya existe:", user.id);
      } else {
        user = await pb.collection('users').create({
          email: 'amilcarmonterola8@gmail.com',
          password: '30598438',
          passwordConfirm: '30598438',
          name: 'Amilcar Monterola',
          emailVisibility: true
        });
        console.log("Usuario creado:", user.id);
      }
    } catch (err) {
      console.error("Error con usuario:", err.response);
      return;
    }

    // 2. Crear Tienda
    let store;
    try {
      const stores = await pb.collection('stores').getFullList({ filter: `whatsapp="04241732650"` });
      if (stores.length > 0) {
        store = stores[0];
        console.log("Tienda ya existe:", store.id);
      } else {
        store = await pb.collection('stores').create({
          name: 'TechStore VIP',
          slug: 'techstore-vip',
          whatsapp: '04241732650',
          correo: 'amilcarmonterola8@gmail.com',
          instagram: '@techstorevip',
          owner: user.id,
          status: 'approved',
          category: 'Smartphones',
          description: 'Tienda de prueba creada por Antigravity.'
        });
        console.log("Tienda creada:", store.id);
      }
    } catch (err) {
      console.error("Error con tienda:", err.response);
      return;
    }

    // 3. Obtener Categoria
    let catId;
    try {
      const cats = await pb.collection('categories').getFullList({ filter: `name="Smartphones"` });
      if (cats.length > 0) catId = cats[0].id;
    } catch (e) { console.error(e); }

    // 4. Crear Producto
    try {
      const products = await pb.collection('products').getFullList({ filter: `store="${store.id}"` });
      if (products.length === 0) {
        const product = await pb.collection('products').create({
          name: 'iPhone 16 Pro Max 512GB Titanium',
          price: 1299.99,
          store: store.id,
          category: catId || '',
          condition: 'new',
          stock: 'available',
          description: 'El teléfono más avanzado de Apple. Titanio puro.'
        });
        console.log("Producto creado:", product.id);
      } else {
        console.log("Producto ya existe en la tienda.");
      }
    } catch (err) {
      console.error("Error con producto:", err.response);
      return;
    }

    console.log("¡Todo listo! Setup completado exitosamente.");

  } catch (error) {
    console.error("Error General:", error.response || error);
  }
}

setup();
