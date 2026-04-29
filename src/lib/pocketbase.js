import PocketBase from 'pocketbase';

// Instancia singleton de PocketBase
// En desarrollo usa la URL de la variable de entorno, en producción usa la ruta relativa ('/')
// Nginx se encarga del enrutamiento proxy.
const pb = new PocketBase(import.meta.env.VITE_PB_URL || '/');

export default pb;
