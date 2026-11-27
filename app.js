{
// =====================================================================
//  Mapa da Obra — app (site externo, banco Supabase)
// =====================================================================
const O=window.OBRA;
const SECTORS=O.setores, VIEWS=O.plantas, SVC=O.servicos;
const WET=new RegExp(O.areasMolhadas||'^$','i');
const COL={C:'var(--c)',NC:'var(--nc)',NA:'var(--na)',P:'var(--pend)','':'var(--ini)'};
const STN={C:'Conforme',NC:'Não conforme',NA:'Não se aplica',P:'Em andamento','':'Pendente'};
const SIT={rec:['Recebido','#1F3864'],lib:['Liberado','var(--c)'],nc:['Com não conformidade','var(--nc)'],and:['Em andamento','var(--pend)'],ini:['Não iniciado','var(--ini)']};
const svcsOf=s=>SVC.filter(v=>(s.svc?s.svc.includes(v.id):(!v.w||WET.test(s.n))));
const byId=Object.fromEntries(SECTORS.map(s=>[s.id,s]));
const svcById=Object.fromEntries(SVC.map(v=>[v.id,v]));
const ixOf=v=>SVC.indexOf(v)+1;
const itemOf=(vid,iid)=>(svcById[vid]?.itens||[]).find(i=>i.id===iid);
const code=(vid,iid)=>{const v=svcById[vid];if(!v)return'';const k=v.itens.findIndex(i=>i.id===iid);return ixOf(v)+(k>=0?'.'+(k+1):'')};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const fmt=ms=>ms?new Date(ms).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
const fmtD=d=>{if(!d)return'';const[y,m,dd]=String(d).slice(0,10).split('-');return `${dd}/${m}/${y}`};
const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const uuid=()=>(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)}));
const $=id=>document.getElementById(id);
const svcName=id=>svcById[id]?.n||'';
const label=(v,i)=>v?(code(v,i)+' '+svcName(v)+(i&&itemOf(v,i)?' › '+itemOf(v,i).n:'')):'Ambiente em geral';
const viewName=id=>VIEWS.find(v=>v.id===id)?.n||'';
const touch=matchMedia('(pointer:coarse)').matches;
document.title=O.tituloCurto||'Mapa da Obra';$('ttl').textContent=O.titulo;
$('sub').innerHTML=(O.etiquetas||[O.subtitulo]).map(x=>`<span class="chip">${esc(x)}</span>`).join('');

// ---------- estado ----------
let LIB={},CMS=[],NCS={},REC={},canWrite=false,ME='',localImg={};
let view=VIEWS[0].id,sel=null,mode='geral',filt='',vb=null,tab='mapa',draft={t:'',v:'',i:''},cmOpen=false,pf='',pAll=false,LB=null,open=new Set(),ncTab='ab';
const H=location.hash.slice(1);if(byId[H]){sel=H;view=byId[H].v}

// ---------- cálculo de situação ----------
const key=(s,v,i)=>s+'__'+v+'__'+i;
const rec=(s,v,i)=>LIB[key(s,v,i)]||{};
function svcStat(s,v){let c=0,nc=0,na=0,p=0,first=null;
  for(const it of v.itens){const st=rec(s.id,v.id,it.id).st;if(st==='C')c++;else if(st==='NC')nc++;else if(st==='NA')na++;else p++;if(!first&&st!=='C'&&st!=='NA')first=it}
  const t=v.itens.length;const st=nc?'NC':(na===t?'NA':(p===0?'C':(c+na?'P':'')));
  return{c,nc,na,p,t,st,first,pct:Math.round((c+na)/t*100)}}
function info(s){let c=0,nc=0,na=0,p=0,t=0,et=null,eti=null;
  for(const v of svcsOf(s)){const x=svcStat(s,v);c+=x.c;nc+=x.nc;na+=x.na;p+=x.p;t+=x.t;if(!et&&x.st!=='C'&&x.st!=='NA'){et=v;eti=x.first}}
  t=t||1;const sit=nc?'nc':(p===0?(REC[s.id]?'rec':'lib'):(c+na?'and':'ini'));
  return{c,nc,na,p,t,et,eti,sit,pct:Math.round((c+na)/t*100)}}
function colorOf(s){
  if(mode==='geral')return SIT[info(s).sit][1];
  const v=svcsOf(s).find(v=>v.id===mode);if(!v)return 'transparent';
  return COL[svcStat(s,v).st]}
function bar(x,cls){const w=n=>(n/x.t*100).toFixed(1)+'%';
  return `<div class="${cls}"><span style="width:${w(x.c)};background:var(--c)"></span><span style="width:${w(x.na)};background:var(--na)"></span><span style="width:${w(x.nc)};background:var(--nc)"></span></div>`}
// NCs
const ncList=()=>Object.values(NCS).filter(n=>byId[n.setor]&&itemOf(n.servico,n.item));
const ncOpen=(s,v,i)=>ncList().find(n=>n.setor===s&&n.servico===v&&n.item===i&&n.status==='Aberta');
const ncLate=n=>n.status==='Aberta'&&n.prazo&&n.prazo<today();
const ncDays=n=>Math.max(0,Math.floor(((n.resolvida_em||Date.now())-n.aberta_em)/864e5));
function ncNum(n){const all=Object.values(NCS).sort((a,b)=>a.aberta_em-b.aberta_em||String(a.id).localeCompare(b.id));return 'NC-'+String(all.indexOf(n)+1).padStart(3,'0')}
const photosOf=s=>CMS.filter(c=>c.s===s&&c.f&&photoUrl(c.f)).sort((a,b)=>b.at-a.at);
const ncHasPhoto=n=>CMS.some(c=>c.s===n.setor&&c.v===n.servico&&c.i===n.item&&c.f&&c.at>=n.aberta_em-60000&&c.fase!=='depois');
function passFilter(s){if(!filt)return true;const I=info(s);
  if(filt==='nc')return I.nc>0;if(filt==='ncv')return ncList().some(n=>n.setor===s.id&&ncLate(n));
  if(filt==='pend'){const v=svcsOf(s).find(v=>v.id===mode);return !!v&&['','P','NC'].includes(svcStat(s,v).st)}
  return I.sit===filt}

// ---------- desenho ----------
function renderKpis(){
  let lib=0,rc=0,t=0,ok=0;for(const s of SECTORS){const i=info(s);if(i.sit==='lib'||i.sit==='rec')lib++;if(i.sit==='rec')rc++;t+=i.t;ok+=i.c+i.na}
  const ab=ncList().filter(n=>n.status==='Aberta'),late=ab.filter(ncLate).length;
  $('kpis').innerHTML=[[`${lib} de ${SECTORS.length}`,`ambientes liberados${rc?` · ${rc} recebidos`:''}`,'ok'],[Math.round(ok/t*100)+'%','dos itens liberados (C + NA)',''],[ab.length,`NCs abertas${late?` · ${late} vencidas`:''}`,ab.length?'bad':''],[t-ok,'itens pendentes ou em NC','pd']]
    .map(([b,s,c])=>`<div class="kpi ${c}"><b>${b}</b><span>${s}</span></div>`).join('')}
function renderBar(){
  $('tabs').innerHTML=VIEWS.map(v=>`<button data-v="${v.id}" aria-pressed="${v.id===view}">${esc(v.n)}</button>`).join('');
  $('mode').innerHTML=`<option value="geral">Situação geral</option>`+SVC.map(v=>`<option value="${v.id}">${ixOf(v)}. ${esc(v.n)}</option>`).join('');$('mode').value=mode;
  const fo=[['','Todos os ambientes'],['nc','Com NC aberta'],['ncv','Com NC vencida'],...(mode!=='geral'?[['pend','Pendentes em '+svcName(mode)]]:[]),['ini','Não iniciados'],['and','Em andamento'],['lib','Liberados (sem recebimento)'],['rec','Recebidos']];
  if(filt==='pend'&&mode==='geral')filt='';
  $('filt').innerHTML=fo.map(([k,n])=>`<option value="${k}" ${k===filt?'selected':''}>${esc(n)}</option>`).join('');
  $('vMapa').setAttribute('aria-pressed',tab==='mapa');$('vPainel').setAttribute('aria-pressed',tab==='painel');
  $('bLote').hidden=!canWrite}
function renderLegend(){
  $('legend').innerHTML='<div class="legend">'+(mode==='geral'?Object.values(SIT).map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join(''):
   ['C','NC','NA','P',''].map(k=>`<span><i style="background:${COL[k]}"></i>${STN[k]}</span>`).join(''))+'</div>'}
function renderMap(){
  const V=VIEWS.find(v=>v.id===view);if(!vb)vb=[...V.b];
  $('map').setAttribute('viewBox',vb.join(' '));
  $('map').innerHTML=`<image href="${V.img}" x="${V.b[0]}" y="${V.b[1]}" width="${V.b[2]}" height="${V.b[3]}" preserveAspectRatio="none"/>`+
   SECTORS.filter(s=>s.v===view).map(s=>{const c=colorOf(s),cls='sec'+(s.id===sel?' sel':'')+(passFilter(s)?'':' dim');const tt=`<title>${esc(s.n)} — ${SIT[info(s).sit][0]}</title>`;
    return s.p?`<polygon class="${cls}" data-id="${s.id}" points="${s.p}" fill="${c}" stroke="${c==='transparent'?'#999':c}">${tt}</polygon>`:
    `<circle class="${cls} pin" data-id="${s.id}" cx="${s.x}" cy="${s.y}" r="11" fill="${c==='transparent'?'#bbb':c}" style="fill-opacity:.9">${tt}</circle>`}).join('')}
