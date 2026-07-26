/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select2264912517",
    "maxSelect": 1,
    "name": "membership",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "none",
      "silver",
      "gold"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select2264912517")

  return app.save(collection)
})
