{
const O=window.OBRA;
const SECTORS=O.setores, VIEWS=O.plantas, SVC=O.servicos;
const WET=new RegExp(O.areasMolhadas||'^$','i');
const COL={C:'var(--c)',NC:'var(--nc)',NA:'var(--na)',P:'var(--pend)','':'var(--ini)'};
const STN={C:'Conforme',NC:'Não conforme',NA:'Não se aplica',P:'Em andamento','':'Pendente'};
const SIT={lib:['Liberado','var(--c)'],nc:['Com não conformidade','var(--nc)'],and:['Em andamento','var(--pend)'],ini:['Não iniciado','var(--ini)']};
const svcsOf=s=>SVC.filter(v=>(s.svc?s.svc.includes(v.id):(!v.w||WET.test(s.n))));
const byId=Object.fromEntries(SECTORS.map(s=>[s.id,s]));
const svcById=Object.fromEntries(SVC.map(v=>[v.id,v]));
const ixOf=v=>SVC.indexOf(v)+1;
const itemOf=(vid,iid)=>(svcById[vid]?.itens||[]).find(i=>i.id===iid);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=ms=>ms?new Date(ms).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
const $=id=>document.getElementById(id);
const svcName=id=>svcById[id]?.n||'';
const label=(v,i)=>v?(svcName(v)+(i&&itemOf(v,i)?' › '+itemOf(v,i).n:'')):'Ambiente em geral';
document.title=O.tituloCurto||'Mapa da Obra';$('ttl').textContent=O.titulo;$('sub').innerHTML=(O.etiquetas||[O.subtitulo]).map(x=>`<span class="chip">${esc(x)}</span>`).join('');

let LIB={},CMS=[],canWrite=false,names={};
let view=VIEWS[0].id,sel=null,mode='geral',vb=null,pendFile=null,pendUrl='',draft={t:'',v:'',i:''},pf='',pAll=false,LB=null,open=new Set();
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
  t=t||1;const sit=nc?'nc':(p===0?'lib':(c+na?'and':'ini'));
  return{c,nc,na,p,t,et,eti,sit,pct:Math.round((c+na)/t*100)}}
function colorOf(s){
  if(mode==='geral')return SIT[info(s).sit][1];
  const v=svcsOf(s).find(v=>v.id===mode);if(!v)return 'transparent';
  return COL[svcStat(s,v).st]}
function bar(x,cls){const w=n=>(n/x.t*100).toFixed(1)+'%';
  return `<div class="${cls}"><span style="width:${w(x.c)};background:var(--c)"></span><span style="width:${w(x.na)};background:var(--na)"></span><span style="width:${w(x.nc)};background:var(--nc)"></span></div>`}
const who=b=>esc(API.textNames?(b||''):(names[b]||''));
const openNCs=()=>Object.values(LIB).filter(r=>r.st==='NC'&&byId[r.s]&&itemOf(r.v,r.i)).sort((a,b)=>b.at-a.at);

// ---------- desenho ----------
function renderKpis(){
  let lib=0,nc=0,t=0,ok=0;for(const s of SECTORS){const i=info(s);if(i.sit==='lib')lib++;nc+=i.nc;t+=i.t;ok+=i.c+i.na}
  $('kpis').innerHTML=[[`${lib} de ${SECTORS.length}`,'ambientes liberados','ok'],[Math.round(ok/t*100)+'%','dos itens liberados (C + NA)',''],[nc,'não conformidades abertas',nc?'bad':''],[t-ok-nc,'itens pendentes','pd']]
    .map(([b,s,c])=>`<div class="kpi ${c}"><b>${b}</b><span>${s}</span></div>`).join('');
}
function renderTabs(){$('tabs').innerHTML=VIEWS.map(v=>`<button data-v="${v.id}" aria-pressed="${v.id===view}">${esc(v.n)}</button>`).join('')}
function renderMode(){$('mode').innerHTML=`<option value="geral">Situação geral do ambiente</option>`+SVC.map(v=>`<option value="${v.id}">${esc(v.n)}</option>`).join('');$('mode').value=mode}
function renderLegend(){
  $('legend').innerHTML='<div class="legend">'+(mode==='geral'?Object.values(SIT).map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join(''):
   ['C','NC','NA','P',''].map(k=>`<span><i style="background:${COL[k]}"></i>${STN[k]}</span>`).join(''))+'</div>'}
