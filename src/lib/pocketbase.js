import PocketBase from 'pocketbase';

// Instancia singleton de PocketBase — todas las páginas y componentes importan desde aquí.
// Nginx se encarga del enrutamiento sin necesidad del puerto 8090 en producción.
const pb = new PocketBase('http://localhost:8090');

export default pb;