function renderLeft(){
  const all=ncList(),ab=all.filter(n=>n.status==='Aberta'),late=ab.filter(ncLate),res=all.filter(n=>n.status==='Resolvida');
  const L={ab,late,res}[ncTab].sort((a,b)=>ncTab==='res'?b.resolvida_em-a.resolvida_em:(a.prazo||'9')<(b.prazo||'9')?-1:(a.prazo||'9')>(b.prazo||'9')?1:b.aberta_em-a.aberta_em);
  $('nccard').innerHTML=`<h2>Não conformidades <span class="count ${ab.length?'bad':''}">${ab.length} abertas</span></h2>
   <div class="ncf" role="group" aria-label="Filtrar NCs">${[['ab','Abertas',ab.length],['late','Vencidas',late.length],['res','Resolvidas',res.length]].map(([k,n,c])=>`<button data-nct="${k}" aria-pressed="${ncTab===k}">${n} (${c})</button>`).join('')}</div>`+
   (L.length?`<ul class="ncl">${L.map(n=>{const s=byId[n.setor];
     return `<li><button data-nc="${esc(n.setor)}|${esc(n.servico)}|${esc(n.item)}" style="${n.status==='Resolvida'?'border-left-color:var(--c)':''}"><span class="nn">${ncNum(n)}</span>${n.status==='Aberta'&&!ncHasPhoto(n)?'<span class="tagw">sem foto</span>':''}<b>${esc(s.n)}</b>
      <span class="q">${esc(label(n.servico,n.item))}</span>${n.descricao?`<div class="o">${esc(n.descricao)}</div>`:''}
      <div class="meta">${n.responsavel?esc(n.responsavel)+' · ':''}${n.prazo?`prazo <span class="${ncLate(n)?'late':''}">${fmtD(n.prazo)}</span> · `:''}${n.status==='Resolvida'?'resolvida em '+fmt(n.resolvida_em):ncDays(n)+' dia(s) em aberto'}</div></button></li>`}).join('')}</ul>`
     :`<div class="empty-s">${ncTab==='ab'?'Nenhuma NC aberta. Quando um item for marcado NC ele aparece aqui até ser corrigido.':ncTab==='late'?'Nenhuma NC com prazo vencido.':'Nenhuma NC resolvida ainda.'}</div>`);
  const rows=SECTORS.filter(s=>s.v===view);const nlib=rows.filter(s=>['lib','rec'].includes(info(s).sit)).length;
  const wasOpen=$('setcard').open;
  $('setcard').innerHTML=`<summary>Ambientes desta planta <span class="count" title="liberados">${nlib}/${rows.length}</span></summary>
   <ul class="setl">${rows.filter(passFilter).map(s=>{const i=info(s);return `<li><button data-id="${s.id}" aria-current="${s.id===sel}"><span class="dot" style="background:${SIT[i.sit][1]}"></span>
    <span class="nm">${esc(s.n)}${i.nc?` <span class="count bad">${i.nc} NC</span>`:''}</span><span class="pc">${i.sit==='rec'?'Recebido':i.pct+'%'}</span>${bar(i,'mini')}</button></li>`}).join('')}</ul>`;
  $('setcard').open=wasOpen}
const camSvg='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9Zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>';
function thumb(c,cls){return c?`<button class="th ${cls||''}" data-lb="${esc(c.id)}" aria-label="Abrir foto"><img src="${esc(photoUrl(c.f))}" alt="" loading="lazy"></button>`:''}
function itemHtml(s,v,it,k){const r=rec(s.id,v.id,it.id),dis=canWrite?'':'disabled';
  const ph=photosOf(s.id).filter(c=>c.v===v.id&&c.i===it.id),nc=ncOpen(s.id,v.id,it.id);
  const resolved=ncList().filter(n=>n.setor===s.id&&n.servico===v.id&&n.item===it.id&&n.status==='Resolvida');
  const ant=ph.find(c=>c.fase==='antes'),dep=ph.find(c=>c.fase==='depois');
  return `<div class="it${r.st==='NC'?' isnc':''}" id="it-${v.id}-${it.id}" data-v="${v.id}" data-i="${it.id}"><div class="row">
   <div class="nm"><em>${ixOf(v)}.${k+1}</em>${esc(it.n)}<small>${esc(it.c)}</small><small><b>Como verificar:</b> ${esc(it.m)}</small></div>
   <div class="ctl">${canWrite?`<button class="cam" data-cam="${v.id}|${it.id}" aria-label="Tirar foto: ${esc(it.n)}" title="Tirar foto deste item">${camSvg}</button>`:''}
   <div class="seg" role="group" aria-label="Resultado ${esc(it.n)}">${['C','NC','NA'].map(x=>`<button data-st="${x}" ${r.st===x?`data-on="${x}"`:''} aria-pressed="${r.st===x}" ${dis}>${x}</button>`).join('')}</div></div></div>
   <input type="text" data-obs placeholder="Observação${r.st==='NC'?' — descreva a não conformidade':''}" value="${esc(r.obs||'')}" ${dis} aria-label="Observação: ${esc(it.n)}">
   ${nc?`<div class="ncbox"><div class="hd">${ncNum(nc)} · aberta há ${ncDays(nc)} dia(s)${ncLate(nc)?' · <span class="late">PRAZO VENCIDO</span>':''}</div>
     <label>Ação exigida<input type="text" data-nc="acao" data-id="${nc.id}" value="${esc(nc.acao)}" placeholder="O que a empreiteira deve fazer" ${dis}></label>
     <div class="two"><label>Responsável<input type="text" data-nc="responsavel" data-id="${nc.id}" value="${esc(nc.responsavel)}" ${dis}></label><label>Prazo<input type="date" data-nc="prazo" data-id="${nc.id}" value="${esc(nc.prazo||'')}" ${dis}></label></div></div>
     ${!ncHasPhoto(nc)&&canWrite?`<div class="warn">Falta a foto da NC. <button class="btn" data-cam="${v.id}|${it.id}|antes">Tirar foto</button></div>`:''}`:''}
   ${ant||dep?`<div class="ad"><figure><figcaption>Antes (NC)</figcaption>${ant?thumb(ant):'<div class="none">sem foto</div>'}</figure><figure><figcaption>Depois (correção)</figcaption>${dep?thumb(dep):`<div class="none">${canWrite&&!nc?`<button class="lnk" data-cam="${v.id}|${it.id}|depois">tirar foto</button>`:'aguardando'}</div>`}</figure></div>`:''}
   ${r.at||ph.length||resolved.length?`<div class="who">${r.at&&r.st?`${esc(r.st)} · ${esc(r.by||'')} ${fmt(r.at)}`:''}${ph.length?` <button class="lnk" data-pf="${v.id}|${it.id}">${ph.length} foto${ph.length>1?'s':''}</button>`:''}${resolved.length?` · ${resolved.length} NC resolvida${resolved.length>1?'s':''}`:''}</div>`:''}</div>`}
function pfMatch(c){if(!pf)return true;if(pf==='geral')return !c.v;if(pf==='nc')return !!c.fase;const[v,i]=pf.split('|');return c.v===v&&(!i||c.i===i)}
function renderSide(){
  const el=$('side');
  if(!sel){el.innerHTML=`<div class="empty"><h2>Selecione um ambiente no mapa</h2><p>Toque em um ambiente colorido (ou na bolinha, nos ambientes pequenos). Cada serviço abre a lista de itens a verificar, na ordem de execução, para marcar <b>C</b> (conforme), <b>NC</b> (não conforme) ou <b>NA</b> (não se aplica), anotar e fotografar.</p><p>Arraste para mover a planta; use a roda do mouse, o gesto de pinça ou os botões + e − para aproximar.</p></div>`;return}
  const s=byId[sel],I=info(s),[sn,sc]=SIT[I.sit],dis=canWrite?'':'disabled',R=REC[s.id];
  const all=CMS.filter(c=>c.s===s.id).sort((a,b)=>b.at-a.at),photos=photosOf(s.id);
  const shown=photos.filter(pfMatch),lim=pAll?shown.length:8;
  const og=svcsOf(s).map(v=>{const pv=photos.filter(c=>c.v===v.id);if(!pv.length)return '';
     const its=v.itens.map(it=>[it,pv.filter(c=>c.i===it.id).length]).filter(x=>x[1]);
     return `<optgroup label="${ixOf(v)}. ${esc(v.n)}"><option value="${v.id}" ${pf===v.id?'selected':''}>${esc(v.n)} — todas (${pv.length})</option>${its.map(([it,n])=>`<option value="${v.id}|${it.id}" ${pf===v.id+'|'+it.id?'selected':''}>${code(v.id,it.id)} ${esc(it.n)} (${n})</option>`).join('')}</optgroup>`}).join('');
  const ng=photos.filter(c=>!c.v).length,nn=photos.filter(c=>c.fase).length;
  const gal=photos.length?`<div class="gal-f"><label class="meta" for="pf">Mostrar</label><select id="pf"><option value="">Todas as fotos do ambiente (${photos.length})</option>${nn?`<option value="nc" ${pf==='nc'?'selected':''}>Só NC — antes e depois (${nn})</option>`:''}${ng?`<option value="geral" ${pf==='geral'?'selected':''}>Ambiente em geral (${ng})</option>`:''}${og}</select></div>
   <div class="gal">${shown.slice(0,lim).map(c=>`<button class="th" data-lb="${esc(c.id)}" aria-label="Abrir foto: ${esc(label(c.v,c.i))}"><img src="${esc(photoUrl(c.f))}" alt="" loading="lazy">${c.v?`<span>${c.fase?(c.fase==='antes'?'NC · ':'Correção · '):''}${esc(code(c.v,c.i)+' '+(c.i&&itemOf(c.v,c.i)?itemOf(c.v,c.i).n:svcName(c.v)))}</span>`:''}</button>`).join('')}</div>
   ${shown.length>lim?`<button class="btn" id="pall">Ver todas (${shown.length})</button>`:''}`
   :`<p class="meta">Nenhuma foto ainda. Use o botão de câmera de cada item ou "Adicionar fotos" nos comentários.</p>`;
  const svcHtml=svcsOf(s).map(v=>{const x=svcStat(s,v),isO=open.has(v.id);let lastEt='',body='';
    if(isO){body=`<div class="items">${canWrite&&x.p?`<div class="svcact"><button class="lnk" data-allna="${v.id}">Não se aplica a este ambiente (marcar pendentes como NA)</button></div>`:''}`+
      v.itens.map((it,k)=>{const h=it.et!==lastEt?`<div class="et">${esc(it.et)}</div>`:'';lastEt=it.et;return h+itemHtml(s,v,it,k)}).join('')+'</div>'}
    return `<div class="svc"><button class="sh" data-tog="${v.id}" aria-expanded="${isO}"><span class="ix">${ixOf(v)}</span>
     <span class="nm">${esc(v.n)}<small>${x.c+x.na} de ${x.t} itens liberados${x.nc?` · ${x.nc} NC`:''}</small></span>
     <span class="stb" style="background:${COL[x.st]}">${STN[x.st]}</span><span class="chev" aria-hidden="true"></span>${bar(x,'mini')}</button>${body}</div>`}).join('');
  const opts=svcsOf(s).map(v=>`<optgroup label="${ixOf(v)}. ${esc(v.n)}"><option value="${v.id}|" ${draft.v===v.id&&!draft.i?'selected':''}>${esc(v.n)} — geral</option>${v.itens.map((it,k)=>`<option value="${v.id}|${it.id}" ${draft.v===v.id&&draft.i===it.id?'selected':''}>${ixOf(v)}.${k+1} ${esc(it.n)}</option>`).join('')}</optgroup>`).join('');
  const feed=all.filter(c=>c.k!=='status'),hist=all.filter(c=>c.k==='status');
  el.innerHTML=`<div class="head"><div class="meta">${esc(viewName(s.v))} · ${String(s.a).replace('.',',')} m²</div><h2>${esc(s.n)}</h2>
   <span class="pill" style="background:${sc}">${sn}</span>
   <div class="etapa">Etapa atual: <b>${I.et?`${esc(I.et.n)}${I.eti?' › '+esc(I.eti.et)+': '+esc(I.eti.n):''}`:'Todos os serviços liberados'}</b></div>
   ${bar(I,'prog')}<div class="counts"><span>${I.c} C</span><span>${I.nc} NC</span><span>${I.na} NA</span><span>${I.p} pendentes</span><span>${I.pct}% liberado</span></div>
   ${R?`<div class="recb"><b>Recebido em ${fmtD(R.data)}</b><br>Fiscal: ${esc(R.fiscal_nome)} · Empreiteira: ${esc(R.emp_nome)}${R.obs?`<br>${esc(R.obs)}`:''}<br><button class="lnk" data-rep="fvs1">Ver termo / FVS</button>${canWrite?` · <button class="lnk" id="recdel">Desfazer recebimento</button>`:''}</div>`
     :I.sit==='lib'&&canWrite?`<div class="recb">Todos os itens liberados. <button class="btn pri" id="recnew">Registrar recebimento</button></div>`:''}
   <div style="margin-top:8px"><button class="lnk" data-rep="fvs1">Gerar FVS deste ambiente (PDF)</button></div></div>
   <h3 id="fotos">Fotos (${photos.length})</h3><div class="pics">${gal}</div>
   <h3>Serviços (na ordem de execução) — toque para ver os itens</h3><div class="svcs">${svcHtml}</div>
   <h3>Comentários</h3><div class="cm">
   <label class="meta" for="csvc">Sobre</label><select id="csvc"><option value="|">O ambiente todo</option>${opts}</select>
   ${cmOpen||draft.t?`<textarea id="ctx" placeholder="Escreva um comentário…" aria-label="Comentário" ${dis}>${esc(draft.t)}</textarea>`:''}
   <div class="act">${canWrite?`${cmOpen||draft.t?'':'<button class="btn" id="cmopen">Escrever comentário</button>'}<button class="btn" id="addf">Adicionar fotos</button>`:''}<span class="sp"></span>${cmOpen||draft.t?`<button class="btn pri" id="send" ${dis}>Enviar</button>`:''}</div>
   <ul class="feed">${feed.map(c=>`<li><div class="t">${c.v?`<span class="tag">${esc(label(c.v,c.i))}</span>`:''}${c.fase?`<span class="tag">${c.fase==='antes'?'NC':'Correção'}</span>`:''}${esc(c.by||'')} · ${fmt(c.at)}</div>
     ${c.t?`<div>${esc(c.t)}</div>`:''}${c.f&&photoUrl(c.f)?thumb(c,'sm'):''}</li>`).join('')||'<li class="meta">Nenhum comentário ainda.</li>'}</ul>
   ${hist.length?`<details class="hist"><summary>Histórico de liberações (${hist.length})</summary><ul class="feed">${hist.map(c=>`<li><div class="t">${c.v?`<span class="tag">${esc(label(c.v,c.i))}</span>`:''}${esc(c.by||'')} · ${fmt(c.at)}</div><div>Marcou <b style="color:${COL[c.st]||'var(--mute)'}">${esc(c.st||'pendente')}</b>${c.t?' — '+esc(c.t):''}</div></li>`).join('')}</ul></details>`:''}</div>`}
