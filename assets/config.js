// Configuración central — VegasBett (v18)
window.VEGASBETT_CONFIG = {
  // Marca
  MARCA: "VegasBett",

  // Números (sin + ni espacios)
  NUMERO_PRINCIPAL: "5492236631329",
  NUMERO_RESPALDO:  "5492236631329",

  // Datos bancarios
  CBU: "0000003100056935839518",
  ALIAS: "Vegass.bet",
  TITULAR: "Priscila Correa",

  // Preview / privacidad
  SHARE_PREVIEW: true,
  OG_IMAGE: "assets/portada_paginaweb.png",
  NO_INDEX: true,

  // Pixel (opcional)
  TRACKING_ENABLED: false,
  PIXEL_ID: "24100361799629508",

  // Admin
  EMERGENCY_PIN: "4321",

  // Age gate
  AGE_GATE_ENABLED: true,
  EDAD_MINIMA: 18,

  // ===== Promos =====
  // Mostrar/ocultar banner (o usar ?promos=off / ?promos=on en la URL)
  SHOW_PROMO_TICKER: true,

  // Rango válido para promo del día
  PROMO_MIN: 2000,
  PROMO_MAX: 20000,

  // Porcentaje por día (0=Dom,1=Lun,...6=Sáb)
  PROMO_BONUS_BY_DAY: {
    0: 15, // Domingo
    1: 5, // Lunes
    2: 10, // Martes
    3: 5, // Miércoles
    4: 10, // Jueves
    5: 15, // Viernes
    6: 15  // Sábado
  },

  // Bono bienvenida
  NEW_USER_BONO: 35,
  NEW_MIN: 500
};
