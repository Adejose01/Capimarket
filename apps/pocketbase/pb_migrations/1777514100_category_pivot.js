migrate((app) => {
  const collection = app.findCollectionByNameOrId("categories");
  
  // 1. Eliminar Hogar y todas sus subcategorías asociadas
  try {
    const hogarRoot = app.findFirstRecordByFilter("categories", 'name = "Hogar"');
    if (hogarRoot) {
      const children = app.findRecordsByFilter("categories", `parent_id = "${hogarRoot.id}"`);
      for (const child of children) {
        app.delete(child);
      }
      app.delete(hogarRoot);
    }
  } catch (err) {
    console.log("Hogar not found or already deleted");
  }

  // 2. Implementación de "Ropa & Moda"
  const ropaRoot = new Record(collection);
  ropaRoot.set("name", "Ropa & Moda");
  ropaRoot.set("slug", "ropa-moda");
  ropaRoot.set("icon", "lucide-shirt");
  ropaRoot.set("gradient", "from-pink-500 to-rose-600"); // Estética premium
  ropaRoot.set("textColor", "text-white");
  ropaRoot.set("span", "col-span-2 row-span-1");
  app.save(ropaRoot);

  const subcats = [
    { name: "Calzado (Zapatos)", slug: "calzado" },
    { name: "Accesorios Moda", slug: "accesorios-moda" },
    { name: "Ropa de Caballero", slug: "caballero" },
    { name: "Ropa de Dama", slug: "dama" },
    { name: "Ropa Infantil", slug: "infantil" }
  ];

  for (const s of subcats) {
    const rec = new Record(collection);
    rec.set("name", s.name);
    rec.set("slug", s.slug);
    rec.set("parent_id", ropaRoot.id);
    rec.set("icon", "lucide-package");
    app.save(rec);
  }
}, (app) => {
  // Rollback logic can be implemented if needed, but for a pivot it's usually destructive
});