function renderMap(){
  const V=VIEWS.find(v=>v.id===view);if(!vb)vb=[...V.b];
  $('map').setAttribute('viewBox',vb.join(' '));
  $('map').innerHTML=`<image href="${V.img}" x="${V.b[0]}" y="${V.b[1]}" width="${V.b[2]}" height="${V.b[3]}" preserveAspectRatio="none"/>`+
   SECTORS.filter(s=>s.v===view).map(s=>{const c=colorOf(s),cls='sec'+(s.id===sel?' sel':'');const tt=`<title>${esc(s.n)} — ${SIT[info(s).sit][0]}</title>`;
    return s.p?`<polygon class="${cls}" data-id="${s.id}" points="${s.p}" fill="${c}" stroke="${c==='transparent'?'#999':c}">${tt}</polygon>`:
    `<circle class="${cls} pin" data-id="${s.id}" cx="${s.x}" cy="${s.y}" r="11" fill="${c==='transparent'?'#bbb':c}" style="fill-opacity:.9">${tt}</circle>`}).join('')}
function renderLeft(){
  const ncs=openNCs();
  $('nccard').innerHTML=`<h2>Não conformidades abertas <span class="count ${ncs.length?'bad':''}">${ncs.length}</span></h2>`+
   (ncs.length?`<ul class="ncl">${ncs.map(r=>{const s=byId[r.s],v=svcById[r.v],it=itemOf(r.v,r.i);
     return `<li><button data-nc="${esc(r.s)}|${esc(r.v)}|${esc(r.i)}"><b>${esc(s.n)}</b><span class="q">${ixOf(v)}.${v.itens.indexOf(it)+1} ${esc(v.n)} › ${esc(it.n)}</span>
      ${r.obs?`<div class="o">${esc(r.obs)}</div>`:''}<div class="meta">${esc(VIEWS.find(x=>x.id===s.v).n)} · ${who(r.by)} ${fmt(r.at)}</div></button></li>`}).join('')}</ul>`
     :`<div class="empty-s">Nenhuma NC aberta. Quando um item for marcado NC ele aparece aqui até ser corrigido e marcado C.</div>`);
  const rows=SECTORS.filter(s=>s.v===view);const nlib=rows.filter(s=>info(s).sit==='lib').length;
  const wasOpen=$('setcard').open;
  $('setcard').innerHTML=`<summary>Ambientes desta planta <span class="count" title="liberados">${nlib}/${rows.length}</span></summary>
   <ul class="setl">${rows.map(s=>{const i=info(s);return `<li><button data-id="${s.id}" aria-current="${s.id===sel}"><span class="dot" style="background:${SIT[i.sit][1]}"></span>
    <span class="nm">${esc(s.n)}${i.nc?` <span class="count bad">${i.nc} NC</span>`:''}</span><span class="pc">${i.pct}%</span>${bar(i,'mini')}</button></li>`}).join('')}</ul>`;
  $('setcard').open=wasOpen;
}
function itemHtml(s,v,it,k){const r=rec(s.id,v.id,it.id),dis=canWrite?'':'disabled',ph=photosOf(s).filter(c=>c.v===v.id&&c.i===it.id).length;
  return `<div class="it${r.st==='NC'?' isnc':''}" id="it-${v.id}-${it.id}" data-v="${v.id}" data-i="${it.id}"><div class="row">
   <div class="nm"><em>${ixOf(v)}.${k+1}</em>${esc(it.n)}<small>${esc(it.c)}</small><small><b>Como verificar:</b> ${esc(it.m)}</small></div>
   <div class="ctl">${canWrite&&API.canUpload?`<button class="cam" data-cam="${v.id}|${it.id}" aria-label="Tirar foto: ${esc(it.n)}" title="Tirar foto deste item"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9Zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg></button>`:''}
   <div class="seg" role="group" aria-label="Resultado ${esc(it.n)}">${['C','NC','NA'].map(x=>`<button data-st="${x}" ${r.st===x?`data-on="${x}"`:''} aria-pressed="${r.st===x}" ${dis}>${x}</button>`).join('')}</div></div></div>
   <input type="text" data-obs placeholder="Observação${r.st==='NC'?' — descreva a não conformidade':''}" value="${esc(r.obs||'')}" ${dis} aria-label="Observação: ${esc(it.n)}">
   ${r.at||ph?`<div class="who">${r.at&&r.st?`${esc(r.st)} · ${who(r.by)} ${fmt(r.at)}`:''}${ph?` <button class="lnk" data-pf="${v.id}|${it.id}">${ph} foto${ph>1?'s':''}</button>`:''}</div>`:''}</div>`}
