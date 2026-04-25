// Configuración central — VegasBett (v18.1)
window.VEGASBETT_CONFIG = {
  MARCA: "VegasBett",

  // TURNOS DE ATENCIÓN
  ATENCION: {
    CLARA: {
      nombre: "Clara",
      numero: "5492236631329",
      inicio: 8,  // Desde las 08:00 hs
      fin: 20     // Hasta las 20:00 hs
    },
    JULI: {
      nombre: "Juli",
      numero: "5492235393540",
      inicio: 20, // Desde las 20:00 hs
      fin: 8      // Hasta las 08:00 hs
    }
  },

  // Datos bancarios
  CBU: "0000085700274606489697",
  ALIAS: "Vegasbett",
  TITULAR: "Milagros Diana Maricel Quinonez",

  SHARE_PREVIEW: true,
  OG_IMAGE: "assets/portada_paginaweb.png",
  NO_INDEX: true,
  EMERGENCY_PIN: "4321",
  AGE_GATE_ENABLED: true,
  EDAD_MINIMA: 18,

  // Promos
  SHOW_PROMO_TICKER: true,
  PROMO_MIN: 2000,
  PROMO_MAX: 20000,
  PROMO_BONUS_BY_DAY: { 0: 10, 1: 5, 2: 10, 3: 5, 4: 5, 5: 10, 6: 10 },
  NEW_USER_BONO: 35,
  NEW_MIN: 500
};
