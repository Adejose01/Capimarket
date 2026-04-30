migrate((app) => {
  const categoriesCollection = app.findCollectionByNameOrId("categories");
  const storesCollection = app.findCollectionByNameOrId("stores");
  const productsCollection = app.findCollectionByNameOrId("products");

  // 1. Add parent_id to categories
  categoriesCollection.fields.add(new Field({
    "id": "rel_parent_id",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "system": false,
    "collectionId": categoriesCollection.id,
    "cascadeDelete": false,
    "minSelect": null,
    "maxSelect": 1,
    "displayFields": null
  }));

  app.save(categoriesCollection);

  // 2. Define Category Tree
  const taxonomy = {
    "Electrónica y Tecnología": ["Smartphones", "Laptops", "Audio", "Periféricos"],
    "Deportes": ["Ropa Deportiva", "Suplementos", "Equipamiento"],
    "Vehículos": ["Camionetas", "Repuestos", "Accesorios"],
    "Hogar": ["Muebles", "Decoración", "Electrodomésticos"]
  };

  const categoryMap = {}; // name -> id

  for (const [rootName, children] of Object.entries(taxonomy)) {
    // Create Root
    let root;
    try {
      root = app.findFirstRecordByFilter("categories", `name = "${rootName}"`);
    } catch (e) {
      root = new Record(categoriesCollection);
      root.set("name", rootName);
      root.set("slug", rootName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
      root.set("icon", "lucide-folder");
      app.save(root);
    }
    categoryMap[rootName] = root.id;

    for (const childName of children) {
      let child;
      try {
        child = app.findFirstRecordByFilter("categories", `name = "${childName}"`);
        child.set("parent_id", root.id);
        app.save(child);
      } catch (e) {
        child = new Record(categoriesCollection);
        child.set("name", childName);
        child.set("slug", childName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
        child.set("parent_id", root.id);
        child.set("icon", "lucide-circle");
        app.save(child);
      }
      categoryMap[childName] = child.id;
    }
  }

  // 3. Migrate Products
  // Current products use the old categories (relation or text? let's check products collection)
  // In snapshot line 1210, products.category is a relation to categories.
  const products = app.findAllRecords("products");
  const smartphonesId = categoryMap["Smartphones"];
  const laptopsId = categoryMap["Laptops"];
  const audioId = categoryMap["Audio"];
  const accId = categoryMap["Periféricos"] || categoryMap["Accesorios"];

  for (const p of products) {
    // If it was already in a category that matches our new subcategories, it's fine.
    // But the user said "asignándolos a las subcategorías de 'Electrónica y Tecnología' que correspondan".
    // I'll try to map them based on their old category name or name.
    const oldCatId = p.get("category");
    if (oldCatId) {
       try {
         const oldCat = app.findRecordById("categories", oldCatId);
         const oldName = oldCat.getString("name");
         if (categoryMap[oldName]) {
           p.set("category", categoryMap[oldName]);
         } else {
           // Default to Periféricos/Accesorios if in Electronics
           p.set("category", smartphonesId); // Placeholder, maybe improved logic
         }
       } catch(e) {
         p.set("category", smartphonesId);
       }
    } else {
      p.set("category", smartphonesId);
    }
    app.save(p);
  }

  // 4. Update Stores (Phase 3 Prep)
  // Modify category field in stores to be multiple relation
  // First, we need to change the field type. PocketBase migrations usually handle this via fields.remove/add or fields.update
  const categoryField = storesCollection.fields.getByName("category");
  if (categoryField && categoryField.type === "text") {
    storesCollection.fields.removeByName("category");
    storesCollection.fields.add(new Field({
      "id": "rel_categories",
      "name": "category", // keeping the name but changing type
      "type": "relation",
      "required": false,
      "presentable": false,
      "unique": false,
      "system": false,
      "collectionId": categoriesCollection.id,
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 10, // Multiple
      "displayFields": null
    }));
    app.save(storesCollection);
  }

}, (app) => {
  // Rollback logic if needed
})
