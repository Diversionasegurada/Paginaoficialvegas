// Lógica principal VegasBett — v18
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CFG = window.VEGASBETT_CONFIG || {};

  // Utilidades
  const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const todayInfo = () => {
    const d = new Date().getDay();
    const percent = (CFG.PROMO_BONUS_BY_DAY && CFG.PROMO_BONUS_BY_DAY[d]) || 0;
    return { dayIndex: d, dayName: DIAS[d], percent };
  };
  const waUrl = (number, text) => {
    const msg = encodeURIComponent(text || "");
    return number ? `https://wa.me/${number}?text=${msg}` : `https://wa.me/?text=${msg}`;
  };
  const money = (n) => { try {
    const v = Number(n); if (isNaN(v)) return n;
    return v.toLocaleString("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 });
  } catch { return n; } };
  const toast = (t) => { const el=$("#toast"); if (!el) return; el.textContent=t; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1600); };
  const copyFrom = (sel) => { const el=$(sel); if(!el) return; el.select(); document.execCommand("copy"); toast("Copiado ✅"); };

  // Año footer
  $("#year") && ($("#year").textContent = new Date().getFullYear());

  // Overrides por URL (emergencia por link)
  try {
    const u = new URL(location.href);
    const p = u.searchParams.get("principal");
    const r = u.searchParams.get("respaldo");
    if (p) CFG.NUMERO_PRINCIPAL = p;
    if (r) CFG.NUMERO_RESPALDO  = r;
  } catch {}

  // HOTFIX REMOTO: assets/hotfix.json (no cache)
  (async function applyHotfix(){
    try {
      const res = await fetch('assets/hotfix.json?ts='+Date.now(), { cache:'no-store' });
      if (!res.ok) return;
      const hf = await res.json();
      if (hf && typeof hf === 'object') Object.assign(CFG, hf);

      // refrescar campos visibles si ya existe el DOM
      const cbu   = $("#cbu");
      const alias = $("#alias");
      const tit   = $("#titularCta");
      if (cbu && CFG.CBU)     cbu.value   = CFG.CBU;
      if (alias && CFG.ALIAS) alias.value = CFG.ALIAS;
      if (tit && CFG.TITULAR) tit.textContent = CFG.TITULAR;
    } catch {}
  })();

  // Mostrar Admin solo con ?admin=1
  (function showAdmin(){
    try { if (new URL(location.href).searchParams.get('admin')==='1')
      $("#adminToggle")?.classList.remove('hidden'); } catch {}
  })();

  // PROMO DEL DÍA (index)
  (function promoTicker(){
    const a = $("#promoTicker"); if (!a) return;
    const qp = new URLSearchParams(location.search);
    const forceOff = qp.get("promos")==="off";
    const forceOn  = qp.get("promos")==="on";
    if ((!CFG.SHOW_PROMO_TICKER && !forceOn) || forceOff) { a.classList.add("hidden"); return; }

    const t = todayInfo();
    if (!t.percent) { a.classList.add("hidden"); return; }

    const min = CFG.PROMO_MIN || 2000;
    const max = CFG.PROMO_MAX || 20000;
    const txt = `Hoy ${t.dayName}: bono +${t.percent}% en cargas de ${money(min)} a ${money(max)}. (1 bono cada 24 h por usuario)`;
    $("#promoText") && ($("#promoText").textContent = txt);
    const base = location.origin + location.pathname.replace(/index\.html?$/i,'');
    a.href = `${base}cargar.html?promo=today`;
    a.classList.remove("hidden");
  })();

  // Home: botones
  $("#btnPrincipal")?.addEventListener("click", () => {
    const text = `Hola, soy ____.
Necesito atención del *número principal*.
Gracias.`;
    location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
  });
  $("#btnRespaldo")?.addEventListener("click", () => {
    const text = `Hola, soy ____.
Necesito atención del *número de reclamos*.
Gracias.`;
    location.href = waUrl(CFG.NUMERO_RESPALDO, text);
  });

  // CARGAR
  if ($("#formCargar")) {
    const form  = $("#formCargar");
    const paso2 = $("#paso2");
    const cbu   = $("#cbu");
    const alias = $("#alias");
    const tit   = $("#titularCta");
    if (cbu)   cbu.value   = CFG.CBU   || "";
    if (alias) alias.value = CFG.ALIAS || "";
    if (tit)   tit.textContent = CFG.TITULAR || "-";

    $$(".copybtn").forEach(btn => btn.addEventListener("click", (e) => {
      e.preventDefault(); copyFrom(btn.getAttribute("data-copy"));
    }));

    // Detectar promo
    const qp = new URLSearchParams(location.search);
    const promoParam = qp.get('promo'); // 'today' | 'new' | null
    let activePromo = null;

    if (promoParam === 'today') {
      const t = todayInfo();
      if (t.percent) {
        activePromo = { type:'today', label:'Bono del día', percent:t.percent, dayName:t.dayName, min:CFG.PROMO_MIN||2000, max:CFG.PROMO_MAX||20000 };
        const n = $("#promoNotice");
        if (n) { n.textContent = `Promo activa: +${t.percent}% (${t.dayName}) de ${money(activePromo.min)} a ${money(activePromo.max)}. 1 cada 24 h por usuario.`; n.classList.remove("hidden"); }
      }
    }
    if (promoParam === 'new') {
      activePromo = { type:'new', label:'Bono de bienvenida', percent:CFG.NEW_USER_BONO||35, min:CFG.NEW_MIN||500, max:null };
      const n = $("#promoNotice");
      if (n) { n.textContent = `Bono de bienvenida +${activePromo.percent}% (mínimo ${money(activePromo.min)}).`; n.classList.remove("hidden"); }
    }

    // mínimo en input si aplica
    const montoInput = $('#monto');
    if (montoInput && activePromo?.min) montoInput.min = String(activePromo.min);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = $("#nombre").value.trim();
      const monto  = $("#monto").value.trim();
      if (!nombre || !monto) { alert("Completá nombre y monto."); return; }
      paso2.classList.remove("hidden");
      paso2.scrollIntoView({ behavior:"smooth", block:"start" });
    });

    $("#enviarWhatsCargar")?.addEventListener("click", () => {
      const nombre = $("#nombre").value.trim();
      const monto  = $("#monto").value.trim();
      if (!nombre || !monto) { alert("Completá nombre y monto."); return; }

      // Validaciones promo
      if (activePromo) {
        const m = Number(monto);
        if (activePromo.type === 'today') {
          const {min,max} = activePromo;
          if (m < min || m > max) { alert(`El ${activePromo.label} aplica entre ${money(min)} y ${money(max)}.`); return; }
        }
        if (activePromo.type === 'new') {
          const {min} = activePromo;
          if (m < min) { alert(`El ${activePromo.label} aplica desde ${money(min)}.`); return; }
        }
      }

      const lines = [
        `Hola, soy *${nombre}*.`,
        `Quiero *CARGAR* ${money(monto)}.`
      ];
      if (activePromo) {
        if (activePromo.type === 'today') lines.push(`Aplicar *${activePromo.label}* (${activePromo.dayName} +${activePromo.percent}%).`);
        else lines.push(`Soy nuevo/a y quiero el *${activePromo.label}* (+${activePromo.percent}%).`);
      }
      lines.push(`CBU/ALIAS copiado. Envío el comprobante aquí.`);
      location.href = waUrl(CFG.NUMERO_PRINCIPAL, lines.join('\n'));
    });
  }

  // RETIRAR
  if ($("#formRetirar")) {
    const titularInput = $("#titularR");
    const cbuAliasInput = $("#cbuAliasR");
    if (titularInput && CFG.TITULAR) titularInput.value = CFG.TITULAR;
    if (cbuAliasInput) cbuAliasInput.value = (CFG.ALIAS || CFG.CBU || "");

    $("#formRetirar").addEventListener("submit", (e) => {
      e.preventDefault();
      const usuario  = $("#usuarioR").value.trim();
      const titular  = $("#titularR").value.trim();
      const cbuAlias = $("#cbuAliasR").value.trim();
      const monto    = $("#montoR").value.trim();

      if (!usuario || !titular || !cbuAlias || !monto) { alert("Completá todos los campos."); return; }
      if (Number(monto) > 250000) { alert("El monto máximo por retiro es $250.000"); return; }

      const text = `Usuario: ${usuario}
Titular: ${titular}
CBU o Alias: ${cbuAlias}
Monto a retirar: ${money(monto)}`;
      location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
    });
  }

  // Panel Admin
  const adminToggle = $("#adminToggle");
  const panel = $("#adminPanel");
  const pin   = $("#pin");
  const nP    = $("#nPrincipal");
  const nR    = $("#nRespaldo");
  adminToggle && panel && adminToggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  $("#aplicarAdmin")?.addEventListener("click", () => {
    if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN || "")) { alert("PIN incorrecto"); return; }
    if (nP && nP.value) CFG.NUMERO_PRINCIPAL = nP.value.trim();
    if (nR && nR.value) CFG.NUMERO_RESPALDO  = nR.value.trim();
    toast("Números aplicados (solo en esta sesión)");
  });
  $("#genLink")?.addEventListener("click", () => {
    if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN || "")) { alert("PIN incorrecto"); return; }
    const base = location.origin + location.pathname.replace(/index\.html?$/i,"");
    const qp = new URLSearchParams();
    if (nP && nP.value) qp.set("principal", nP.value.trim());
    if (nR && nR.value) qp.set("respaldo",  nR.value.trim());
    const link = base + "index.html?" + qp.toString();
    const out = $("#linkResult");
    if (out) { out.value = link; out.select(); document.execCommand("copy"); toast("Link generado"); }
  });

  // Age 18+
  (function ageGate(){
    if (!CFG.AGE_GATE_ENABLED) return;
    if (localStorage.getItem('AGE_OK') === '1') return;
    const minAge = CFG.EDAD_MINIMA || 18;
    const backdrop = document.createElement('div');
    backdrop.className = 'age-backdrop';
    backdrop.innerHTML = `
      <div class="age-modal">
        <h3>Confirmación de edad <span class="age-badge">${minAge}+</span></h3>
        <p>Para continuar, confirmá que sos mayor de ${minAge} años. Jugá responsable.</p>
        <div class="age-actions">
          <button id="ageYes" class="btn ok">Sí, soy mayor</button>
          <button id="ageNo" class="btn warn">No, salir</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    $("#ageYes")?.addEventListener('click', ()=>{ localStorage.setItem('AGE_OK','1'); backdrop.remove(); });
    $("#ageNo")?.addEventListener('click', ()=>{ window.location.href='https://www.google.com'; });
  })();

  // Modal Más info (copiar spech)
  (function(){
    const modal=$("#modalInfo"), btnOpen=$("#btnMasInfo");
    if (!modal || !btnOpen) return;
    const btnClose=$("#modalClose"), btnOk=$("#modalOk"), btnCopy=$("#copySpech"), spech=$("#spechText");
    const open = ()=>{ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); };
    const close= ()=>{ modal.classList.add('hidden');   modal.setAttribute('aria-hidden','true');  };
    btnOpen.addEventListener('click', open);
    btnClose?.addEventListener('click', close);
    btnOk?.addEventListener('click', close);
    modal.querySelector('.vb-modal__backdrop')?.addEventListener('click', e=>{ if(e.target.dataset.close) close(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
    btnCopy?.addEventListener('click', ()=>{
      const txt = spech?.innerText || '';
      (navigator.clipboard?.writeText(txt) || Promise.reject()).then(
        ()=> toast('Texto copiado ✅'),
        ()=> { const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Texto copiado ✅'); }
      );
    });
  })();
})();