function photosOf(s){return CMS.filter(c=>c.s===s.id&&c.f&&API.photoUrl(c.f)).sort((a,b)=>b.at-a.at)}
function pfMatch(c){if(!pf)return true;if(pf==='geral')return !c.v;const[v,i]=pf.split('|');return c.v===v&&(!i||c.i===i)}
function renderSide(){
  const el=$('side');
  if(!sel){el.innerHTML=`<div class="empty"><h2>Selecione um ambiente no mapa</h2><p>Toque em um ambiente colorido (ou na bolinha, nos ambientes pequenos). Cada serviço abre a lista de itens a verificar, na ordem de execução, para marcar <b>C</b> (conforme), <b>NC</b> (não conforme) ou <b>NA</b> (não se aplica), anotar e fotografar.</p><p>Arraste para mover a planta; use a roda do mouse, o gesto de pinça ou os botões + e − para aproximar.</p></div>`;return}
  const s=byId[sel],I=info(s),[sn,sc]=SIT[I.sit],ids=[],dis=canWrite?'':'disabled';
  const all=CMS.filter(c=>c.s===s.id).sort((a,b)=>b.at-a.at),photos=photosOf(s);all.forEach(c=>ids.push(c.by));
  // galeria
  const shown=photos.filter(pfMatch),lim=pAll?shown.length:8;
  const og=svcsOf(s).map(v=>{const pv=photos.filter(c=>c.v===v.id);if(!pv.length)return '';
     const its=v.itens.map(it=>[it,pv.filter(c=>c.i===it.id).length]).filter(x=>x[1]);
     return `<optgroup label="${esc(v.n)}"><option value="${v.id}" ${pf===v.id?'selected':''}>${esc(v.n)} — todas (${pv.length})</option>${its.map(([it,n])=>`<option value="${v.id}|${it.id}" ${pf===v.id+'|'+it.id?'selected':''}>${esc(it.n)} (${n})</option>`).join('')}</optgroup>`}).join('');
  const ng=photos.filter(c=>!c.v).length;
  const gal=photos.length?`<div class="gal-f"><label class="meta" for="pf">Mostrar</label><select id="pf"><option value="">Todas as fotos do ambiente (${photos.length})</option>${ng?`<option value="geral" ${pf==='geral'?'selected':''}>Ambiente em geral (${ng})</option>`:''}${og}</select></div>
   <div class="gal">${shown.slice(0,lim).map(c=>`<button class="th" data-lb="${esc(c.id)}" aria-label="Abrir foto: ${esc(label(c.v,c.i))}"><img src="${esc(API.photoUrl(c.f))}" alt="" loading="lazy">${c.v?`<span>${esc(c.i&&itemOf(c.v,c.i)?itemOf(c.v,c.i).n:svcName(c.v))}</span>`:''}</button>`).join('')}</div>
   ${shown.length>lim?`<button class="btn" id="pall">Ver todas (${shown.length})</button>`:''}`
   :`<p class="meta">Nenhuma foto ainda. Use o botão de câmera de cada item ou "Tirar foto" nos comentários.</p>`;
  // serviços
  const svcHtml=svcsOf(s).map(v=>{const x=svcStat(s,v),isO=open.has(v.id);
    let lastEt='',body='';
    if(isO){body=`<div class="items">${canWrite&&x.p?`<div class="svcact"><button class="lnk" data-allna="${v.id}">Não se aplica a este ambiente (marcar pendentes como NA)</button></div>`:''}`+
      v.itens.map((it,k)=>{const h=it.et!==lastEt?`<div class="et">${esc(it.et)}</div>`:'';lastEt=it.et;return h+itemHtml(s,v,it,k)}).join('')+'</div>'}
    return `<div class="svc"><button class="sh" data-tog="${v.id}" aria-expanded="${isO}"><span class="ix">${ixOf(v)}</span>
     <span class="nm">${esc(v.n)}<small>${x.c+x.na} de ${x.t} itens liberados${x.nc?` · ${x.nc} NC`:''}</small></span>
     <span class="stb" style="background:${COL[x.st]}">${STN[x.st]}</span><span class="chev" aria-hidden="true"></span>${bar(x,'mini')}</button>${body}</div>`}).join('');
  // comentários
  const opts=svcsOf(s).map(v=>`<optgroup label="${esc(v.n)}"><option value="${v.id}|" ${draft.v===v.id&&!draft.i?'selected':''}>${esc(v.n)} — geral</option>${v.itens.map((it,k)=>`<option value="${v.id}|${it.id}" ${draft.v===v.id&&draft.i===it.id?'selected':''}>${ixOf(v)}.${k+1} ${esc(it.n)}</option>`).join('')}</optgroup>`).join('');
  const feed=all.filter(c=>c.k!=='status'),hist=all.filter(c=>c.k==='status');
  el.innerHTML=`<div class="head"><div class="meta">${esc(VIEWS.find(v=>v.id===s.v).n)} · ${String(s.a).replace('.',',')} m²</div><h2>${esc(s.n)}</h2>
   <span class="pill" style="background:${sc}">${sn}</span>
   <div class="etapa">Etapa atual: <b>${I.et?`${esc(I.et.n)}${I.eti?' › '+esc(I.eti.et)+': '+esc(I.eti.n):''}`:'Todos os serviços liberados'}</b></div>
   ${bar(I,'prog')}<div class="counts"><span>${I.c} C</span><span>${I.nc} NC</span><span>${I.na} NA</span><span>${I.p} pendentes</span><span>${I.pct}% liberado</span></div></div>
   <h3 id="fotos">Fotos (${photos.length})</h3><div class="pics">${gal}</div>
   <h3>Serviços (na ordem de execução) — toque para ver os itens</h3><div class="svcs">${svcHtml}</div>
   <h3>Comentários</h3><div class="cm">
   <label class="meta" for="csvc">Sobre</label><select id="csvc"><option value="|">O ambiente todo</option>${opts}</select>
   ${pendUrl?`<div class="prev"><img src="${pendUrl}" alt="Foto a enviar"><button class="btn" id="rmfoto">Remover foto</button></div>`:''}
   <textarea id="ctx" placeholder="${pendUrl?'Descreva a foto (opcional)…':'Escreva um comentário…'}" aria-label="Comentário" ${dis}>${esc(draft.t)}</textarea>
   <div class="act">${canWrite&&API.canUpload?'<button class="btn" id="tirar">Tirar foto</button><button class="btn" id="foto">Da galeria</button>':''}<span class="sp"></span><button class="btn pri" id="send" ${dis}>Enviar</button><span class="meta" id="fname"></span></div>
   <ul class="feed">${feed.map(c=>{const u=API.photoUrl(c.f);return `<li><div class="t">${c.v?`<span class="tag">${esc(label(c.v,c.i))}</span>`:''}${who(c.by)} · ${fmt(c.at)}</div>
     ${c.t?`<div>${esc(c.t)}</div>`:''}${u?`<button class="th sm" data-lb="${esc(c.id)}" aria-label="Abrir foto"><img src="${esc(u)}" alt="" loading="lazy"></button>`:''}</li>`}).join('')||'<li class="meta">Nenhum comentário ainda.</li>'}</ul>
   ${hist.length?`<details class="hist"><summary>Histórico de liberações (${hist.length})</summary><ul class="feed">${hist.map(c=>`<li><div class="t">${c.v?`<span class="tag">${esc(label(c.v,c.i))}</span>`:''}${who(c.by)} · ${fmt(c.at)}</div><div>Marcou <b style="color:${COL[c.st]||'var(--mute)'}">${esc(c.st||'pendente')}</b>${c.t?' — '+esc(c.t):''}</div></li>`).join('')}</ul></details>`:''}</div>`;
  API.loadNames&&API.loadNames(ids.concat(Object.values(LIB).map(r=>r.by)));
}
function renderAll(){renderKpis();renderTabs();renderMap();renderLeft();renderSide();renderLegend()}
function banner(t){$('banner').textContent=t||'';$('banner').classList.toggle('on',!!t)}
function fail(e){console.error(e);
  if(e&&(e.code==='invalid_argument'||e.code==='42501'||/row-level security/i.test(e.message||''))){canWrite=false;banner('Você não tem permissão para alterar este mapa. Peça acesso ao responsável.');renderSide();return}
  if(e&&e.code==='quota_exceeded'){banner('O banco de dados do mapa está cheio. Avise o responsável.');return}
  banner('Não foi possível salvar agora. Tente de novo em instantes.')}

