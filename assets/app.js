// assets/app.js - Versión Blindada
(function () {
  const $ = (s) => document.querySelector(s);
  const CFG = window.VEGASBETT_CONFIG || {};

  // 1. Determinar quién atiende
  const obtenerEncargado = () => {
    const hora = new Date().getHours();
    if (!CFG.ATENCION) return { nombre: "Soporte", numero: "5492235393540" };
    
    if (hora >= CFG.ATENCION.CLARA.inicio && hora < CFG.ATENCION.CLARA.fin) {
      return CFG.ATENCION.CLARA;
    } else {
      return CFG.ATENCION.JULI;
    }
  };

  const encargado = obtenerEncargado();

  // 2. Activar botones del Index
  const btnDinamico = $("#btnAtencionDinamica");
  if (btnDinamico) {
    btnDinamico.textContent = "Chatear con " + encargado.nombre + " (Online)";
    btnDinamico.onclick = () => {
      const msj = encodeURIComponent("Hola " + encargado.nombre + ", necesito atención.");
      window.open("https://wa.me/" + encargado.numero + "?text=" + msj, "_blank");
    };
  }

  const btnRespaldo = $("#btnRespaldo");
  if (btnRespaldo) {
    btnRespaldo.onclick = () => {
      window.open("https://wa.me/" + encargado.numero + "?text=Hola, necesito ayuda.", "_blank");
    };
  }

  // 3. Activar Año y Horario
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  if ($("#infoHorario")) $("#infoHorario").textContent = "Atención: Clara (08 a 20hs) • Juli (20 a 08hs)";

  // 4. Lógica de Cargar/Retirar (Redirigir al de turno)
  if ($("#enviarWhatsCargar")) {
    $("#enviarWhatsCargar").onclick = () => {
      const nom = $("#nombre").value;
      const mon = $("#monto").value;
      const msj = encodeURIComponent("Hola " + encargado.nombre + ", soy " + nom + ". Quiero CARGAR $" + mon);
      window.open("https://wa.me/" + encargado.numero + "?text=" + msj, "_blank");
    };
  }

  // 5. Age Gate simple
  const ageYes = $("#ageYes");
  if (ageYes) {
    ageYes.onclick = () => {
      localStorage.setItem('AGE_OK', '1');
      $(".age-backdrop").remove();
    };
  }
})();
