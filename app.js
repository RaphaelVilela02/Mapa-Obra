{
const O=window.OBRA;
const SECTORS=O.setores, VIEWS=O.plantas, SVC=O.servicos;
const WET=new RegExp(O.areasMolhadas||'^$','i');
const COL={C:'var(--c)',NC:'var(--nc)',NA:'var(--na)',P:'var(--pend)'};
const SIT={lib:['Liberado','var(--c)'],nc:['Com não conformidade','var(--nc)'],and:['Em andamento','var(--pend)'],ini:['Não iniciado','var(--ini)']};
const svcsOf=s=>SVC.filter(v=>(s.svc?s.svc.includes(v.id):(!v.w||WET.test(s.n))));
const byId=Object.fromEntries(SECTORS.map(s=>[s.id,s]));
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=ms=>ms?new Date(ms).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
const $=id=>document.getElementById(id);
document.title=O.tituloCurto||document.title;$('ttl').textContent=O.titulo;$('sub').textContent=O.subtitulo;

let LIB={},CMS=[],canWrite=false,names={};
let view=VIEWS[0].id,sel=null,mode='geral',vb=null,pendFile=null,pendUrl='',draft={t:'',v:''};
const H=location.hash.slice(1);if(byId[H]){sel=H;view=byId[H].v}

function rec(sid,vid){return LIB[sid+'__'+vid]||{}}
function info(s){
  const sv=svcsOf(s);let c=0,nc=0,na=0,p=0,et=null;
  for(const v of sv){const st=rec(s.id,v.id).st;if(st==='C')c++;else if(st==='NC')nc++;else if(st==='NA')na++;else p++;
    if(!et&&st!=='C'&&st!=='NA')et=v}
  const sit=nc?'nc':(p===0?'lib':(c+na?'and':'ini'));
  return{c,nc,na,p,t:sv.length||1,et,sit,pct:Math.round((c+na)/(sv.length||1)*100)}
}
function colorOf(s){
  if(mode==='geral')return SIT[info(s).sit][1];
  if(!svcsOf(s).some(v=>v.id===mode))return 'transparent';
  return COL[rec(s.id,mode).st||'P'];
}
function progBar(i,cls){const w=x=>(x/i.t*100).toFixed(1)+'%';
  return `<div class="${cls}"><span style="width:${w(i.c)};background:var(--c)"></span><span style="width:${w(i.na)};background:var(--na)"></span><span style="width:${w(i.nc)};background:var(--nc)"></span></div>`}
const who=b=>esc(API.textNames?(b||''):(names[b]||''));

function renderKpis(){
  let lib=0,nc=0,itens=0,ok=0;for(const s of SECTORS){const i=info(s);if(i.sit==='lib')lib++;nc+=i.nc;itens+=i.t;ok+=i.c+i.na}
  $('kpis').innerHTML=[[`${lib} de ${SECTORS.length}`,'setores liberados'],[Math.round(ok/itens*100)+'%','dos serviços liberados (C + NA)'],[nc,'não conformidades abertas'],[itens-ok-nc,'serviços pendentes']].map(([b,t])=>`<div class="kpi"><b>${b}</b><span>${t}</span></div>`).join('');
}
function renderTabs(){$('tabs').innerHTML=VIEWS.map(v=>`<button data-v="${v.id}" aria-pressed="${v.id===view}">${esc(v.n)}</button>`).join('')}
function renderMode(){$('mode').innerHTML=`<option value="geral">Situação geral do setor</option>`+SVC.map(v=>`<option value="${v.id}">${esc(v.n)}</option>`).join('');$('mode').value=mode}
function renderLegend(){
  $('legend').innerHTML='<div class="legend">'+(mode==='geral'?Object.values(SIT).map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join(''):
   [['Conforme','C'],['Não conforme','NC'],['Não aplicável','NA'],['Pendente','P']].map(([n,k])=>`<span><i style="background:${COL[k]}"></i>${n}</span>`).join(''))+'</div>';
}
function renderMap(){
  const V=VIEWS.find(v=>v.id===view);if(!vb)vb=[...V.b];
  $('map').setAttribute('viewBox',vb.join(' '));
  $('map').innerHTML=`<image href="${V.img}" x="${V.b[0]}" y="${V.b[1]}" width="${V.b[2]}" height="${V.b[3]}" preserveAspectRatio="none"/>`+
   SECTORS.filter(s=>s.v===view).map(s=>{const c=colorOf(s),cls='sec'+(s.id===sel?' sel':'');const tt=`<title>${esc(s.n)} — ${SIT[info(s).sit][0]}</title>`;
    return s.p?`<polygon class="${cls}" data-id="${s.id}" points="${s.p}" fill="${c}" stroke="${c==='transparent'?'#999':c}">${tt}</polygon>`:
    `<circle class="${cls} pin" data-id="${s.id}" cx="${s.x}" cy="${s.y}" r="11" fill="${c==='transparent'?'#bbb':c}" style="fill-opacity:.9">${tt}</circle>`}).join('');
}
function renderTable(){
  $('lt').textContent='Setores — '+VIEWS.find(v=>v.id===view).n;
  $('tb').innerHTML=SECTORS.filter(s=>s.v===view).map(s=>{const i=info(s),[sn,sc]=SIT[i.sit];
   return `<tr data-id="${s.id}"><td><b>${esc(s.n)}</b> <span class="meta">${String(s.a).replace('.',',')} m²</span></td><td>${i.et?esc(i.et.n):'Concluído'}</td><td>${progBar(i,'mini')} <span class="meta">${i.pct}%</span></td><td class="num">${i.nc||''}</td><td><span class="dot" style="background:${sc}"></span>${sn}</td></tr>`}).join('');
}
function renderSide(){
  const el=$('side');
  if(!sel){el.innerHTML=`<div class="empty"><h2>Selecione um setor no mapa</h2><p>Toque em um ambiente colorido (ou na bolinha, nos ambientes pequenos) para ver a etapa em que está, liberar os serviços como <b>C</b> (conforme), <b>NC</b> (não conforme) ou <b>NA</b> (não aplicável) e registrar comentários e fotos.</p><p>Arraste para mover a planta; use a roda do mouse, o gesto de pinça ou os botões + e − para aproximar.</p></div>`;return}
  const s=byId[sel],i=info(s),[sn,sc]=SIT[i.sit],ids=[];
  const dis=canWrite?'':'disabled';
  const svcHtml=svcsOf(s).map(v=>{const r=rec(s.id,v.id);ids.push(r.by);
    return `<div class="svc${r.st==='NC'?' isnc':''}" data-v="${v.id}"><div class="row"><div class="nm">${esc(v.n)}<small>${esc(v.c)}</small></div>
    ${canWrite&&API.canUpload?`<button class="cam" data-cam="${v.id}" aria-label="Tirar foto de ${esc(v.n)}" title="Tirar foto deste serviço"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9Zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg></button>`:''}<div class="seg" role="group" aria-label="Resultado ${esc(v.n)}">${['C','NC','NA'].map(k=>`<button data-st="${k}" ${r.st===k?`data-on="${k}"`:''} aria-pressed="${r.st===k}" ${dis}>${k}</button>`).join('')}</div></div>
    <input type="text" data-obs placeholder="Observação${r.st==='NC'?' — descreva a não conformidade':''}" value="${esc(r.obs||'')}" ${dis}>
    ${r.at?`<div class="who">${r.st?esc(r.st)+' · ':''}${who(r.by)} ${fmt(r.at)}</div>`:''}</div>`}).join('');
  const feed=CMS.filter(c=>c.s===s.id).sort((a,b)=>b.at-a.at);feed.forEach(c=>ids.push(c.by));
  el.innerHTML=`<div class="head"><div class="meta">${esc(VIEWS.find(v=>v.id===s.v).n)} · ${String(s.a).replace('.',',')} m²</div><h2>${esc(s.n)}</h2>
   <span class="pill" style="background:${sc}">${sn}</span>
   <div class="etapa">Etapa atual: <b>${i.et?esc(i.et.n):'Todos os serviços liberados'}</b></div>
   ${progBar(i,'prog')}<div class="counts"><span>${i.c} C</span><span>${i.nc} NC</span><span>${i.na} NA</span><span>${i.p} pendentes</span><span>${i.pct}% liberado</span></div></div>
   <h3>Liberação dos serviços (na ordem de execução)</h3>${svcHtml}
   <h3>Comentários e fotos</h3><div class="cm">
   <label class="meta" for="csvc">Sobre</label> <select id="csvc"><option value="">O setor todo</option>${svcsOf(s).map(v=>`<option value="${v.id}" ${draft.v===v.id?'selected':''}>${esc(v.n)}</option>`).join('')}</select>
   ${pendUrl?`<div class="prev"><img src="${pendUrl}" alt="Foto a enviar"><button class="btn" id="rmfoto">Remover foto</button></div>`:''}
   <textarea id="ctx" placeholder="${pendUrl?'Descreva a foto (opcional)…':'Escreva um comentário…'}" aria-label="Comentário" ${dis}>${esc(draft.t)}</textarea>
   <div class="act">${canWrite&&API.canUpload?'<button class="btn" id="tirar">Tirar foto</button><button class="btn" id="foto">Da galeria</button>':''}<span class="sp"></span><button class="btn pri" id="send" ${dis}>Enviar</button><span class="meta" id="fname"></span></div>
   <ul class="feed">${feed.map(c=>{const u=API.photoUrl(c.f);return `<li><div class="t">${c.v?`<span class="tag">${esc((SVC.find(v=>v.id===c.v)||{}).n||'')}</span>`:''}${who(c.by)} · ${fmt(c.at)}</div>
     ${c.k==='status'?`<div>Marcou <b style="color:${COL[c.st]||'var(--mute)'}">${esc(c.st||'pendente')}</b>${c.t?' — '+esc(c.t):''}</div>`:`<div>${esc(c.t)}</div>`}
     ${u?`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Foto anexada" loading="lazy"></a>`:''}</li>`}).join('')||'<li class="meta">Nenhum comentário ainda.</li>'}</ul></div>`;
  API.loadNames&&API.loadNames(ids);
}
function renderAll(){renderKpis();renderTabs();renderMap();renderTable();renderSide();renderLegend()}
function banner(t){$('banner').textContent=t||'';$('banner').classList.toggle('on',!!t)}
function fail(e){
  console.error(e);
  if(e&&(e.code==='invalid_argument'||e.code==='42501'||/row-level security/i.test(e.message||''))){canWrite=false;banner('Você não tem permissão para alterar este mapa. Peça acesso ao responsável.');renderSide();return}
  if(e&&e.code==='quota_exceeded'){banner('O banco de dados do mapa está cheio. Avise o responsável.');return}
  banner('Não foi possível salvar agora. Tente de novo em instantes.');
}

// ---------- escrita ----------
async function setStatus(sid,vid,st){
  const key=sid+'__'+vid,cur=LIB[key]||{};const nst=cur.st===st?null:st;
  const doc={s:sid,v:vid,st:nst,obs:cur.obs||'',by:API.me(),at:Date.now()};
  LIB[key]=doc;renderAll();
  try{await API.setLib(key,doc);await API.addCmt({s:sid,v:vid,k:'status',st:nst,t:doc.obs||'',by:doc.by,at:doc.at})}catch(e){fail(e)}
}
async function setObs(sid,vid,obs){
  const key=sid+'__'+vid,cur=LIB[key]||{};if((cur.obs||'')===obs)return;
  const doc={s:sid,v:vid,st:cur.st||null,obs,by:API.me(),at:Date.now()};LIB[key]=doc;
  try{await API.setLib(key,doc)}catch(e){fail(e)}
}
async function sendComment(){
  const t=$('ctx').value.trim();if(!t&&!pendFile)return;
  const c={s:sel,v:$('csvc').value||null,k:'nota',t,by:API.me(),at:Date.now()};
  $('send').disabled=true;$('fname').textContent=pendFile?'Enviando foto…':'';
  try{if(pendFile)c.f=await API.upload(pendFile,c.v);clearPhoto();draft={t:'',v:''};await API.addCmt(c);if(API.local)CMS.push(c);renderSide()}
  catch(e){fail(e);$('send').disabled=false;$('fname').textContent=''}
}

// ---------- eventos ----------
$('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;view=b.dataset.v;vb=null;sel=null;renderAll()});
$('mode').addEventListener('change',e=>{mode=e.target.value;renderMap();renderLegend()});
$('tb').addEventListener('click',e=>{const r=e.target.closest('tr');if(r)select(r.dataset.id,true)});
function select(id,scroll){if(id!==sel){draft={t:'',v:''};clearPhoto()}sel=id;const s=byId[id];if(s.v!==view){view=s.v;vb=null}renderAll();
  try{history.replaceState(null,'','#'+id)}catch(e){}
  if(scroll&&matchMedia('(max-width:900px)').matches)$('side').scrollIntoView({behavior:'smooth'});
  else if(scroll)window.scrollTo({top:0,behavior:'smooth'})}
$('side').addEventListener('click',e=>{
  const b=e.target.closest('.seg button');if(b){setStatus(sel,b.closest('.svc').dataset.v,b.dataset.st);return}
  if(e.target.id==='send')sendComment();
  const cam=e.target.closest('[data-cam]');if(cam){draft.v=cam.dataset.cam;$('cam').click();return}
  if(e.target.id==='tirar'){draft.v=$('csvc').value;$('cam').click()}
  if(e.target.id==='foto'){draft.v=$('csvc').value;$('file').click()}
  if(e.target.id==='rmfoto'){clearPhoto();renderSide()}
});
$('side').addEventListener('change',e=>{if(e.target.matches('[data-obs]'))setObs(sel,e.target.closest('.svc').dataset.v,e.target.value.trim())});
$('side').addEventListener('input',e=>{if(e.target.id==='ctx')draft.t=e.target.value;if(e.target.id==='csvc')draft.v=e.target.value});
function clearPhoto(){if(pendUrl)URL.revokeObjectURL(pendUrl);pendUrl='';pendFile=null}
// reduz a foto do celular (5-10 MB) para ~300-600 KB, maior lado 1920 px
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
const onLib=o=>{LIB=o;renderAll()}, onCms=a=>{CMS=a;renderSide()};

// claude.ai (artifact)
const ClaudeAPI={canUpload:false,
  async start(){
    let user=null,db=null,assets=null,uid=null;
    try{user=await claude.use('user')}catch(e){}
    try{uid=user?await user.id():null}catch(e){}
    this.uid=uid;
    try{assets=await claude.use('assets')}catch(e){}this.assets=assets;this.canUpload=!!assets;
    try{db=await claude.use('db')}catch(e){}this.db=db;
    if(!db){this.local=true;canWrite=true;banner('Sem conexão com o banco de dados: as alterações desta visita não serão salvas.');renderSide();return}
    canWrite=true;try{const w=user?await user.can('data.write'):null;if(w===false){canWrite=false;banner('Acesso só de leitura: peça ao dono do mapa acesso de Contribuidor para liberar serviços.')}}catch(e){}
    this.loadNames=async ids=>{if(!user||!user.profiles)return;const need=[...new Set(ids)].filter(i=>i&&names[i]===undefined);if(!need.length)return;
      need.forEach(i=>names[i]='');try{const ps=await user.profiles(need);for(const i of need)names[i]=(ps&&ps[i]&&ps[i].name)||'Alguém';renderSide()}catch(e){}};
    const tm=setTimeout(()=>banner('Ainda carregando os dados da obra… se demorar, verifique sua conexão.'),10000);
    let got=0;const done=()=>{if(++got>=2){clearTimeout(tm);if($('banner').textContent.startsWith('Ainda'))banner('')}};
    db.collection('liberacoes').onSnapshot(snap=>{const o={};for(const d of snap.docs){const x=d.data();if(x&&byId[x.s])o[d.id]=x}if(!snap.metadata.fromCache)done();onLib(o)},()=>{clearTimeout(tm);banner('Não foi possível carregar as liberações.')});
    db.collection('comentarios').onSnapshot(snap=>{if(!snap.metadata.fromCache)done();onCms(snap.docs.map(d=>d.data()).filter(x=>x&&byId[x.s]))},()=>clearTimeout(tm));
    renderSide();
  },
  me(){return this.uid},
  async setLib(key,doc){if(this.db)await this.db.doc('liberacoes/'+key).set(doc)},
  async addCmt(c){if(this.db)await this.db.collection('comentarios').add(c)},
  async upload(f){const a=await this.assets.upload(f);return a.id},
  photoUrl(f){return f&&/^[\w.-]+$/.test(f)?'/_blob/'+f:''}
};

// Supabase (site externo)
const SupaAPI={textNames:true,canUpload:true,
  async start(){
    const fromLink=/type=(magiclink|recovery|signup|invite)/.test(location.hash);const C=window.SUPABASE_CONFIG;const sb=window.supabase.createClient(C.url,C.anonKey);this.sb=sb;this.C=C;
    $('auth').hidden=false;
    const fromRow=r=>({s:r.setor,v:r.servico,st:r.st,obs:r.obs||'',by:r.por,at:+r.em});
    const cRow=r=>({s:r.setor,v:r.servico,k:r.tipo,st:r.st,t:r.texto||'',f:r.foto,by:r.por,at:+r.em});
    const load=async()=>{
      const [a,b]=await Promise.all([sb.from('liberacoes').select('*'),sb.from('comentarios').select('*').order('em',{ascending:false}).limit(5000)]);
      if(a.error||b.error){banner('Não foi possível carregar os dados da obra.');console.error(a.error||b.error);return}
      const o={};for(const r of a.data)if(byId[r.setor])o[r.id]=fromRow(r);LIB=o;CMS=b.data.filter(r=>byId[r.setor]).map(cRow);renderAll()};
    await load();
    sb.channel('obra').on('postgres_changes',{event:'*',schema:'public',table:'liberacoes'},p=>{
        if(p.eventType==='DELETE'){delete LIB[p.old.id]}else if(byId[p.new.setor])LIB[p.new.id]=fromRow(p.new);renderAll()})
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'comentarios'},p=>{if(byId[p.new.setor]){CMS.push(cRow(p.new));renderSide()}})
      .subscribe();
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
    const setUser=async session=>{
      this.email=session?.user?.email||null;this.nome=null;canWrite=false;
      if(this.email){const {data}=await sb.from('membros').select('nome').eq('email',this.email.toLowerCase()).maybeSingle();
        if(data){canWrite=true;this.nome=data.nome||this.email}else banner('Seu e-mail ('+this.email+') ainda não está cadastrado como membro da equipe. Peça acesso ao responsável.')}
      $('authtxt').textContent=this.email?(this.nome||this.email):'Somente leitura';
      $('login').hidden=!!this.email;$('logout').hidden=!this.email;$('defsenha').hidden=!this.email;$('loginbox').hidden=true;renderSide()};
    sb.auth.onAuthStateChange((ev,s)=>{setUser(s);if(ev==='PASSWORD_RECOVERY')$('senhabox').hidden=false});
    const {data:{session}}=await sb.auth.getSession();await setUser(session);if(session&&fromLink){$('senhabox').hidden=false;try{history.replaceState(null,'',location.pathname)}catch(e){}}
    $('login').onclick=()=>{$('loginbox').hidden=!$('loginbox').hidden;$('email').focus()};
    $('logout').onclick=()=>{$('senhabox').hidden=true;sb.auth.signOut()};
    $('defsenha').onclick=()=>{$('senhabox').hidden=!$('senhabox').hidden;$('nova').focus()};
    $('loginbox').onsubmit=async e=>{e.preventDefault();const em=$('email').value.trim(),pw=$('senha').value;
      if(!pw){$('loginmsg').textContent='Digite a senha, ou use o botão de receber link por e-mail.';return}
      $('loginmsg').textContent='Entrando…';
      const {error}=await sb.auth.signInWithPassword({email:em,password:pw});
      $('loginmsg').textContent=error?(/invalid/i.test(error.message)?'E-mail ou senha incorretos. Se ainda não criou senha, use o botão de receber link.':'Não foi possível entrar: '+error.message):''};
    $('link').onclick=async()=>{const em=$('email').value.trim();if(!em){$('loginmsg').textContent='Digite seu e-mail primeiro.';return}
      $('link').disabled=true;
      const {error}=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.href.split('#')[0],shouldCreateUser:true}});
      $('loginmsg').textContent=error?(/rate limit/i.test(error.message)?'Limite de e-mails atingido. Aguarde cerca de 1 hora e peça um único link.':'Não foi possível enviar: '+error.message):'Link enviado para '+em+'. Abra o e-mail neste mesmo aparelho e clique uma única vez; o link só funciona uma vez.';
      setTimeout(()=>$('link').disabled=false,60000)};
    $('senhabox').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.updateUser({password:$('nova').value});
      $('senhamsg').textContent=error?'Não foi possível salvar: '+error.message:'Senha salva! Da próxima vez entre com e-mail e senha, em qualquer aparelho.';
      if(!error){$('nova').value='';setTimeout(()=>$('senhabox').hidden=true,3000)}};
  },
  me(){return this.nome||this.email},
  async setLib(key,d){const {error}=await this.sb.from('liberacoes').upsert({id:key,setor:d.s,servico:d.v,st:d.st,obs:d.obs,por:d.by,em:d.at});if(error)throw error},
  async addCmt(c){const {error}=await this.sb.from('comentarios').insert({setor:c.s,servico:c.v,tipo:c.k,st:c.st||null,texto:c.t,foto:c.f||null,por:c.by,em:c.at});if(error)throw error},
  async upload(f,svc){const ext=f.type==='image/jpeg'?'jpg':(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const d=new Date(),ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
    const path=`${sel}/${svc||'geral'}_${ymd}_${Date.now()}.${ext}`;const {error}=await this.sb.storage.from('fotos').upload(path,f,{contentType:f.type});if(error)throw error;return path},
  photoUrl(f){if(!f)return'';const u=this.sb.storage.from('fotos').getPublicUrl(f).data.publicUrl;return /^https:\/\//.test(u)?u:''}
};

const API=(window.SUPABASE_CONFIG&&window.supabase)?SupaAPI:ClaudeAPI;
renderMode();renderAll();
API.start().catch(e=>{console.error(e);banner('Erro ao conectar ao banco de dados.')});
}