// ---------- escrita ----------
async function setStatus(sid,vid,iid,st){
  const k=key(sid,vid,iid),cur=LIB[k]||{};const nst=cur.st===st?null:st;
  const doc={s:sid,v:vid,i:iid,st:nst,obs:cur.obs||'',by:API.me(),at:Date.now()};LIB[k]=doc;renderAll();
  try{await API.setLib([doc]);await API.addCmt({s:sid,v:vid,i:iid,k:'status',st:nst,t:doc.obs||'',by:doc.by,at:doc.at})}catch(e){fail(e)}}
async function allNA(sid,vid){const v=svcById[vid],at=Date.now(),by=API.me();
  const docs=v.itens.filter(it=>!rec(sid,vid,it.id).st).map(it=>({s:sid,v:vid,i:it.id,st:'NA',obs:'Não se aplica a este ambiente',by,at}));
  docs.forEach(d=>LIB[key(d.s,d.v,d.i)]=d);renderAll();
  try{await API.setLib(docs);await API.addCmt({s:sid,v:vid,i:null,k:'status',st:'NA',t:'Serviço não se aplica a este ambiente ('+docs.length+' itens)',by,at})}catch(e){fail(e)}}
async function setObs(sid,vid,iid,obs){
  const k=key(sid,vid,iid),cur=LIB[k]||{};if((cur.obs||'')===obs)return;
  const doc={s:sid,v:vid,i:iid,st:cur.st||null,obs,by:API.me(),at:Date.now()};LIB[k]=doc;
  try{await API.setLib([doc])}catch(e){fail(e)}}
