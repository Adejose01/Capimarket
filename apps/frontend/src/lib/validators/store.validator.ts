// src/lib/validators/store.validator.ts

export const STORE_RULES = {
  // Instagram: 1 a 30 caracteres alfanuméricos, puntos o guiones bajos
  INSTAGRAM_REGEX: /^[a-zA-Z0-9._]{1,30}$/,
  // Teléfono: de 7 a 15 dígitos numéricos sin contar el + y código de área
  PHONE_DIGITS_REGEX: /^\d{7,15}$/,
};

export interface ValidateStoreInputParams {
  instagram: string;
  countryCode: string;
  phoneDigits: string;
}

export const validateStoreInput = ({
  instagram,
  countryCode,
  phoneDigits,
}: ValidateStoreInputParams) => {
  const errors: Record<string, string> = {};

  // Sanitización de Instagram (limpia espacios y remueve @ si el usuario lo tipeó)
  const cleanInstagram = instagram.trim().replace(/^@/, "");

  if (!cleanInstagram) {
    errors.instagram = "El usuario de Instagram es requerido.";
  } else if (!STORE_RULES.INSTAGRAM_REGEX.test(cleanInstagram)) {
    errors.instagram =
      "El usuario de Instagram solo puede contener letras, números, puntos o '_' (máx 30 caracteres).";
  }

  // Sanitización de teléfono
  const cleanPhoneDigits = phoneDigits.trim().replace(/\D/g, ""); // Remueve cualquier no-dígito
  const fullPhone = `${countryCode}${cleanPhoneDigits}`;

  if (!cleanPhoneDigits) {
    errors.whatsapp = "El número de WhatsApp es requerido.";
  } else if (!STORE_RULES.PHONE_DIGITS_REGEX.test(cleanPhoneDigits)) {
    errors.whatsapp =
      "El número telefónico no tiene una cantidad de dígitos válida.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedValues: {
      instagram: cleanInstagram,
      whatsapp: fullPhone,
    },
  };
};
