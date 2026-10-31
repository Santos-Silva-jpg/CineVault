const BUILTIN={sonic:"assets/music/sonic.mp3",tekken:"assets/music/tekken.mp3",life:"assets/music/life.mp3"};
const NAMES={sonic:"Sonic Mega Collection — Games Menu",tekken:"Tekken 4 — Jet (Character Select)",life:"Life Is Strange — End Credits (Max & Chloe)"};
const $=s=>document.querySelector(s);
let S;try{S=JSON.parse(localStorage.getItem('cv5'))}catch(e){}
S=S||{folders:[{id:'acao',name:'Ação',music:'tekken'},{id:'emo',name:'Emocional',music:'life'}],geral:{music:'sonic'},movies:[]};
const save=()=>{try{localStorage.setItem('cv5',JSON.stringify(S))}catch(e){}};
let db;const idb=()=>db||(db=new Promise((ok,no)=>{const r=indexedDB.open('cinevault',1);r.onupgradeneeded=()=>r.result.createObjectStore('b');r.onsuccess=()=>ok(r.result);r.onerror=()=>no()}));
const put=async(k,v)=>{try{const d=await idb();return await new Promise(r=>{const t=d.transaction('b','readwrite');t.objectStore('b').put(v,k);t.oncomplete=()=>r(1);t.onerror=()=>r(0)})}catch(e){return 0}};
const get=async k=>{try{const d=await idb();return await new Promise(r=>{const q=d.transaction('b').objectStore('b').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r()})}catch(e){}};
const urls={};const blobUrl=async k=>urls[k]||(urls[k]=await get(k).then(b=>b&&URL.createObjectURL(b)));
const uid=()=>Math.random().toString(36).slice(2,9);
const toast=t=>{const e=$('#toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',4500)};
let cur='geral',pick=null;
const folderName=id=>id==='geral'?'Geral':(S.folders.find(f=>f.id===id)||{}).name;
const musicOf=id=>id==='geral'?S.geral.music:(S.folders.find(f=>f.id===id)||{}).music;
function nav(){
  const n=$('#nav');n.innerHTML='';
  [{id:'geral',name:'Geral',i:'⌂'},...S.folders.map(f=>({...f,i:'▤'}))].forEach(f=>{
    const d=document.createElement('div');d.className='nav-item'+(f.id===cur?' active':'');
    const c=f.id==='geral'?S.movies.length:S.movies.filter(m=>m.folder===f.id).length;
    d.innerHTML=`<span class="nav-icon">${f.i}</span>${f.name}<span class="nav-count">${c}</span>`;
    d.onclick=()=>{cur=f.id;render();setBgm()};n.appendChild(d)});
}
async function render(){
  nav();$('#title').textContent=folderName(cur);
  const q=$('#q').value.toLowerCase();
  const ms=S.movies.filter(m=>(cur==='geral'||m.folder===cur)&&m.title.toLowerCase().includes(q));
  $('#count').textContent=ms.length+' filme(s) · '+folderName(cur);
  const h=ms.find(m=>m.hl),hero=$('#hero');hero.innerHTML='';
  if(h){const u=h.cover&&await blobUrl(h.cover);
    hero.innerHTML=`<div class="hero" style="${u?`background-image:url(${u})`:'background:var(--accent-soft)'}"><div class="hero-in"><div class="tag">★ Destaque</div><h2></h2><button class="btn pri">▶ Assistir</button></div></div>`;
    hero.querySelector('h2').textContent=h.title;hero.querySelector('button').onclick=()=>play(h)}
  const L=$('#list');L.innerHTML=ms.length?'':'<div class="empty">Nenhum filme aqui ainda. Adicione arquivos de vídeo ou links.</div>';
  for(const m of ms){
    const u=m.cover&&await blobUrl(m.cover);
    const d=document.createElement('div');d.className='post'+(m.hl?' hl':'');
    d.innerHTML=`<div class="post-body"><div class="post-title"></div><div class="post-meta"></div><div class="row"><button class="btn" data-a="p">▶ Assistir</button><button class="btn" data-a="h">${m.hl?'★ Destaque':'☆ Destacar'}</button><button class="btn" data-a="c">Trocar capa</button><select title="Mover para pasta"></select><button class="btn" data-a="x">Remover</button></div></div><div class="post-thumb" ${u?`style="background-image:url(${u})"`:''}>${u?'':'🎬'}</div>`;
    d.querySelector('.post-title').textContent=m.title;
    d.querySelector('.post-meta').textContent=folderName(m.folder)+(m.link?' · link':'');
    const sel=d.querySelector('select');
    S.folders.forEach(f=>sel.add(new Option('📁 '+f.name,f.id,0,f.id===m.folder)));
    sel.onchange=()=>{m.folder=sel.value;save();render()};
    d.querySelector('.post-thumb').onclick=()=>play(m);
    d.onclick=e=>{const a=e.target.dataset.a;if(!a)return;
      if(a==='p')play(m);
      if(a==='h'){const v=!m.hl;S.movies.forEach(x=>x.hl=0);m.hl=v;save();render()}
      if(a==='c'){pick={t:'cover',m};$('#fCover').click()}
      if(a==='x'){S.movies=S.movies.filter(x=>x!==m);save();render()}};
    L.appendChild(d)}
}
/* música de fundo */
const A=$('#bgm');let userPaused=false,started=false;
async function setBgm(){
  const k=musicOf(cur);let src,name;
  if(BUILTIN[k]){src=BUILTIN[k];name=NAMES[k]}else{src=await blobUrl(k);name=(S.names&&S.names[k])||'Música personalizada'}
  $('#bgmName').textContent=name;
  if(src&&A.dataset.k!==k){A.dataset.k=k;A.src=src}
  if(started&&!userPaused&&!$('#modal').classList.contains('on'))A.play().catch(()=>{});
  tg();
}
const tg=()=>$('#bgmToggle').textContent=A.paused?'⏵ Tocar':'⏸ Pausar';
A.onplay=A.onpause=tg;
$('#bgmToggle').onclick=()=>{started=true;if(A.paused){userPaused=false;A.play().catch(()=>{})}else{userPaused=true;A.pause()}};
$('#bgmChange').onclick=()=>{pick={t:'music',id:cur};$('#fMusic').click()};
addEventListener('pointerdown',()=>{if(!started){started=true;if(!userPaused)A.play().catch(()=>{})}},{once:true});
/* arquivos */
$('#fMusic').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!pick)return;
  const k='m'+uid();await put(k,f);S.names=S.names||{};S.names[k]=f.name.replace(/\.[^.]+$/,'');
  if(pick.id==='geral')S.geral.music=k;else S.folders.find(x=>x.id===pick.id).music=k;
  save();A.dataset.k='';started=true;userPaused=false;setBgm();toast('Música da pasta trocada.')};
