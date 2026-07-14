/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 60px 20px; text-align: center;\">\n  <div style=\"max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #10b981; border-radius: 24px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);\">\n    <div style=\"display: inline-block; width: 64px; height: 64px; background-color: #10b981; border-radius: 16px; margin-bottom: 32px; line-height: 64px; text-align: center;\">\n      <span style=\"color: #000000; font-size: 32px; font-weight: 900;\">C</span>\n    </div><h1 style=\"font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff; letter-spacing: -0.025em;\">Restablecer Contrasena</h1>\n  <p style=\"font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px;\">Hola,<br>Hemos recibido una solicitud para restablecer la contrasena de tu cuenta en CapiMercado. Haz clic en el boton de abajo para continuar.</p><a href=\"{APP_URL}/_/#/auth/password-reset/{TOKEN}\" style=\"display: inline-block; background-color: #10b981; color: #000000; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.2s;\">Restablecer Contrasena</a>\n  <div style=\"margin-top: 40px; padding-top: 24px; border-top: 1px solid #1f2937;\">\n  <p style=\"font-size: 14px; color: #64748b;\">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>\n  <p style=\"font-size: 14px; color: #64748b; margin-top: 8px;\">(c) 2024 CapiMercado. El Mercado Digital Lider.</p>\n  </div>\n  </div>\n</div></p></a></p></h1></sp\n</div>",
      "subject": "Restablecer tu contrasena en CapiMercado"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<div style=\"background-color: #000000; color: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 60px 20px; text-align: center;\">\n      <div style=\"max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #10b981; border-radius: 24px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);\">\n                <div style=\"display: inline-block; width: 64px; height: 64px; background-color: #10b981; border-radius: 16px; margin-bottom: 32px; line-height: 64px; text-align: center;\">\n                              <span style=\"color: #000000; font-size: 32px; font-weight: 900;\">C</span>\n                        </div>\n              <h1 style=\"font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff; letter-spacing: -0.025em;\">Restablecer Contrasena</h1>\n              <p style=\"font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px;\">Hola,<br>Hemos recibido una solicitud para restablecer la contrasena de tu cuenta en CapiMarket. Haz clic en el boton de abajo para continuar.</p>\n              <a href=\"{APP_URL}/_/#/auth/password-reset/{TOKEN}\" style=\"display: inline-block; background-color: #10b981; color: #000000; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 12px; text-decoration: none; transition: all 0.2s;\">Restablecer Contrasena</a>\n              <div style=\"margin-top: 40px; padding-top: 24px; border-top: 1px solid #1f2937;\">\n                          <p style=\"font-size: 14px; color: #64748b;\">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>\n                          <p style=\"font-size: 14px; color: #64748b; margin-top: 8px;\">(c) 2024 CapiMarket. Luxury Marketplace.</p>\n                      </div>\n          </div>\n</div></p></a></p></h1></span>\n</div>",
      "subject": "Restablecer tu contraseña en CapiMarket"
    }
  }, collection)

  return app.save(collection)
})
