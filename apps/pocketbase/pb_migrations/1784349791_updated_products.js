/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2011411211",
    "max": null,
    "min": null,
    "name": "base_price",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select1261852256",
    "maxSelect": 0,
    "name": "stock",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "available",
      "out_of_stock",
      "not_specified"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("number2011411211")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select1261852256",
    "maxSelect": 0,
    "name": "stock",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "available",
      "out_of_stock"
    ]
  }))

  return app.save(collection)
})