function renderAll(){renderKpis();renderBar();if(tab==='mapa'){renderMap();renderLeft();renderSide();renderLegend()}else renderPainel()}
function banner(t){$('banner').textContent=t||'';$('banner').classList.toggle('on',!!t)}

// =====================================================================
//  Banco (Supabase) + fila sem internet
// =====================================================================
const C=window.SUPABASE_CONFIG;const sb=window.supabase.createClient(C.url,C.anonKey);
function photoUrl(f){if(!f)return'';if(localImg[f])return localImg[f];const u=sb.storage.from('fotos').getPublicUrl(f).data.publicUrl;return /^https:\/\//.test(u)?u:''}
// IndexedDB mínimo
const idb=new Promise(res=>{try{const r=indexedDB.open('mapaobra',1);r.onupgradeneeded=()=>{r.result.createObjectStore('outbox',{keyPath:'k',autoIncrement:true});r.result.createObjectStore('kv')};r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch(e){res(null)}});
async function tx(store,mode,fn){const d=await idb;if(!d)return null;return new Promise((res,rej)=>{const t=d.transaction(store,mode);const s=t.objectStore(store);const r=fn(s);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})}
const obAll=()=>tx('outbox','readonly',s=>s.getAll());
const obAdd=op=>tx('outbox','readwrite',s=>s.add(op));
const obDel=k=>tx('outbox','readwrite',s=>s.delete(k));
const kvSet=(k,v)=>tx('kv','readwrite',s=>s.put(v,k));
const kvGet=k=>tx('kv','readonly',s=>s.get(k));
const isNet=e=>!navigator.onLine||!e||/fetch|network|load failed|timeout/i.test(e.message||String(e))||e.status===0;
async function exec(op){let r;
  if(op.t==='upsert')r=await sb.from(op.tb).upsert(op.rows,op.ign?{ignoreDuplicates:true}:{});
  else if(op.t==='update')r=await sb.from(op.tb).update(op.patch).eq(op.col||'id',op.id);
  else if(op.t==='delete')r=await sb.from(op.tb).delete().eq(op.col||'id',op.id);
  else if(op.t==='photo'){r=await sb.storage.from('fotos').upload(op.path,op.blob,{contentType:'image/jpeg',upsert:true});if(r.error&&!/exists/i.test(r.error.message))throw r.error;r=await sb.from('comentarios').upsert([op.row],{ignoreDuplicates:true})}
  else if(op.t==='rmfile')r=await sb.storage.from('fotos').remove([op.path]);
  if(r&&r.error)throw r.error}
let pendingN=0,flushing=false,loaded=false;
async function obCount(){const a=await obAll();pendingN=a?a.length:0;const b=$('obx');b.hidden=!pendingN;b.textContent=`${pendingN} envio${pendingN>1?'s':''} pendente${pendingN>1?'s':''}`;b.title='Será enviado quando a internet voltar'}
async function send(op){
  const q=await obAll();
  if(!(q&&q.length)){try{await exec(op);return}catch(e){if(!isNet(e)){fail(e);return}}}
  await obAdd(op);await obCount();banner('Sem internet: as alterações ficam guardadas neste aparelho e serão enviadas automaticamente.')}
async function flush(){if(flushing||!navigator.onLine)return;flushing=true;
  try{const q=await obAll()||[];for(const op of q){try{await exec(op);await obDel(op.k)}catch(e){if(isNet(e))break;console.error(e);await obDel(op.k)}}}
  finally{flushing=false;await obCount();if(!pendingN&&/Sem internet/.test($('banner').textContent))banner('')}}
addEventListener('online',()=>{flush();load()});setInterval(flush,30000);
function fail(e){console.error(e);
  if(e&&(e.code==='42501'||/row-level security|permission/i.test(e.message||''))){canWrite=false;banner('Você não tem permissão para alterar este mapa. Peça acesso ao responsável.');renderAll();return}
  banner('Não foi possível salvar: '+(e&&e.message||'erro desconhecido'))}
// leitura
const fromRow=r=>({s:r.setor,v:r.servico,i:r.item,st:r.st,obs:r.obs||'',by:r.por,at:+r.em});
const cRow=r=>({id:r.id,s:r.setor,v:r.servico,i:r.item,k:r.tipo,st:r.st,t:r.texto||'',f:r.foto,fase:r.fase,by:r.por,at:+r.em});
const nRow=r=>({...r,aberta_em:+r.aberta_em,resolvida_em:r.resolvida_em?+r.resolvida_em:null,em:+r.em});
async function load(){
  try{const recCols=canWrite?'*':'setor,fiscal_nome,emp_nome,data,obs,por,em';
    const [a,b,c,d]=await Promise.all([sb.from('liberacoes').select('*').not('item','is',null),sb.from('comentarios').select('*').order('em',{ascending:false}).limit(20000),sb.from('ncs').select('*'),sb.from('recebimentos').select(recCols)]);
    const er=a.error||b.error||c.error||d.error;if(er)throw er;
    const o={};for(const r of a.data)if(byId[r.setor])o[r.id]=fromRow(r);LIB=o;
    const local=CMS.filter(x=>localImg[x.f]);CMS=b.data.map(cRow).concat(local.filter(x=>!b.data.some(r=>r.id===x.id)));
    NCS=Object.fromEntries(c.data.map(r=>[r.id,nRow(r)]));REC=Object.fromEntries(d.data.map(r=>[r.setor,r]));
    loaded=true;renderAll();kvSet('snap',{LIB,CMS:CMS.filter(x=>!localImg[x.f]),NCS,REC:Object.fromEntries(Object.entries(REC).map(([k,v])=>[k,{...v,fiscal_assinatura:null,emp_assinatura:null}])),at:Date.now()});
    if(/Sem internet: mostrando/.test($('banner').textContent))banner('')}
  catch(e){console.error(e);const s=await kvGet('snap');
    if(s&&!Object.keys(LIB).length){LIB=s.LIB||{};CMS=s.CMS||[];NCS=s.NCS||{};REC=s.REC||{};renderAll()}
    banner(s?`Sem internet: mostrando os dados salvos em ${fmt(s.at)}. O que você marcar será enviado quando a conexão voltar.`:'Não foi possível carregar os dados da obra.')}}
function realtime(){
  sb.channel('obra').on('postgres_changes',{event:'*',schema:'public',table:'liberacoes'},p=>{
      if(p.eventType==='DELETE')delete LIB[p.old.id];else if(p.new.item&&byId[p.new.setor])LIB[p.new.id]=fromRow(p.new);renderAll()})
    .on('postgres_changes',{event:'*',schema:'public',table:'comentarios'},p=>{
      const id=(p.new&&p.new.id)||(p.old&&p.old.id);CMS=CMS.filter(c=>c.id!==id);
      if(p.eventType!=='DELETE'&&byId[p.new.setor])CMS.push(cRow(p.new));tab==='mapa'?(renderSide(),renderLeft()):0})
    .on('postgres_changes',{event:'*',schema:'public',table:'ncs'},p=>{
      if(p.eventType==='DELETE')delete NCS[p.old.id];else NCS[p.new.id]=nRow(p.new);renderAll()})
    .subscribe()}

// =====================================================================
//  Escrita
// =====================================================================
function setStatus(sid,vid,iid,st){
  const k=key(sid,vid,iid),cur=LIB[k]||{};const nst=cur.st===st?null:st,now=Date.now();
  const doc={s:sid,v:vid,i:iid,st:nst,obs:cur.obs||'',by:ME,at:now};LIB[k]=doc;
  send({t:'upsert',tb:'liberacoes',rows:[{id:k,setor:sid,servico:vid,item:iid,st:nst,obs:doc.obs,por:ME,em:now}]});
  const cm={id:uuid(),setor:sid,servico:vid,item:iid,tipo:'status',st:nst,texto:doc.obs,por:ME,em:now};CMS.push(cRow(cm));
  send({t:'upsert',tb:'comentarios',rows:[cm],ign:true});
  const nc=ncOpen(sid,vid,iid);let ask=null;
  if(nst==='NC'&&!nc){const n={id:uuid(),setor:sid,servico:vid,item:iid,descricao:doc.obs,acao:'',responsavel:'',prazo:null,status:'Aberta',aberta_em:now,resolvida_em:null,reverificacao:null,por:ME,em:now};
    NCS[n.id]=n;send({t:'upsert',tb:'ncs',rows:[n]});ask='antes'}
  else if(nc&&(nst==='C'||nst==='NA')){const patch={status:'Resolvida',resolvida_em:now,reverificacao:today(),em:now};Object.assign(nc,patch);send({t:'update',tb:'ncs',id:nc.id,patch});if(nst==='C')ask='depois'}
  else if(nc&&!nst){delete NCS[nc.id];send({t:'delete',tb:'ncs',id:nc.id})}
  renderAll();return ask}
function allNA(sid,vid){const v=svcById[vid],now=Date.now();
  const its=v.itens.filter(it=>!rec(sid,vid,it.id).st);if(!its.length)return;
  const rows=its.map(it=>{const k=key(sid,vid,it.id);LIB[k]={s:sid,v:vid,i:it.id,st:'NA',obs:'Não se aplica a este ambiente',by:ME,at:now};return{id:k,setor:sid,servico:vid,item:it.id,st:'NA',obs:'Não se aplica a este ambiente',por:ME,em:now}});
  send({t:'upsert',tb:'liberacoes',rows});
  const cm={id:uuid(),setor:sid,servico:vid,item:null,tipo:'status',st:'NA',texto:`Serviço não se aplica a este ambiente (${rows.length} itens)`,por:ME,em:now};CMS.push(cRow(cm));
  send({t:'upsert',tb:'comentarios',rows:[cm],ign:true});renderAll()}
function setObs(sid,vid,iid,obs){
  const k=key(sid,vid,iid),cur=LIB[k]||{};if((cur.obs||'')===obs)return;const now=Date.now();
  LIB[k]={s:sid,v:vid,i:iid,st:cur.st||null,obs,by:ME,at:now};
  send({t:'upsert',tb:'liberacoes',rows:[{id:k,setor:sid,servico:vid,item:iid,st:cur.st||null,obs,por:ME,em:now}]});
  const nc=ncOpen(sid,vid,iid);if(nc){nc.descricao=obs;send({t:'update',tb:'ncs',id:nc.id,patch:{descricao:obs,em:now}})}
  renderLeft()}
function setNC(id,field,val){const n=NCS[id];if(!n||(n[field]||'')===val)return;n[field]=val||(field==='prazo'?null:'');
  send({t:'update',tb:'ncs',id,patch:{[field]:n[field],em:Date.now()}});renderLeft();renderKpis()}
function sendComment(){const t=($('ctx')?.value||'').trim();if(!t)return;
  const cm={id:uuid(),setor:sel,servico:draft.v||null,item:draft.i||null,tipo:'nota',texto:t,por:ME,em:Date.now()};CMS.push(cRow(cm));
  send({t:'upsert',tb:'comentarios',rows:[cm],ign:true});draft.t='';cmOpen=false;renderSide()}
function sendPhoto(blob,ctx,note){
  const d=new Date(),ymd=d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());
  const path=`${ctx.s}/${ctx.v||'geral'}${ctx.i?'-'+ctx.i:''}_${ymd}_${Date.now()}${ctx.fase?'_'+ctx.fase:''}.jpg`;
  localImg[path]=URL.createObjectURL(blob);
  const row={id:uuid(),setor:ctx.s,servico:ctx.v||null,item:ctx.i||null,tipo:'nota',texto:note||'',foto:path,fase:ctx.fase||null,por:ME,em:Date.now()};
  CMS.push(cRow(row));send({t:'photo',path,blob,row});renderSide();renderLeft()}
async function delPhoto(c){CMS=CMS.filter(x=>x!==c);
  if(c.t){CMS.push({...c,f:null});send({t:'update',tb:'comentarios',id:c.id,patch:{foto:null}})}else send({t:'delete',tb:'comentarios',id:c.id});
  send({t:'rmfile',path:c.f})}

// =====================================================================
//  Editor de foto: marcação + carimbo
// =====================================================================
let ED=null;
const fileIn=$('file'),camIn=$('cam');let capCtx=null;
function capture(ctx,useCam){if(!canWrite)return;capCtx=ctx;(useCam?camIn:fileIn).click()}
async function onFiles(e){const fs=[...e.target.files];e.target.value='';if(!fs.length||!capCtx)return;openEditor(fs,capCtx)}
fileIn.addEventListener('change',onFiles);camIn.addEventListener('change',onFiles);
async function openEditor(files,ctx){ED={files,k:0,ctx,shapes:[],tool:'circ',img:null};$('ed').hidden=false;$('edall').hidden=files.length<2;await edLoad()}
async function edLoad(){const f=ED.files[ED.k];ED.shapes=[];ED.img=null;$('edok').disabled=true;$('ednote').value='';
  const s=byId[ED.ctx.s];$('edt').textContent=`${ED.files.length>1?`Foto ${ED.k+1} de ${ED.files.length} · `:''}${s?s.n:''} · ${label(ED.ctx.v,ED.ctx.i)}${ED.ctx.fase?(ED.ctx.fase==='antes'?' · foto da NC':' · foto da correção'):''}`;
  try{ED.img=await createImageBitmap(f,{imageOrientation:'from-image'})}catch(e){const u=URL.createObjectURL(f);ED.img=await new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=j;i.src=u})}
  const k=Math.min(1,1920/Math.max(ED.img.width,ED.img.height));const cv=$('edcv');cv.width=Math.round(ED.img.width*k);cv.height=Math.round(ED.img.height*k);edFit();edDraw();$('edok').disabled=false}
