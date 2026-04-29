import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function removeCategoryRequirement() {
  try {
    await pb.collection('_superusers').authWithPassword('admin@capimercado.com', 'tu_password_seguro');
    
    // Obtener la colección 'stores'
    const storesCollection = await pb.collections.getOne('stores');
    
    // Buscar el campo 'category' y ponerlo como NO requerido
    const categoryField = storesCollection.fields.find(f => f.name === 'category');
    if (categoryField) {
      categoryField.required = false;
      await pb.collections.update('stores', storesCollection);
      console.log('¡Colección stores actualizada exitosamente! category ya no es requerido.');
    } else {
      console.log('No se encontró el campo category en stores.');
    }
    
  } catch (err) {
    console.error('Error:', err.response || err);
  }
}

removeCategoryRequirement();
