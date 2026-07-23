/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3800236418")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_bQ095A0Ze4` ON `stores` (`slug`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3800236418")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