async function sendComment(){
  const t=$('ctx').value.trim();if(!t&&!pendFile)return;
  const c={s:sel,v:draft.v||null,i:draft.i||null,k:'nota',t,by:API.me(),at:Date.now()};
  $('send').disabled=true;$('fname').textContent=pendFile?'Enviando foto…':'';
  try{if(pendFile)c.f=await API.upload(pendFile,c.v,c.i);clearPhoto();draft={t:'',v:'',i:''};const id=await API.addCmt(c);if(API.local){c.id=id||String(Date.now());CMS.push(c)}renderSide()}
  catch(e){fail(e);$('send').disabled=false;$('fname').textContent=''}}

// ---------- eventos ----------
$('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;view=b.dataset.v;vb=null;renderAll()});
$('mode').addEventListener('change',e=>{mode=e.target.value;renderMap();renderLegend()});
$('left').addEventListener('click',e=>{
  const n=e.target.closest('[data-nc]');if(n){const[s,v,i]=n.dataset.nc.split('|');goItem(s,v,i);return}
  const b=e.target.closest('.setl [data-id]');if(b)select(b.dataset.id,true)});
function goItem(s,v,i){select(s,false);open.add(v);renderSide();
  const el=$('it-'+v+'-'+i);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('flash')}}
function select(id,scroll){if(PN.r){PN.r=false;applyPN()}if(id!==sel){draft={t:'',v:'',i:''};clearPhoto();pf='';pAll=false;open=new Set()}sel=id;const s=byId[id];if(s.v!==view){view=s.v;vb=null}renderAll();
  try{history.replaceState(null,'','#'+id)}catch(e){}
  if(scroll)(matchMedia('(max-width:900px)').matches?$('side'):document.body).scrollIntoView({behavior:'smooth'})}
