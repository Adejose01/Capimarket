/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 100,
    "min": 1,
    "name": "name",
    "pattern": "^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9&]+( [A-Za-zÁÉÍÓÚáéíóúÑñ0-9&]+)*$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 100,
    "min": 1,
    "name": "name",
    "pattern": "^[a-zA-C-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+( [a-zA-C-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+)*$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