function edFit(){if(!ED||!ED.img)return;const c=$('edc').getBoundingClientRect(),cv=$('edcv');const k=Math.min(c.width/cv.width,c.height/cv.height);cv.style.width=Math.floor(cv.width*k)+'px';cv.style.height=Math.floor(cv.height*k)+'px'}
addEventListener('resize',edFit);
function drawShapes(g,shapes,W){g.lineCap='round';g.lineJoin='round';
  for(const sh of shapes){g.strokeStyle='#ff1744';g.lineWidth=Math.max(4,W*.006);g.beginPath();
    if(sh.t==='circ'){const cx=(sh.a[0]+sh.b[0])/2,cy=(sh.a[1]+sh.b[1])/2,rx=Math.abs(sh.b[0]-sh.a[0])/2,ry=Math.abs(sh.b[1]-sh.a[1])/2;g.ellipse(cx,cy,Math.max(rx,2),Math.max(ry,2),0,0,Math.PI*2);g.stroke()}
    else if(sh.t==='seta'){const[x1,y1]=sh.a,[x2,y2]=sh.b,an=Math.atan2(y2-y1,x2-x1),h=Math.max(18,W*.025);g.moveTo(x1,y1);g.lineTo(x2,y2);g.moveTo(x2,y2);g.lineTo(x2-h*Math.cos(an-.45),y2-h*Math.sin(an-.45));g.moveTo(x2,y2);g.lineTo(x2-h*Math.cos(an+.45),y2-h*Math.sin(an+.45));g.stroke()}
    else{sh.p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()}}}
function edDraw(){if(!ED||!ED.img)return;const cv=$('edcv'),g=cv.getContext('2d');g.drawImage(ED.img,0,0,cv.width,cv.height);drawShapes(g,ED.shapes,cv.width)}
function edPt(e){const cv=$('edcv'),r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]}
{const cv=$('edcv');let cur=null;
 cv.addEventListener('pointerdown',e=>{if(!ED||!ED.img)return;cv.setPointerCapture(e.pointerId);const p=edPt(e);cur=ED.tool==='livre'?{t:'livre',p:[p]}:{t:ED.tool,a:p,b:p};ED.shapes.push(cur);edDraw()});
 cv.addEventListener('pointermove',e=>{if(!cur)return;const p=edPt(e);if(cur.t==='livre')cur.p.push(p);else cur.b=p;edDraw()});
 const end=()=>{if(cur&&cur.t!=='livre'&&Math.hypot(cur.b[0]-cur.a[0],cur.b[1]-cur.a[1])<8)ED.shapes.pop();cur=null;ED&&edDraw()};
 cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end)}
