// @ts-check
/// <reference path="../pb_data/types.d.ts" />

// Sincroniza configuraciones de PocketBase con variables de entorno al iniciar
onAfterBootstrap((e) => {
    const settings = e.app.settings();

    // 1. Configuración de Google OAuth
    const googleId = os.Getenv("GOOGLE_CLIENT_ID");
    const googleSecret = os.Getenv("GOOGLE_CLIENT_SECRET");
    if (googleId && googleSecret) {
        settings.authProviders.google.enabled = true;
        settings.authProviders.google.clientId = googleId;
        settings.authProviders.google.clientSecret = googleSecret;
    }

    // 2. Configuración de SMTP (Resend)
    const smtpHost = os.Getenv("SMTP_HOST");
    if (smtpHost) {
        settings.smtp.enabled = true;
        settings.smtp.host = smtpHost;
        settings.smtp.port = parseInt(os.Getenv("SMTP_PORT") || "587");
        settings.smtp.username = os.Getenv("SMTP_USER") || "resend";
        settings.smtp.password = os.Getenv("SMTP_PASS") || "";
    }

    // 3. Metadatos del Remitente
    const senderName = os.Getenv("SMTP_SENDER_NAME");
    const senderEmail = os.Getenv("SMTP_SENDER_ADDRESS");
    if (senderName && senderEmail) {
        settings.meta.senderName = senderName;
        settings.meta.senderAddress = senderEmail;
        settings.meta.appName = "CapiMercado";
    }

    e.app.saveSettings(settings);
    // Usamos el logger de la app para que aparezca en el panel de admin
    e.app.logger().info("✅ Configuración de CapiMercado sincronizada desde variables de entorno.");
});