$('side').addEventListener('click',e=>{
  const b=e.target.closest('.seg button');if(b){const it=b.closest('.it');setStatus(sel,it.dataset.v,it.dataset.i,b.dataset.st);return}
  const tg=e.target.closest('[data-tog]');if(tg){const v=tg.dataset.tog;open.has(v)?open.delete(v):open.add(v);renderSide();return}
  const na=e.target.closest('[data-allna]');if(na){allNA(sel,na.dataset.allna);return}
  const cam=e.target.closest('[data-cam]');if(cam){[draft.v,draft.i]=cam.dataset.cam.split('|');$('cam').click();return}
  if(e.target.id==='send')sendComment();
  if(e.target.id==='tirar')$('cam').click();
  if(e.target.id==='foto')$('file').click();
  if(e.target.id==='rmfoto'){clearPhoto();renderSide()}
  const pfb=e.target.closest('[data-pf]');if(pfb){pf=pfb.dataset.pf;pAll=false;renderSide();$('fotos').scrollIntoView({behavior:'smooth'});return}
  if(e.target.id==='pall'){pAll=true;renderSide();return}
  const th=e.target.closest('[data-lb]');if(th){const inGal=!!th.closest('.gal');const list=photosOf(byId[sel]).filter(c=>!inGal||pfMatch(c));
    LB={list,i:Math.max(0,list.findIndex(c=>c.id===th.dataset.lb))};showLB()}});
$('side').addEventListener('change',e=>{
  if(e.target.matches('[data-obs]')){const it=e.target.closest('.it');setObs(sel,it.dataset.v,it.dataset.i,e.target.value.trim())}
  if(e.target.id==='pf'){pf=e.target.value;pAll=false;renderSide()}
  if(e.target.id==='csvc'){[draft.v,draft.i]=e.target.value.split('|')}});
$('side').addEventListener('input',e=>{if(e.target.id==='ctx')draft.t=e.target.value});
// visualizador
function showLB(){const c=LB.list[LB.i];if(!c){closeLB();return}$('lb').hidden=false;$('lbimg').src=API.photoUrl(c.f);
  $('lbcap').textContent=[label(c.v,c.i),c.t,(API.textNames?c.by:names[c.by])||'',fmt(c.at)].filter(Boolean).join(' · ');
  $('lbn').textContent=(LB.i+1)+' de '+LB.list.length;$('lbprev').disabled=LB.i<=0;$('lbnext').disabled=LB.i>=LB.list.length-1;$('lbopen').href=API.photoUrl(c.f);
  const d=$('lbdel');d.hidden=!(canWrite&&API.canDelete);d.classList.remove('arm');d.textContent='Excluir foto';$('lbclose').focus()}
function closeLB(){$('lb').hidden=true;$('lbimg').src='';LB=null}
$('lbclose').onclick=closeLB;$('lbprev').onclick=()=>{LB.i--;showLB()};$('lbnext').onclick=()=>{LB.i++;showLB()};
$('lbdel').onclick=async()=>{const d=$('lbdel');if(!d.classList.contains('arm')){d.classList.add('arm');d.textContent='Confirmar exclusão';return}
  const c=LB.list[LB.i];d.disabled=true;d.textContent='Excluindo…';
  try{await API.delPhoto(c);CMS=CMS.filter(x=>x!==c);if(c.t||c.k==='status')CMS.push({...c,f:null});LB.list.splice(LB.i,1);if(LB.i>=LB.list.length)LB.i--;renderSide();LB.list.length?showLB():closeLB()}
  catch(e){fail(e)}d.disabled=false};