document.querySelectorAll('#ed [data-tool]').forEach(b=>b.onclick=()=>{ED.tool=b.dataset.tool;document.querySelectorAll('#ed [data-tool]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
$('edundo').onclick=()=>{ED.shapes.pop();edDraw()};
$('edcancel').onclick=()=>{$('ed').hidden=true;ED=null};
function stamp(cv,ctx,note){const g=cv.getContext('2d'),W=cv.width,H=cv.height,fs=Math.max(15,Math.round(W*.016)),lh=fs*1.3;
  const s=byId[ctx.s],d=new Date();
  const lines=[`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())} · ${ME||''}`,`${s?s.n:''} — ${s?viewName(s.v):''}`,
    `${label(ctx.v,ctx.i)}${ctx.fase?(ctx.fase==='antes'?' · NC (antes)':' · correção (depois)'):''}`,...(note?[note]:[])];
  const bh=lines.length*lh+fs*.8;g.fillStyle='rgba(0,0,0,.62)';g.fillRect(0,H-bh,W,bh);g.fillStyle='#fff';g.font=`600 ${fs}px Arial,sans-serif`;g.textBaseline='top';
  lines.forEach((l,i)=>{let t=l;while(g.measureText(t).width>W*.78&&t.length>4)t=t.slice(0,-2);if(t!==l)t+='…';g.fillText(t,fs*.6,H-bh+fs*.4+i*lh)});
  g.font=`${Math.round(fs*.8)}px Arial,sans-serif`;g.textAlign='right';g.fillText(O.tituloCurto||'Mapa da Obra',W-fs*.6,H-bh+fs*.4);g.textAlign='left'}
async function edFinish(withShapes){const cv=document.createElement('canvas'),src=$('edcv');cv.width=src.width;cv.height=src.height;const g=cv.getContext('2d');
  g.drawImage(ED.img,0,0,cv.width,cv.height);if(withShapes)drawShapes(g,ED.shapes,cv.width);const note=$('ednote').value.trim();stamp(cv,ED.ctx,note);
  const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.82));sendPhoto(blob,ED.ctx,note)}
$('edok').onclick=async()=>{if(!ED||!ED.img)return;$('edok').disabled=true;await edFinish(true);ED.k++;if(ED.k<ED.files.length)await edLoad();else{$('ed').hidden=true;ED=null}};
$('edall').onclick=async()=>{await edFinish(true);ED.k++;while(ED.k<ED.files.length){await edLoad();await edFinish(false);ED.k++}$('ed').hidden=true;ED=null};

// =====================================================================
//  Visualizador de foto
// =====================================================================
function showLB(){const c=LB.list[LB.i];if(!c){closeLB();return}$('lb').hidden=false;$('lbimg').src=photoUrl(c.f);
  $('lbcap').textContent=[label(c.v,c.i),c.fase?(c.fase==='antes'?'NC (antes)':'Correção (depois)'):'',c.t,c.by||'',fmt(c.at)].filter(Boolean).join(' · ');
  $('lbn').textContent=(LB.i+1)+' de '+LB.list.length;$('lbprev').disabled=LB.i<=0;$('lbnext').disabled=LB.i>=LB.list.length-1;$('lbopen').href=photoUrl(c.f);
  const d=$('lbdel');d.hidden=!canWrite;d.classList.remove('arm');d.textContent='Excluir foto';d.disabled=false;$('lbclose').focus()}
function closeLB(){$('lb').hidden=true;$('lbimg').src='';LB=null}
$('lbclose').onclick=closeLB;$('lbprev').onclick=()=>{LB.i--;showLB()};$('lbnext').onclick=()=>{LB.i++;showLB()};
$('lbdel').onclick=()=>{const d=$('lbdel');if(!d.classList.contains('arm')){d.classList.add('arm');d.textContent='Confirmar exclusão';return}
  const c=LB.list[LB.i];delPhoto(c);LB.list.splice(LB.i,1);if(LB.i>=LB.list.length)LB.i--;renderSide();LB.list.length?showLB():closeLB()};
$('lb').addEventListener('click',e=>{if(e.target.id==='lb')closeLB()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(LB)closeLB();else if(!$('dlg').hidden)closeDlg()}
  if(!LB)return;if(e.key==='ArrowLeft'&&LB.i>0){LB.i--;showLB()}if(e.key==='ArrowRight'&&LB.i<LB.list.length-1){LB.i++;showLB()}});

// =====================================================================
//  Diálogos: lote, recebimento, relatórios
// =====================================================================
function openDlg(title,body,foot){$('dbox').innerHTML=`<header><h2>${title}</h2><button class="btn" id="dx" aria-label="Fechar">✕</button></header><div class="dbody">${body}</div><div class="dfoot">${foot}</div>`;$('dlg').hidden=false;$('dx').onclick=closeDlg;const f=$('dbox').querySelector('input,select,button:not(#dx)');f&&f.focus()}
function closeDlg(){$('dlg').hidden=true;$('dbox').innerHTML=''}
$('dlg').addEventListener('click',e=>{if(e.target.id==='dlg')closeDlg()});
// --- lote ---
function openLote(){
  const vOpts=`<option value="*">Todas as plantas</option>`+VIEWS.map(v=>`<option value="${v.id}" ${v.id===view?'selected':''}>${esc(v.n)}</option>`).join('');
  openDlg('Liberar em lote',`<p class="meta" style="margin:0">Marque o mesmo resultado em vários ambientes de uma vez. Itens que estão em NC não são alterados (precisam ser verificados um a um).</p>
   <div class="ad" style="margin:0"><label>Planta<select id="lV">${vOpts}</select></label><label>Serviço<select id="lS">${SVC.map(v=>`<option value="${v.id}">${ixOf(v)}. ${esc(v.n)}</option>`).join('')}</select></label></div>
   <fieldset><legend>Itens <button class="lnk" data-all="lI">marcar todos</button> · <button class="lnk" data-none="lI">nenhum</button></legend><div class="chk" id="lI"></div></fieldset>
   <fieldset><legend>Ambientes <button class="lnk" data-all="lA">marcar todos</button> · <button class="lnk" data-none="lA">nenhum</button></legend><div class="chk" id="lA"></div></fieldset>
   <div class="ad" style="margin:0"><label>Resultado<select id="lR"><option value="C">C — Conforme</option><option value="NA">NA — Não se aplica</option></select></label><label>Observação (opcional)<input type="text" id="lO"></label></div>`,
   `<span class="meta" id="lsum" style="flex:1"></span><button class="btn" id="lc">Cancelar</button><button class="btn pri" id="lok">Aplicar</button>`);
  const fill=()=>{const vid=$('lS').value,vv=$('lV').value,v=svcById[vid];
    $('lI').innerHTML=v.itens.map((it,k)=>`<label><input type="checkbox" value="${it.id}"> ${ixOf(v)}.${k+1} ${esc(it.n)}</label>`).join('');
    $('lA').innerHTML=SECTORS.filter(s=>(vv==='*'||s.v===vv)&&svcsOf(s).includes(v)).map(s=>`<label><input type="checkbox" value="${s.id}"> ${esc(s.n)}${vv==='*'?` <span class="meta">(${esc(viewName(s.v))})</span>`:''}</label>`).join('')||'<span class="meta">Nenhum ambiente com este serviço.</span>';sum()};
  const sum=()=>{const n=[...$('lI').querySelectorAll(':checked')].length,a=[...$('lA').querySelectorAll(':checked')].length;$('lsum').textContent=`${n} item(ns) × ${a} ambiente(s)`};
  $('lV').onchange=fill;$('lS').onchange=fill;$('dbox').addEventListener('change',sum);
  $('dbox').addEventListener('click',e=>{const a=e.target.dataset.all||e.target.dataset.none;if(!a)return;$(a).querySelectorAll('input').forEach(x=>x.checked=!!e.target.dataset.all);sum()});
  $('lc').onclick=closeDlg;
  $('lok').onclick=()=>{const vid=$('lS').value,st=$('lR').value,obs=$('lO').value.trim(),its=[...$('lI').querySelectorAll(':checked')].map(x=>x.value),amb=[...$('lA').querySelectorAll(':checked')].map(x=>x.value);
    if(!its.length||!amb.length){$('lsum').textContent='Escolha ao menos um item e um ambiente.';return}
    const now=Date.now(),rows=[],cms=[];let skip=0;
    for(const sid of amb){let n=0;for(const iid of its){const k=key(sid,vid,iid);if(rec(sid,vid,iid).st==='NC'){skip++;continue}
      LIB[k]={s:sid,v:vid,i:iid,st,obs,by:ME,at:now};rows.push({id:k,setor:sid,servico:vid,item:iid,st,obs,por:ME,em:now});n++}
      if(n)cms.push({id:uuid(),setor:sid,servico:vid,item:null,tipo:'status',st,texto:`Liberação em lote: ${n} item(ns) de ${svcName(vid)}${obs?' — '+obs:''}`,por:ME,em:now})}
    for(let i=0;i<rows.length;i+=500)send({t:'upsert',tb:'liberacoes',rows:rows.slice(i,i+500)});
    if(cms.length){cms.forEach(c=>CMS.push(cRow(c)));send({t:'upsert',tb:'comentarios',rows:cms,ign:true})}
    closeDlg();renderAll();banner(`${rows.length} itens marcados como ${st}${skip?` · ${skip} em NC não foram alterados`:''}.`);setTimeout(()=>{if(/marcados como/.test($('banner').textContent))banner('')},6000)};
  fill()}
// --- recebimento ---
function sigPad(cv){const g=cv.getContext('2d');let dn=false,used=false;const fit=()=>{const r=cv.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;g.lineWidth=4;g.lineCap='round';g.strokeStyle='#0b1a33'};fit();
  const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*2,(e.clientY-r.top)*2]};
  cv.onpointerdown=e=>{dn=true;used=true;cv.setPointerCapture(e.pointerId);g.beginPath();g.moveTo(...pt(e))};cv.onpointermove=e=>{if(!dn)return;g.lineTo(...pt(e));g.stroke()};cv.onpointerup=cv.onpointercancel=()=>dn=false;
  return{clear(){g.clearRect(0,0,cv.width,cv.height);used=false},data(){if(!used)return null;const c=document.createElement('canvas');c.width=cv.width/2;c.height=cv.height/2;c.getContext('2d').drawImage(cv,0,0,c.width,c.height);return c.toDataURL('image/png')}}}
