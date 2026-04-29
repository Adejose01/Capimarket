/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3800236418") // stores

  // add field
  collection.fields.add(new Field({
    "hidden": false,
    "id": "url_maps_url_123",
    "name": "maps_url",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url",
    "exceptDomains": [],
    "onlyDomains": []
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3800236418")

  // remove field
  collection.fields.removeById("url_maps_url_123")

  return app.save(collection)
})