$('lb').addEventListener('click',e=>{if(e.target.id==='lb')closeLB()});
document.addEventListener('keydown',e=>{if(!LB)return;if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft'&&LB.i>0){LB.i--;showLB()}if(e.key==='ArrowRight'&&LB.i<LB.list.length-1){LB.i++;showLB()}});
// fotos: reduz para ~500 KB (maior lado 1920 px)
function clearPhoto(){if(pendUrl)URL.revokeObjectURL(pendUrl);pendUrl='';pendFile=null}
async function shrink(f){
  try{const bmp=await createImageBitmap(f,{imageOrientation:'from-image'});const k=Math.min(1,1920/Math.max(bmp.width,bmp.height));
    const c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    const b=await new Promise(r=>c.toBlob(r,'image/jpeg',0.82));return b?new File([b],'foto.jpg',{type:'image/jpeg'}):f}catch(e){return f}}
async function takeFile(e){const f=e.target.files[0];e.target.value='';if(!f)return;
  clearPhoto();const fn=$('fname');if(fn)fn.textContent='Preparando foto…';
  pendFile=await shrink(f);pendUrl=URL.createObjectURL(pendFile);renderSide();
  const p=document.querySelector('.cm');if(p)p.scrollIntoView({behavior:'smooth',block:'center'})}
$('file').addEventListener('change',takeFile);$('cam').addEventListener('change',takeFile);

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

// ---------- bancos de dados ----------
const onLib=o=>{LIB=o;renderAll()},onCms=a=>{CMS=a;renderSide()};
// claude.ai (artifact)
const ClaudeAPI={canUpload:false,canDelete:true,
  async start(){let user=null,db=null,assets=null,uid=null;
    try{user=await claude.use('user')}catch(e){}try{uid=user?await user.id():null}catch(e){}this.uid=uid;
    try{assets=await claude.use('assets')}catch(e){}this.assets=assets;this.canUpload=!!assets;
    try{db=await claude.use('db')}catch(e){}this.db=db;
    if(!db){this.local=true;canWrite=true;banner('Sem conexão com o banco de dados: as alterações desta visita não serão salvas.');renderSide();return}
    canWrite=true;try{const w=user?await user.can('data.write'):null;if(w===false){canWrite=false;banner('Acesso só de leitura.')}}catch(e){}
    this.loadNames=async ids=>{if(!user||!user.profiles)return;const need=[...new Set(ids)].filter(i=>i&&names[i]===undefined);if(!need.length)return;
      need.forEach(i=>names[i]='');try{const ps=await user.profiles(need);for(const i of need)names[i]=(ps&&ps[i]&&ps[i].name)||'Alguém';renderSide()}catch(e){}};
    db.collection('liberacoes').onSnapshot(snap=>{const o={};for(const d of snap.docs){const x=d.data();if(x&&byId[x.s]&&x.i)o[d.id]=x}onLib(o)},()=>banner('Não foi possível carregar as liberações.'));
    db.collection('comentarios').onSnapshot(snap=>onCms(snap.docs.map(d=>({...d.data(),id:d.id})).filter(x=>x&&byId[x.s])),()=>{});renderSide()},
  me(){return this.uid},
  async setLib(docs){if(this.db)for(const d of docs)await this.db.doc('liberacoes/'+key(d.s,d.v,d.i)).set(d)},
  async addCmt(c){if(this.db){const r=this.db.collection('comentarios').doc();await r.set(c);return r.id}},
  async upload(f){const a=await this.assets.upload(f);return a.id},
  async delPhoto(c){if(!this.db)return;const r=this.db.doc('comentarios/'+c.id);if(c.t)await r.update({f:null});else await r.delete()},
  photoUrl(f){return f&&/^[\w.-]+$/.test(f)?'/_blob/'+f:''}};
// Supabase (site externo)
const SupaAPI={textNames:true,canUpload:true,canDelete:true,
  async start(){
    const fromLink=/type=(magiclink|recovery|signup|invite)/.test(location.hash);const C=window.SUPABASE_CONFIG;
    const sb=window.supabase.createClient(C.url,C.anonKey);this.sb=sb;$('auth').hidden=false;
    const fromRow=r=>({s:r.setor,v:r.servico,i:r.item,st:r.st,obs:r.obs||'',by:r.por,at:+r.em});
    const cRow=r=>({id:r.id,s:r.setor,v:r.servico,i:r.item,k:r.tipo,st:r.st,t:r.texto||'',f:r.foto,by:r.por,at:+r.em});
    const load=async()=>{
      const [a,b]=await Promise.all([sb.from('liberacoes').select('*').not('item','is',null),sb.from('comentarios').select('*').order('em',{ascending:false}).limit(10000)]);
      if(a.error||b.error){banner('Não foi possível carregar os dados da obra.');console.error(a.error||b.error);return}
      const o={};for(const r of a.data)if(byId[r.setor])o[r.id]=fromRow(r);LIB=o;CMS=b.data.filter(r=>byId[r.setor]).map(cRow);renderAll()};
    await load();
    sb.channel('obra').on('postgres_changes',{event:'*',schema:'public',table:'liberacoes'},p=>{
        if(p.eventType==='DELETE')delete LIB[p.old.id];else if(p.new.item&&byId[p.new.setor])LIB[p.new.id]=fromRow(p.new);renderAll()})
      .on('postgres_changes',{event:'*',schema:'public',table:'comentarios'},p=>{
        const id=(p.new&&p.new.id)||(p.old&&p.old.id);CMS=CMS.filter(c=>c.id!==id);
        if(p.eventType!=='DELETE'&&byId[p.new.setor])CMS.push(cRow(p.new));renderSide()})
      .subscribe();
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
    const setUser=async session=>{
      this.email=session?.user?.email||null;this.nome=null;canWrite=false;
      if(this.email){const {data}=await sb.from('membros').select('nome').eq('email',this.email.toLowerCase()).maybeSingle();
        if(data){canWrite=true;this.nome=data.nome||this.email;banner('')}else banner('Seu e-mail ('+this.email+') ainda não está cadastrado na equipe. Peça acesso ao responsável.')}
      $('authtxt').textContent=this.email?(this.nome||this.email):'Somente leitura';
      $('login').hidden=!!this.email;$('logout').hidden=!this.email;$('defsenha').hidden=!this.email;$('loginbox').hidden=true;renderAll()};
    sb.auth.onAuthStateChange((ev,s)=>{setUser(s);if(ev==='PASSWORD_RECOVERY')$('senhabox').hidden=false});
    const {data:{session}}=await sb.auth.getSession();await setUser(session);
    if(session&&fromLink){$('senhabox').hidden=false;try{history.replaceState(null,'',location.pathname)}catch(e){}}
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
  },
  me(){return this.nome||this.email},
  async setLib(docs){if(!docs.length)return;const {error}=await this.sb.from('liberacoes').upsert(docs.map(d=>({id:key(d.s,d.v,d.i),setor:d.s,servico:d.v,item:d.i,st:d.st,obs:d.obs,por:d.by,em:d.at})));if(error)throw error},
  async addCmt(c){const {data,error}=await this.sb.from('comentarios').insert({setor:c.s,servico:c.v,item:c.i,tipo:c.k,st:c.st||null,texto:c.t,foto:c.f||null,por:c.by,em:c.at}).select('id').single();if(error)throw error;return data.id},
  async upload(f,svc,item){const ext=f.type==='image/jpeg'?'jpg':(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const d=new Date(),ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
    const path=`${sel}/${svc||'geral'}${item?'-'+item:''}_${ymd}_${Date.now()}.${ext}`;const {error}=await this.sb.storage.from('fotos').upload(path,f,{contentType:f.type});if(error)throw error;return path},
  async delPhoto(c){const r=c.t?await this.sb.from('comentarios').update({foto:null}).eq('id',c.id):await this.sb.from('comentarios').delete().eq('id',c.id);if(r.error)throw r.error;
    await this.sb.storage.from('fotos').remove([c.f])},
  photoUrl(f){if(!f||!this.sb)return'';const u=this.sb.storage.from('fotos').getPublicUrl(f).data.publicUrl;return /^https:\/\//.test(u)?u:''}};

const API=(window.SUPABASE_CONFIG&&window.supabase)?SupaAPI:ClaudeAPI;
// ocultar/mostrar painéis
const MN=$('main');let PN={};try{PN=JSON.parse(localStorage.getItem('paineis')||'{}')||{}}catch(e){}
function applyPN(){MN.classList.toggle('hl',!!PN.l);MN.classList.toggle('hr',!!PN.r);
  $('togL').setAttribute('aria-label',PN.l?'Mostrar painel de não conformidades':'Ocultar painel de não conformidades');
  $('togR').setAttribute('aria-label',PN.r?'Mostrar ficha do ambiente':'Ocultar ficha do ambiente');try{localStorage.setItem('paineis',JSON.stringify(PN))}catch(e){}}
$('togL').onclick=()=>{PN.l=!PN.l;applyPN()};$('togR').onclick=()=>{PN.r=!PN.r;applyPN()};applyPN();
renderMode();renderAll();
API.start().catch(e=>{console.error(e);banner('Erro ao conectar ao banco de dados.')});
}