function openRec(){const s=byId[sel];
  openDlg('Registrar recebimento — '+esc(s.n),`<p class="meta" style="margin:0">Todos os itens deste ambiente estão liberados (C ou NA). O recebimento fica registrado com as assinaturas e entra na FVS.</p>
   <label>Data do recebimento<input type="date" id="rD" value="${today()}"></label>
   <fieldset><legend>Fiscal</legend><label>Nome<input type="text" id="rFn" value="${esc(ME)}"></label><canvas class="sig" id="rFs" aria-label="Assinatura do fiscal"></canvas><button class="lnk" id="rFc">limpar assinatura</button></fieldset>
   <fieldset><legend>Responsável da empreiteira</legend><label>Nome<input type="text" id="rEn"></label><canvas class="sig" id="rEs" aria-label="Assinatura da empreiteira"></canvas><button class="lnk" id="rEc">limpar assinatura</button></fieldset>
   <label>Observação (opcional)<input type="text" id="rO"></label>`,`<span class="meta" id="rmsg" style="flex:1"></span><button class="btn" id="rc">Cancelar</button><button class="btn pri" id="rok">Registrar recebimento</button>`);
  const pf=sigPad($('rFs')),pe=sigPad($('rEs'));$('rFc').onclick=()=>pf.clear();$('rEc').onclick=()=>pe.clear();$('rc').onclick=closeDlg;
  $('rok').onclick=()=>{const fn=$('rFn').value.trim(),en=$('rEn').value.trim(),fa=pf.data(),ea=pe.data();
    if(!fn||!en||!fa||!ea){$('rmsg').textContent='Preencha os dois nomes e as duas assinaturas.';return}
    const r={setor:s.id,fiscal_nome:fn,fiscal_assinatura:fa,emp_nome:en,emp_assinatura:ea,data:$('rD').value||today(),obs:$('rO').value.trim(),por:ME,em:Date.now()};
    REC[s.id]=r;send({t:'upsert',tb:'recebimentos',rows:[r]});
    const cm={id:uuid(),setor:s.id,servico:null,item:null,tipo:'nota',texto:`Ambiente recebido em ${fmtD(r.data)} — fiscal ${fn}, empreiteira ${en}`,por:ME,em:r.em};CMS.push(cRow(cm));send({t:'upsert',tb:'comentarios',rows:[cm],ign:true});
    closeDlg();renderAll()}}
// --- relatórios ---
function openRelDlg(pre){
  const sc=[...(sel?[['amb','Ambiente selecionado: '+byId[sel].n]]:[]),['planta','Planta: '+viewName(view)],['obra','Obra toda']];
  openDlg('Relatórios',`<label>Tipo<select id="xT"><option value="fvs" ${pre==='fvs1'?'selected':''}>FVS — ficha de verificação por ambiente</option><option value="fotos">Relatório fotográfico</option><option value="nc">Relatório de não conformidades</option></select></label>
   <label>Abrangência<select id="xA">${sc.map(([k,n])=>`<option value="${k}">${esc(n)}</option>`).join('')}</select></label>
   <div id="xOpt"></div>`,`<button class="btn" id="xc">Cancelar</button><button class="btn pri" id="xok">Gerar</button>`);
  const opt=()=>{const t=$('xT').value;$('xOpt').innerHTML=t==='fvs'?`<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="xF" checked> Incluir anexo de fotos</label>`
    :t==='fotos'?`<label>Fotos<select id="xQ"><option value="">Todas</option><option value="nc">Só NC (antes e depois)</option><option value="it">Só fotos de itens (sem gerais)</option></select></label><div class="ad" style="margin:0"><label>De<input type="date" id="xDe"></label><label>Até<input type="date" id="xAte"></label></div>`
    :`<label>Situação<select id="xS"><option value="">Todas</option><option value="Aberta">Só abertas</option><option value="late">Só vencidas</option><option value="Resolvida">Só resolvidas</option></select></label><label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="xF" checked> Incluir fotos antes/depois</label>`};
  $('xT').onchange=opt;opt();$('xc').onclick=closeDlg;
  $('xok').onclick=()=>{const t=$('xT').value,a=$('xA').value;const secs=a==='amb'?[byId[sel]]:a==='planta'?SECTORS.filter(s=>s.v===view):SECTORS;
    const o={fotos:$('xF')?.checked,q:$('xQ')?.value,de:$('xDe')?.value,ate:$('xAte')?.value,st:$('xS')?.value};closeDlg();
    if(t==='fvs')repFVS(secs,o);else if(t==='fotos')repFotos(secs,o);else repNC(secs,o)}}
function showRep(title,html,orient){$('rept').textContent=title;$('repbody').innerHTML=html;$('rep').hidden=false;
  let st=$('pgsz');if(!st){st=document.createElement('style');st.id='pgsz';document.head.appendChild(st)}st.textContent=`@page{size:A4 ${orient};margin:10mm}`;$('rep').scrollTop=0}
$('repclose').onclick=()=>{$('rep').hidden=true;$('repbody').innerHTML=''};$('repprint').onclick=()=>window.print();
const repHead=(t,extra)=>`<h1>${esc(t)}</h1><div class="hdr"><div><b>Obra</b>${esc(O.titulo)}</div><div><b>Documento</b>${esc((O.etiquetas||[]).join(' · '))}</div><div><b>Emitido em</b>${fmt(Date.now())}</div><div><b>Emitido por</b>${esc(ME||'—')}</div>${extra||''}</div>`;
const fvsNo=s=>'FVS-'+String(SECTORS.indexOf(s)+1).padStart(2,'0');
function repFVS(secs,o){
  const html=secs.map((s,si)=>{const I=info(s),R=REC[s.id],ph=photosOf(s.id);let c=0,nc=0,na=0,p=0;
    const rows=svcsOf(s).map(v=>`<tr class="sv"><td colspan="7">SERVIÇO ${ixOf(v)} — ${esc(v.n.toUpperCase())} — ${esc(s.n.toUpperCase())}</td></tr>`+v.itens.map((it,k)=>{const r=rec(s.id,v.id,it.id),st=r.st||'';
      if(st==='C')c++;else if(st==='NC')nc++;else if(st==='NA')na++;else p++;const nf=ph.filter(x=>x.v===v.id&&x.i===it.id).length;
      return `<tr><td>${ixOf(v)}.${k+1}</td><td>${esc(it.et)}</td><td><b>${esc(it.n)}</b></td><td>${esc(it.c)}</td><td>${esc(it.m)}</td><td class="r${st||'P'}">${st||'—'}</td><td>${esc(r.obs||'')}${nf?` <i>[${nf} foto${nf>1?'s':''}: F-${fvsNo(s).slice(4)}-${ixOf(v)}.${k+1}]</i>`:''}</td></tr>`}).join('')).join('');
    const opn=ncList().some(n=>n.setor===s.id&&n.status==='Aberta');const status=p?['EM AVALIAÇÃO','stE']:opn||nc?['BLOQUEADO','stB']:['LIBERADO','stL'];
    const anexo=o.fotos&&ph.length?`<div class="pg"></div><h1>${fvsNo(s)} — ANEXO FOTOGRÁFICO — ${esc(s.n.toUpperCase())}</h1><div class="ph three" style="margin-top:6px">${ph.map(x=>`<figure><img src="${esc(photoUrl(x.f))}" alt=""><figcaption><b>${x.v?'F-'+fvsNo(s).slice(4)+'-'+code(x.v,x.i):'Geral'}</b> ${esc(label(x.v,x.i))}${x.fase?` · ${x.fase==='antes'?'NC':'correção'}`:''}<br>${esc(x.t||'')} ${fmt(x.at)} · ${esc(x.by||'')}</figcaption></figure>`).join('')}</div>`:'';
    return `${si?'<div class="pg"></div>':''}${repHead(`${fvsNo(s)} — RECEBIMENTO DO ACABAMENTO FINAL — ${s.n.toUpperCase()}`,`<div><b>Local</b>${esc(s.n)} · ${esc(viewName(s.v))}</div><div><b>Área</b>${String(s.a).replace('.',',')} m²</div><div><b>Data da vistoria</b>${R?fmtD(R.data):'—'}</div><div><b>Situação</b>${SIT[I.sit][0]}</div>`)}
     <table><thead><tr><th style="width:4%">Item</th><th style="width:8%">Etapa</th><th style="width:16%">O que verificar</th><th style="width:27%">Critério de aceitação</th><th style="width:20%">Como verificar</th><th style="width:6%">Resultado</th><th>Observação</th></tr></thead><tbody>${rows}</tbody></table>
     <div class="foot"><div>Itens<b>${c+nc+na+p}</b></div><div>C<b>${c}</b></div><div>NC<b>${nc}</b></div><div>NA<b>${na}</b></div><div>Pendentes<b>${p}</b></div><div>Índice C/(C+NC)<b>${c+nc?Math.round(c/(c+nc)*100)+'%':'—'}</b></div><div class="${status[1]}">STATUS<b>${status[0]}</b></div></div>
     <div class="note">Só receber o serviço com STATUS = LIBERADO. Itens marcados NC permanecem registrados; a correção é registrada na NC correspondente.</div>
     <div class="sigs"><div>${R&&R.fiscal_assinatura?`<img src="${R.fiscal_assinatura}" alt="">`:''}Fiscal${R?': '+esc(R.fiscal_nome):''}</div><div>${R&&R.emp_assinatura?`<img src="${R.emp_assinatura}" alt="">`:''}Responsável da empreiteira${R?': '+esc(R.emp_nome):''}</div></div>${anexo}`}).join('');
  showRep(secs.length>1?`FVS — ${secs.length} ambientes`:fvsNo(secs[0])+' — '+secs[0].n,`<div class="paper">${html}</div>`,'landscape')}
function repFotos(secs,o){const de=o.de?new Date(o.de+'T00:00').getTime():0,ate=o.ate?new Date(o.ate+'T23:59:59').getTime():Infinity;
  const blocks=secs.map(s=>{let ph=photosOf(s.id).filter(x=>x.at>=de&&x.at<=ate).sort((a,b)=>a.at-b.at);if(o.q==='nc')ph=ph.filter(x=>x.fase);if(o.q==='it')ph=ph.filter(x=>x.v);
    if(!ph.length)return'';return `<h1 style="margin-top:10px">${esc(s.n)} — ${esc(viewName(s.v))}</h1><div class="ph" style="margin-top:6px">${ph.map(x=>`<figure><img src="${esc(photoUrl(x.f))}" alt=""><figcaption><b>${esc(label(x.v,x.i))}</b>${x.fase?` · ${x.fase==='antes'?'NC (antes)':'correção (depois)'}`:''}<br>${esc(x.t||'')}<br>${fmt(x.at)} · ${esc(x.by||'')}</figcaption></figure>`).join('')}</div>`}).filter(Boolean);
  showRep('Relatório fotográfico',`<div class="paper p">${repHead('RELATÓRIO FOTOGRÁFICO',`<div><b>Abrangência</b>${secs.length===1?esc(secs[0].n):secs.length+' ambientes'}</div><div><b>Período</b>${o.de?fmtD(o.de):'início'} a ${o.ate?fmtD(o.ate):'hoje'}</div><div><b>Filtro</b>${o.q==='nc'?'Só NC':o.q==='it'?'Só itens':'Todas'}</div><div><b>Ambientes com fotos</b>${blocks.length}</div>`)}${blocks.join('')||'<p>Nenhuma foto no período/filtro escolhido.</p>'}</div>`,'portrait')}