$('#fCover').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!pick)return;
  const k='c'+uid();await put(k,f);pick.m.cover=k;save();render()};
$('#addMovies').onclick=()=>{if(!S.folders.length)return toast('Crie uma pasta primeiro.');$('#fMovies').click()};
$('#fMovies').onchange=async e=>{const fs=[...e.target.files];e.target.value='';
  const folder=cur==='geral'?S.folders[0].id:cur;
  for(const f of fs){const k='v'+uid();if(!await put(k,f)){toast('Não foi possível guardar '+f.name+' (espaço do navegador).');continue}
    S.movies.push({id:uid(),title:f.name.replace(/\.[^.]+$/,'').replace(/[._]+/g,' '),folder,file:k})}
  save();render();if(cur==='geral')toast('Adicionado à pasta '+folderName(folder)+'. Use o seletor 📁 para mover.')};
$('#addLink').onclick=()=>{const u=prompt('Cole o link direto do vídeo (.mp4, .webm...):');if(!u)return;
  const t=prompt('Título do filme:')||u;S.movies.push({id:uid(),title:t,folder:cur==='geral'?S.folders[0].id:cur,link:u});save();render()};
$('#addFolder').onclick=()=>{const n=prompt('Nome do gênero (ex.: Terror):');if(!n)return;
  const id=uid();S.folders.push({id,name:n,music:S.geral.music});save();cur=id;render();setBgm()};
$('#q').oninput=render;
/* player + chromecast */
const V=$('#vid');let wasPlaying=false;
async function play(m){
  const src=m.link||await blobUrl(m.file);if(!src)return toast('Arquivo não encontrado. Adicione de novo.');
  wasPlaying=!A.paused;A.pause();V.src=src;$('#mTitle').textContent=m.title;$('#modal').classList.add('on');V.play().catch(()=>{});
}
$('#close').onclick=()=>{V.pause();V.removeAttribute('src');V.load();$('#modal').classList.remove('on');if(wasPlaying)A.play().catch(()=>{})};
$('#cast').onclick=async()=>{
  if(!('remote' in V))return toast('Este navegador não tem transmissão direta. No Chrome/Edge, use ⋮ → Transmitir… e escolha a aba.');
  try{await V.remote.prompt()}catch(err){
    toast(err&&err.name==='NotSupportedError'?'Arquivo local não pode ser enviado direto ao Chromecast. Use ⋮ → Transmitir… (aba) ou adicione o filme por link.':'Nenhum Chromecast escolhido ou encontrado na rede.')}};
render();setBgm();
