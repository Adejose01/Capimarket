migrate((app) => {
  const products = app.findCollectionByNameOrId("products");
  const stores = app.findCollectionByNameOrId("stores");

  // 1. Blindaje de Archivos en Products
  const productImages = products.fields.getByName("images");
  if (productImages) {
    productImages.maxSize = 5242880; // 5MB
    productImages.mimeTypes = ["image/jpeg", "image/png", "image/webp"];
  }
  app.save(products);

  // 2. Blindaje de Archivos en Stores
  const logo = stores.fields.getByName("logo");
  if (logo) {
    logo.maxSize = 5242880;
    logo.mimeTypes = ["image/jpeg", "image/png", "image/webp"];
  }
  const banner = stores.fields.getByName("banner");
  if (banner) {
    banner.maxSize = 5242880;
    banner.mimeTypes = ["image/jpeg", "image/png", "image/webp"];
  }
  app.save(stores);

  console.log("Blindaje de seguridad aplicado a las colecciones.");
}, (app) => {
  // Rollback logic
});