function repNC(secs,o){const ids=new Set(secs.map(s=>s.id));
  let L=ncList().filter(n=>ids.has(n.setor)).sort((a,b)=>a.aberta_em-b.aberta_em);
  if(o.st==='late')L=L.filter(ncLate);else if(o.st)L=L.filter(n=>n.status===o.st);
  const pic=n=>{const ph=photosOf(n.setor).filter(c=>c.v===n.servico&&c.i===n.item);const a=ph.find(c=>c.fase==='antes'&&c.at>=n.aberta_em-60000)||ph.find(c=>c.fase!=='depois'),d=ph.find(c=>c.fase==='depois');
    return o.fotos?`<td style="width:90px">${a?`<img src="${esc(photoUrl(a.f))}" style="width:85px">`:'—'}</td><td style="width:90px">${d?`<img src="${esc(photoUrl(d.f))}" style="width:85px">`:'—'}</td>`:''};
  const rows=L.map(n=>`<tr><td><b>${ncNum(n)}</b></td><td>${fmt(n.aberta_em)}</td><td>${esc(byId[n.setor].n)}<br><i>${esc(viewName(byId[n.setor].v))}</i></td><td>${esc(label(n.servico,n.item))}</td><td>${esc(n.descricao)}</td><td>${esc(n.acao)}</td><td>${esc(n.responsavel)}</td><td>${fmtD(n.prazo)}</td><td class="${n.status==='Resolvida'?'rC':'rNC'}">${n.status}${ncLate(n)?'<br>VENCIDA':''}</td><td>${fmtD(n.reverificacao)}</td><td style="text-align:center">${ncDays(n)}</td>${pic(n)}</tr>`).join('');
  showRep('Relatório de não conformidades',`<div class="paper">${repHead('RELATÓRIO DE NÃO CONFORMIDADES',`<div><b>Abrangência</b>${secs.length===1?esc(secs[0].n):secs.length+' ambientes'}</div><div><b>Abertas</b>${L.filter(n=>n.status==='Aberta').length}</div><div><b>Vencidas</b>${L.filter(ncLate).length}</div><div><b>Resolvidas</b>${L.filter(n=>n.status==='Resolvida').length}</div>`)}
   <table><thead><tr><th>Nº NC</th><th>Aberta em</th><th>Ambiente</th><th>Item</th><th>Descrição</th><th>Ação exigida</th><th>Responsável</th><th>Prazo</th><th>Status</th><th>Reverificação</th><th>Dias</th>${o.fotos?'<th>Antes</th><th>Depois</th>':''}</tr></thead><tbody>${rows||'<tr><td colspan="13">Nenhuma NC encontrada.</td></tr>'}</tbody></table></div>`,'landscape')}

// =====================================================================
//  Painel: evolução + quadro Serviço × Ambiente
// =====================================================================
function renderPainel(){
  const rows=SECTORS.filter(s=>s.v===view);
  $('painel').innerHTML=`<div class="pcard"><h2>Evolução da obra</h2><p class="meta">Itens liberados (C + NA) acumulados, pela data da última marcação de cada item.</p><div class="fig" id="evo"><svg></svg></div></div>
   <div class="pcard"><h2>Serviço × Ambiente — ${esc(viewName(view))}</h2><p class="meta">Percentual de itens liberados de cada serviço. Toque numa célula para abrir o ambiente no serviço. "—" = serviço não existe no ambiente.</p>
   <div class="mx"><table><thead><tr><th>Ambiente</th>${SVC.map(v=>`<th title="${esc(v.n)}">${ixOf(v)}<br>${esc(v.n.split(/[ (]/)[0])}</th>`).join('')}<th>Total</th></tr></thead><tbody>
   ${rows.map(s=>{const I=info(s);return `<tr><td><b>${esc(s.n)}</b>${REC[s.id]?' <span class="tag">recebido</span>':''}</td>${SVC.map(v=>{if(!svcsOf(s).includes(v))return '<td class="meta">—</td>';const x=svcStat(s,v);
     return `<td><button class="cell${x.st===''?' e':''}" data-cell="${s.id}|${v.id}" style="${x.st?`background:${COL[x.st]}`:''}" title="${esc(v.n)}: ${STN[x.st]}">${x.nc?x.nc+' NC':x.pct+'%'}</button></td>`}).join('')}<td><b>${I.pct}%</b></td></tr>`}).join('')}
   </tbody></table></div></div>`;
  drawEvo()}
function drawEvo(){const box=$('evo');if(!box)return;const s=box.querySelector('svg');
  const tot=SECTORS.reduce((a,x)=>a+info(x).t,0);const pts=Object.values(LIB).filter(r=>r.st==='C'||r.st==='NA').map(r=>r.at).sort((a,b)=>a-b);
  const draw=()=>{const W=s.clientWidth,H=s.clientHeight;if(!W)return;const pl=44,pr=14,pt=12,pb=26;
    if(!pts.length){s.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#5d6674" font-size="14">Ainda não há itens liberados.</text>`;return}
    const t0=pts[0]-864e5,t1=Math.max(Date.now(),pts[pts.length-1]);const X=t=>pl+(t-t0)/(t1-t0)*(W-pl-pr),Y=v=>pt+(1-v)*(H-pt-pb);
    let d=`M${X(t0)},${Y(0)}`;pts.forEach((t,i)=>{d+=` L${X(t)},${Y(i/tot)} L${X(t)},${Y((i+1)/tot)}`});d+=` L${X(t1)},${Y(pts.length/tot)}`;
    const gy=[0,.25,.5,.75,1].map(v=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3e6ea"/><text x="${pl-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#5d6674">${v*100}%</text>`).join('');
    const n=W<520?3:6,gx=[...Array(n+1)].map((_,i)=>{const t=t0+(t1-t0)*i/n,dd=new Date(t);return `<text x="${X(t)}" y="${H-8}" text-anchor="middle" font-size="11" fill="#5d6674">${pad(dd.getDate())}/${pad(dd.getMonth()+1)}</text>`}).join('');
    s.innerHTML=gy+gx+`<path d="${d} L${X(t1)},${Y(0)} Z" fill="#1F386418"/><path d="${d}" fill="none" stroke="#1F3864" stroke-width="2"/><circle cx="${X(t1)}" cy="${Y(pts.length/tot)}" r="4" fill="#1F3864"/><text x="${Math.min(X(t1),W-pr-4)}" y="${Y(pts.length/tot)-8}" text-anchor="end" font-size="12" font-weight="700" fill="#1F3864">${(pts.length/tot*100).toFixed(1)}%</text>`};
  draw();if(!drawEvo.ro){drawEvo.ro=new ResizeObserver(()=>{const b=$('evo');if(b)drawEvo()});}drawEvo.ro.disconnect();drawEvo.ro.observe(box)}
function setTab(t){tab=t;$('main').hidden=t!=='mapa';$('painel').hidden=t!=='painel';renderAll()}

// =====================================================================
//  Eventos
// =====================================================================
$('vMapa').onclick=()=>setTab('mapa');$('vPainel').onclick=()=>setTab('painel');
$('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;view=b.dataset.v;vb=null;renderAll()});
$('mode').addEventListener('change',e=>{mode=e.target.value;renderAll()});
$('filt').addEventListener('change',e=>{filt=e.target.value;renderAll()});
$('bLote').onclick=openLote;$('bRel').onclick=()=>openRelDlg();
$('painel').addEventListener('click',e=>{const c=e.target.closest('[data-cell]');if(!c)return;const[s,v]=c.dataset.cell.split('|');setTab('mapa');select(s,false);open.add(v);renderSide()});
$('left').addEventListener('click',e=>{
  const t=e.target.closest('[data-nct]');if(t){ncTab=t.dataset.nct;renderLeft();return}
  const n=e.target.closest('[data-nc]');if(n){const[s,v,i]=n.dataset.nc.split('|');goItem(s,v,i);return}
  const b=e.target.closest('.setl [data-id]');if(b)select(b.dataset.id,true)});
function goItem(s,v,i){select(s,false);open.add(v);renderSide();
  const el=$('it-'+v+'-'+i);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('flash')}}
function select(id,scroll){if(PN.r){PN.r=false;applyPN()}if(id!==sel){draft={t:'',v:'',i:''};cmOpen=false;pf='';pAll=false;open=new Set()}sel=id;const s=byId[id];if(s.v!==view){view=s.v;vb=null}renderAll();
  try{history.replaceState(null,'','#'+id)}catch(e){}
  if(scroll)(matchMedia('(max-width:900px)').matches?$('side'):document.body).scrollIntoView({behavior:'smooth'})}
$('side').addEventListener('click',e=>{
  const b=e.target.closest('.seg button');if(b){const it=b.closest('.it'),v=it.dataset.v,i=it.dataset.i;
    const before=rec(sel,v,i).st,hadNC=!!ncOpen(sel,v,i);
    // abre a câmera já no toque (precisa ser no mesmo clique)
    const willNC=b.dataset.st==='NC'&&before!=='NC'&&!hadNC,willFix=b.dataset.st==='C'&&hadNC;
    if(touch&&(willNC||willFix))capture({s:sel,v,i,fase:willNC?'antes':'depois'},true);
    setStatus(sel,v,i,b.dataset.st);return}
  const tg=e.target.closest('[data-tog]');if(tg){const v=tg.dataset.tog;open.has(v)?open.delete(v):open.add(v);renderSide();return}
  const na=e.target.closest('[data-allna]');if(na){allNA(sel,na.dataset.allna);return}
  const cam=e.target.closest('[data-cam]');if(cam){const[v,i,f]=cam.dataset.cam.split('|');capture({s:sel,v,i,fase:f||(ncOpen(sel,v,i)?'antes':null)},true);return}
  const rp=e.target.closest('[data-rep]');if(rp){repFVS([byId[sel]],{fotos:true});return}
  if(e.target.id==='recnew'){openRec();return}
  if(e.target.id==='recdel'){const x=e.target;if(x.dataset.arm){delete REC[sel];send({t:'delete',tb:'recebimentos',col:'setor',id:sel});renderAll()}else{x.dataset.arm=1;x.textContent='Confirmar: desfazer recebimento'}return}
  if(e.target.id==='cmopen'){cmOpen=true;renderSide();$('ctx')&&$('ctx').focus();return}
  if(e.target.id==='send')sendComment();
  if(e.target.id==='addf'){capture({s:sel,v:draft.v||null,i:draft.i||null,fase:null},false);return}
  const pfb=e.target.closest('[data-pf]');if(pfb){pf=pfb.dataset.pf;pAll=false;renderSide();$('fotos').scrollIntoView({behavior:'smooth'});return}
  if(e.target.id==='pall'){pAll=true;renderSide();return}
  const th=e.target.closest('[data-lb]');if(th){const inGal=!!th.closest('.gal');const list=photosOf(sel).filter(c=>!inGal||pfMatch(c));
    LB={list,i:Math.max(0,list.findIndex(c=>c.id===th.dataset.lb))};showLB()}});
$('side').addEventListener('change',e=>{
  if(e.target.matches('[data-obs]')){const it=e.target.closest('.it');setObs(sel,it.dataset.v,it.dataset.i,e.target.value.trim())}
  if(e.target.matches('input[data-nc]'))setNC(e.target.dataset.id,e.target.dataset.nc,e.target.value.trim());
  if(e.target.id==='pf'){pf=e.target.value;pAll=false;renderSide()}
  if(e.target.id==='csvc'){[draft.v,draft.i]=e.target.value.split('|')}});
$('side').addEventListener('input',e=>{if(e.target.id==='ctx')draft.t=e.target.value});

// ---------- mover / aproximar ----------
const svg=$('map');const ptrs=new Map();let moved=0,last=null,pinch=null;
function toSvg(cx,cy){const r=svg.getBoundingClientRect();const sc=Math.max(vb[2]/r.width,vb[3]/r.height);
  const ox=(r.width*sc-vb[2])/2,oy=(r.height*sc-vb[3])/2;return[vb[0]-ox+(cx-r.left)*sc,vb[1]-oy+(cy-r.top)*sc,sc]}
function zoomAt(cx,cy,f){const[x,y]=toSvg(cx,cy);const V=VIEWS.find(v=>v.id===view);
  const nw=Math.min(Math.max(vb[2]*f,V.b[2]/30),V.b[2]*1.6);f=nw/vb[2];
  vb=[x-(x-vb[0])*f,y-(y-vb[1])*f,vb[2]*f,vb[3]*f];svg.setAttribute('viewBox',vb.join(' '))}
svg.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,e.deltaY>0?1.15:1/1.15)},{passive:false});
svg.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);svg.setPointerCapture(e.pointerId);moved=0;last=[e.clientX,e.clientY];
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1])}svg.classList.add('drag')});
svg.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch){zoomAt((a[0]+b[0])/2,(a[1]+b[1])/2,pinch/d);moved+=10}pinch=d;return}
  const[,,sc]=toSvg(0,0);const dx=e.clientX-last[0],dy=e.clientY-last[1];moved+=Math.abs(dx)+Math.abs(dy);last=[e.clientX,e.clientY];
  vb[0]-=dx*sc;vb[1]-=dy*sc;svg.setAttribute('viewBox',vb.join(' '))});
