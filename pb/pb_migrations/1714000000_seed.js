migrate((app) => {
  const collection = app.findCollectionByNameOrId("categories");
  
  const categories = [
    { name: "Smartphones", slug: "smartphones", span: "col-span-2 row-span-2", gradient: "from-slate-900 to-slate-700", textColor: "text-white" },
    { name: "Laptops", slug: "laptops", span: "col-span-1 row-span-1", gradient: "from-indigo-50 to-indigo-100", textColor: "text-indigo-900" },
    { name: "Audio", slug: "audio", span: "col-span-1 row-span-1", gradient: "from-emerald-50 to-emerald-100", textColor: "text-emerald-900" },
    { name: "Accesorios", slug: "accesorios", span: "col-span-2 row-span-1", gradient: "from-amber-50 to-orange-100", textColor: "text-amber-900" }
  ];
  
  for (const cat of categories) {
    const record = new Record(collection);
    record.set("name", cat.name);
    record.set("slug", cat.slug);
    record.set("span", cat.span);
    record.set("gradient", cat.gradient);
    record.set("textColor", cat.textColor);
    record.set("icon", "lucide-" + cat.slug); // just a dummy value since it's required
    app.save(record);
  }
}, (app) => {
  const collection = app.findCollectionByNameOrId("categories");
  const records = app.findAllRecords(collection);
  for (const record of records) {
    app.delete(record);
  }
});
