// Utilidades básicas
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const CFG = window.VEGASBETT_CONFIG || {};

  function waUrl(number, text){
    const msg = encodeURIComponent(text || "");
    return number ? `https://wa.me/${number}?text=${msg}` : `https://wa.me/?text=${msg}`;
  }
  function moneyFormat(n){
    try { const v = Number(n); if (isNaN(v)) return n;
      return v.toLocaleString('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });
    } catch(e){ return n; }
  }
  function copyFromSelector(sel){
    const el = document.querySelector(sel); if(!el) return false;
    el.select(); document.execCommand('copy');
    toast('Copiado ✅'); return true;
  }
  function toast(text){
    const t = $('#toast'); if(!t) return;
    t.textContent = text; t.classList.add('show');
    setTimeout(()=> t.classList.remove('show'), 1600);
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Overrides por URL
  try{
    const url = new URL(location.href);
    const p = url.searchParams.get('principal');
    const r = url.searchParams.get('respaldo');
    if (p) CFG.NUMERO_PRINCIPAL = p;
    if (r) CFG.NUMERO_RESPALDO  = r;
  }catch(e){}

  // Index
  if ($('#btnPrincipal')){
    $('#btnPrincipal').addEventListener('click', ()=>{
      const text = `Hola, soy ____.\nNecesito atención del *número principal*.\nGracias.`;
      if (typeof fbq==='function'){ fbq('track','Contact',{flow:'direct',target:'principal'}); }
      location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
    });
  }
  if ($('#btnRespaldo')){
    $('#btnRespaldo').addEventListener('click', ()=>{
      const text = `Hola, soy ____.\nNecesito atención del *número de reclamos*.\nGracias.`;
      if (typeof fbq==='function'){ fbq('track','Contact',{flow:'direct',target:'respaldo'}); }
      location.href = waUrl(CFG.NUMERO_RESPALDO, text);
    });
  }

  // Cargar
  if ($('#formCargar')){
    const form=$('#formCargar');
    const paso2=$('#paso2');
    const cbu=$('#cbu'), alias=$('#alias');
    if (cbu) cbu.value = CFG.CBU || '';
    if (alias) alias.value = CFG.ALIAS || '';

    $$('.copybtn').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault(); copyFromSelector(btn.getAttribute('data-copy'));
    }));

    form.addEventListener('submit', e=>{
      e.preventDefault();
      const nombre=$('#nombre').value.trim();
      const monto=$('#monto').value.trim();
      if(!nombre || !monto){ alert('Completá nombre y monto.'); return; }
      paso2.classList.remove('hidden');
      paso2.scrollIntoView({behavior:'smooth',block:'start'});
    });

    const enviar=$('#enviarWhatsCargar');
    if (enviar){
      enviar.addEventListener('click', ()=>{
        const nombre=$('#nombre').value.trim();
        const monto=$('#monto').value.trim();
        if(!nombre || !monto){ alert('Completá nombre y monto.'); return; }
        const text = `Hola, soy *${nombre}*.\nQuiero *CARGAR* ${moneyFormat(monto)}.\nCBU/ALIAS copiado. Envío el comprobante aquí.`;
        if (typeof fbq==='function'){ fbq('track','Contact',{flow:'cargar'}); }
        location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
      });
    }
  }

  // RETIRAR
  if (document.querySelector('#formRetirar')) {
    const titularInput = document.querySelector('#titularR');
    const cbuAliasInput = document.querySelector('#cbuAliasR');
    if (titularInput && CFG.TITULAR) titularInput.value = CFG.TITULAR;
    if (cbuAliasInput) cbuAliasInput.value = (CFG.ALIAS || CFG.CBU || '');

    document.querySelector('#formRetirar').addEventListener('submit', (e) => {
      e.preventDefault();

      const usuario  = document.querySelector('#usuarioR').value.trim();
      const titular  = document.querySelector('#titularR').value.trim();
      const cbuAlias = document.querySelector('#cbuAliasR').value.trim();
      const monto    = document.querySelector('#montoR').value.trim();

      if (!usuario || !titular || !cbuAlias || !monto) {
        alert('Completá todos los campos.');
        return;
      }
      const max = 250000;
      if (Number(monto) > max) {
        alert('El monto máximo por retiro es $250.000');
        return;
      }

      const text = `🎉 *¡FELICITACIONES POR TU PREMIO!* 🥳
Para procesar tu retiro, por favor completá los siguientes datos:

👤 _Usuario:_ ${usuario}
👑 _Titular de la cuenta:_ ${titular}
🏦 _CBU o Alias:_ ${cbuAlias}
💵 _Monto a retirar:_ ${moneyFormat(monto)}

—
⚠️ *IMPORTANTE*
Procesamos los retiros por orden de _llegada._
Si escribís reiteradamente, el mensaje sube y se demora el proceso. Apenas finalicemos, te enviamos el comprobante ✅

—
⏰ *RECORDÁ:*
📆 Solo se puede realizar 1 retiro cada 24 hs.
💸 Monto máximo por retiro: $250.000

—
🙌 Desde VegasBett buscamos darte el mejor servicio posible
💛 Si querés ayudarnos con una propina, ¡te lo vamos a agradecer mucho! 🙏🏻

🤝 Para colaborar, solo pedinos el CBU`;

      const url = waUrl(CFG.NUMERO_PRINCIPAL, text);
      if (typeof fbq === 'function') { fbq('track','Contact',{flow:'retirar'}); }
      window.location.href = url;
    });
  }

  // Panel admin
  const adminToggle=$('#adminToggle');
  const panel=$('#adminPanel');
  const pin=$('#pin');
  const nP=$('#nPrincipal'), nR=$('#nRespaldo');
  if (adminToggle && panel){ adminToggle.addEventListener('click', ()=> panel.classList.toggle('hidden')); }
  if ($('#aplicarAdmin')){
    $('#aplicarAdmin').addEventListener('click', ()=>{
      if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN||'')){ alert('PIN incorrecto'); return; }
      if (nP.value) CFG.NUMERO_PRINCIPAL = nP.value.trim();
      if (nR.value) CFG.NUMERO_RESPALDO  = nR.value.trim();
      toast('Números aplicados (solo en esta sesión)');
    });
  }
  if ($('#genLink')){
    $('#genLink').addEventListener('click', ()=>{
      if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN||'')){ alert('PIN incorrecto'); return; }
      const base=location.origin+location.pathname.replace(/index\.html?$/i,'');
      const qp=new URLSearchParams();
      if (nP.value) qp.set('principal', nP.value.trim());
      if (nR.value) qp.set('respaldo',  nR.value.trim());
      const link=base+'index.html?'+qp.toString();
      const out=$('#linkResult'); if(out){ out.value=link; out.select(); document.execCommand('copy'); toast('Link generado'); }
    });
  }
})();