function up(e){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(!ptrs.size)svg.classList.remove('drag');
  if(e.type==='pointerup'&&moved<6&&!ptrs.size){const t=document.elementFromPoint(e.clientX,e.clientY);const id=t&&t.dataset&&t.dataset.id;if(id)select(id,false)}}
svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
$('zin').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1/1.4)};
$('zout').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,1.4)};
$('zfit').onclick=()=>{vb=null;renderMap()};
// ---------- ocultar/mostrar painéis ----------
const MN=$('main');let PN={};try{PN=JSON.parse(localStorage.getItem('paineis')||'{}')||{}}catch(e){}
function applyPN(){MN.classList.toggle('hl',!!PN.l);MN.classList.toggle('hr',!!PN.r);
  $('togL').setAttribute('aria-label',PN.l?'Mostrar painel de não conformidades':'Ocultar painel de não conformidades');
  $('togR').setAttribute('aria-label',PN.r?'Mostrar ficha do ambiente':'Ocultar ficha do ambiente');try{localStorage.setItem('paineis',JSON.stringify(PN))}catch(e){}}
$('togL').onclick=()=>{PN.l=!PN.l;applyPN()};$('togR').onclick=()=>{PN.r=!PN.r;applyPN()};applyPN();

// =====================================================================
//  Login
// =====================================================================
async function setUser(session){
  const email=session?.user?.email||null;const was=canWrite;canWrite=false;ME='';
  if(email){const {data}=await sb.from('membros').select('nome').eq('email',email.toLowerCase()).maybeSingle();
    if(data){canWrite=true;ME=data.nome||email;if(/não está cadastrado/.test($('banner').textContent))banner('')}else{ME=email;banner('Seu e-mail ('+email+') ainda não está cadastrado na equipe. Peça acesso ao responsável.')}}
  $('authtxt').textContent=email?ME:'Somente leitura';
  $('login').hidden=!!email;$('logout').hidden=!email;$('defsenha').hidden=!email;$('loginbox').hidden=true;
  if(loaded&&was!==canWrite)load();renderAll()}
(async()=>{
  const fromLink=/type=(magiclink|recovery|signup|invite)/.test(location.hash);$('auth').hidden=false;
  sb.auth.onAuthStateChange((ev,s)=>{if(ev==='SIGNED_IN'||ev==='SIGNED_OUT'||ev==='PASSWORD_RECOVERY')setUser(s);if(ev==='PASSWORD_RECOVERY')$('senhabox').hidden=false});
  const {data:{session}}=await sb.auth.getSession();await setUser(session);
  if(session&&fromLink){$('senhabox').hidden=false;try{history.replaceState(null,'',location.pathname)}catch(e){}}
  await load();realtime();obCount();flush();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){load();flush()}});
  $('login').onclick=()=>{$('loginbox').hidden=!$('loginbox').hidden;$('email').focus()};
  $('logout').onclick=()=>{$('senhabox').hidden=true;sb.auth.signOut()};
  $('defsenha').onclick=()=>{$('senhabox').hidden=!$('senhabox').hidden;$('nova').focus()};
  $('loginbox').onsubmit=async e=>{e.preventDefault();const em=$('email').value.trim(),pw=$('senha').value;
    if(!pw){$('loginmsg').textContent='Digite a senha, ou use o botão de receber link por e-mail.';return}
    $('loginmsg').textContent='Entrando…';const {error}=await sb.auth.signInWithPassword({email:em,password:pw});
    $('loginmsg').textContent=error?(/invalid/i.test(error.message)?'E-mail ou senha incorretos. Se ainda não criou senha, use o botão de receber link.':'Não foi possível entrar: '+error.message):''};
  $('link').onclick=async()=>{const em=$('email').value.trim();if(!em){$('loginmsg').textContent='Digite seu e-mail primeiro.';return}
    $('link').disabled=true;const {error}=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.href.split('#')[0]}});
    $('loginmsg').textContent=error?(/rate limit/i.test(error.message)?'Limite de e-mails atingido. Aguarde cerca de 1 hora e peça um único link.':'Não foi possível enviar: '+error.message):'Link enviado para '+em+'. Abra o e-mail neste mesmo aparelho e clique uma única vez.';
    setTimeout(()=>$('link').disabled=false,60000)};
  $('senhabox').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.updateUser({password:$('nova').value});
    $('senhamsg').textContent=error?'Não foi possível salvar: '+error.message:'Senha salva! Da próxima vez entre com e-mail e senha.';
    if(!error){$('nova').value='';setTimeout(()=>$('senhabox').hidden=true,3000)}};
})().catch(e=>{console.error(e);banner('Erro ao conectar ao banco de dados.')});

// ---------- app instalável ----------
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let instEv=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();instEv=e});
addEventListener('appinstalled',()=>{$('inst').hidden=true});
$('inst').hidden=standalone();
$('inst').onclick=async()=>{
  if(instEv){instEv.prompt();const r=await instEv.userChoice;instEv=null;if(r.outcome==='accepted')$('inst').hidden=true;return}
  const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const inapp=/FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)|GSA\//.test(ua),and=/Android/.test(ua),safari=ios&&!/CriOS|FxiOS|EdgiOS/.test(ua);
  const url=location.href.split('#')[0];
  let body;
  if(inapp)body=`<p style="margin:0">Você abriu o link dentro de outro aplicativo (WhatsApp, Instagram, e-mail…), que não permite instalar.</p><ol class="steps"><li>Toque nos <b>três pontinhos</b> ou no ícone de compartilhar desse aplicativo.</li><li>Escolha <b>Abrir no navegador</b> (${ios?'Safari':'Chrome'}).</li><li>Lá, toque de novo em <b>Instalar app</b>.</li></ol>`;
  else if(ios&&!safari)body=`<p style="margin:0">No iPhone, só o <b>Safari</b> instala apps de sites.</p><ol class="steps"><li>Copie o endereço: <b>${esc(url)}</b> <button class="lnk" id="cpy">copiar</button></li><li>Abra o <b>Safari</b> e cole o endereço.</li><li>Toque em <b>Compartilhar</b> (quadrado com seta ↑) → <b>Adicionar à Tela de Início</b> → <b>Adicionar</b>.</li></ol>`;
  else if(ios)body=`<ol class="steps"><li>Toque no botão <b>Compartilhar</b> (quadrado com seta ↑) na barra do Safari.</li><li>Role a lista e toque em <b>Adicionar à Tela de Início</b>.</li><li>Toque em <b>Adicionar</b>. O ícone azul do Mapa da Obra aparece na tela inicial.</li></ol>`;
  else if(and)body=`<ol class="steps"><li>Toque nos <b>três pontinhos ⋮</b> no canto superior direito do Chrome.</li><li>Toque em <b>Instalar app</b> (ou <b>Adicionar à tela inicial</b>).</li><li>Confirme em <b>Instalar</b>.</li></ol><p class="meta" style="margin:0">Se não aparecer a opção, atualize o Chrome pela Play Store e abra o site de novo.</p>`;
  else body=`<ol class="steps"><li>No Chrome ou Edge, clique no ícone de instalar na barra de endereço (um monitor com seta ↓), à direita do endereço.</li><li>Ou abra o menu ⋮ → <b>Transmitir, salvar e compartilhar</b> → <b>Instalar página como app</b>.</li></ol>`;
  openDlg('Instalar o Mapa da Obra',body,'<button class="btn pri" id="instok">Entendi</button>');$('instok').onclick=closeDlg;
  const c=$('cpy');if(c)c.onclick=()=>{navigator.clipboard.writeText(url).then(()=>c.textContent='copiado!',()=>{})}};
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});

if(tab==='mapa')renderAll();
}
