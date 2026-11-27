// Mapa da Obra — funciona sem internet (arquivos do site e fotos já vistas ficam guardados)
const V='mo-202611271306';
const SHELL=['./','index.html','app.js?v=202611271306','dados.js?v=202611271306','config.js?v=202611271306','manifest.webmanifest','icone-192.png','casa01.webp','casa02t.webp','casa02p1.webp','casa03.webp',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // API do banco e login: sempre rede
  if(/supabase\.co$/.test(u.hostname)&&!u.pathname.includes('/storage/v1/object/public/'))return;
  const fotos=u.pathname.includes('/storage/v1/object/public/');
  const estatico=/\.(webp|png|jpg)$/i.test(u.pathname)||fotos||u.hostname==='cdn.jsdelivr.net'||u.hostname.includes('fonts.g');
  if(estatico){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})));return}
  if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))}
});
