/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool2887830107",
    "name": "on_sale",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "date1515472949",
    "max": "",
    "min": "",
    "name": "sale_ends_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "json1874629670",
    "maxSize": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2011411211",
    "max": null,
    "min": null,
    "name": "original_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("bool2887830107")

  // remove field
  collection.fields.removeById("date1515472949")

  // remove field
  collection.fields.removeById("json1874629670")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2011411211",
    "max": null,
    "min": null,
    "name": "base_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
