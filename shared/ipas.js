/* Virtual IPAS Lab · Qonuni 2 · Semester 1 — mesin halaman, kuis, dan simulasi.
   Catatan desain: tidak ada gambar/ikon makhluk bernyawa (orang/hewan), sesuai adab materi Kuttab. */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const PFX='ipasq2s1:';
const store={get(k){try{const v=localStorage.getItem(PFX+k);return v==null?null:JSON.parse(v);}catch(e){return null;}},set(k,v){try{localStorage.setItem(PFX+k,JSON.stringify(v));}catch(e){}}};
let VO=null; const pickV=()=>{try{const vs=speechSynthesis.getVoices();VO=vs.find(v=>/^id/i.test(v.lang))||null;}catch(e){}};
try{speechSynthesis.onvoiceschanged=pickV;pickV();}catch(e){}
function say(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/[“”"]/g,''));u.lang='id-ID';if(VO)u.voice=VO;u.rate=.92;speechSynthesis.speak(u);}catch(e){}}
const sp=(t,l='🔊')=>`<button class="say" data-say="${esc(t)}" aria-label="Dengarkan">${l}</button>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b){e.preventDefault();say(b.dataset.say);}});
const BAB={1:['Mengubah Bentuk Energi','⚡'],2:['Gaya di Sekitar Kita','🧲'],3:['Di Sini Tempat Tinggalku','🏡'],4:['Iklim dan Perubahannya','🌦️']};
const alive=el=>document.body.contains(el);
const praise=()=>shuf(['MasyaAllah, hebat!','Barakallahu fiik!','Alhamdulillah, tepat!','Bagus sekali!'])[0];
const fin=(el,msg,again)=>{el.insertAdjacentHTML('beforeend',`<div class="fb ok">🎉 ${msg} ${again?'<button class="btn soft again" style="margin-left:6px">🔁 Ulangi</button>':''}</div>`);if(again)$('.again',el).onclick=again;};

/* ---------- widget umum ---------- */
const W={};
W.order=(el,c)=>{ let a; do{a=shuf(c.steps.map((s,i)=>i));}while(a.every((v,i)=>v===i)&&c.steps.length>1);
  const draw=(chk)=>{ el.innerHTML=`<ol class="ordl">${a.map((k,i)=>`<li class="${chk?(k===i?'good':'no'):''}"><span class="n">${i+1}</span><span class="e" style="font-size:1.5rem">${c.steps[k][0]}</span><span class="t">${esc(c.steps[k][1])}</span><span class="mv"><button data-u="${i}" aria-label="naik">▲</button><button data-d="${i}" aria-label="turun">▼</button></span></li>`).join('')}</ol><div class="row" style="margin-top:10px"><button class="btn" id="oc">✔️ Periksa urutan</button></div><div class="ofb"></div>`;
    $$('[data-u]',el).forEach(b=>b.onclick=()=>{const i=+b.dataset.u;if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];draw();}});
    $$('[data-d]',el).forEach(b=>b.onclick=()=>{const i=+b.dataset.d;if(i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];draw();}});
    $('#oc',el).onclick=()=>{ const ok=a.every((k,i)=>k===i); draw(true); const f=$('.ofb',el);
      if(ok){ f.innerHTML=`<div class="fb ok">✅ ${praise()} Urutannya benar.</div>`; say(c.steps.map(s=>s[1]).join('. ')); }
      else f.innerHTML=`<div class="fb no">Ada ${a.filter((k,i)=>k!==i).length} langkah yang belum tepat (bergaris merah). Pindahkan dengan ▲ ▼, lalu periksa lagi.</div>`; }; };
  draw(); };

W.sort=(el,c)=>{ const items=shuf(c.items.map((x,i)=>({...{e:x[0],t:x[1],b:x[2]},i}))); let sel=null, miss=0, done=0;
  el.innerHTML=`<p class="muted">Ketuk satu kartu, lalu ketuk kotak tujuannya.</p><div class="pool">${items.map(x=>`<button class="tok" data-i="${x.i}">${x.e} ${esc(x.t)}</button>`).join('')}</div><div class="bins">${c.bins.map((b,k)=>`<div class="bin" data-b="${k}" role="button" tabindex="0"><h4>${b[0]} ${esc(b[1])}</h4><div class="in"></div></div>`).join('')}</div><div class="sfb"></div>`;
  const pool=$('.pool',el);
  $$('.pool .tok',el).forEach(t=>t.onclick=()=>{ $$('.pool .tok',el).forEach(x=>x.classList.remove('sel')); t.classList.add('sel'); sel=t; say(c.items[+t.dataset.i][1]); });
  $$('.bin',el).forEach(b=>b.onclick=()=>{ if(!sel) { $('.sfb',el).innerHTML='<div class="fb no">Pilih dulu satu kartu di atas.</div>'; return; }
    const it=c.items[+sel.dataset.i], k=+b.dataset.b;
    if(it[2]===k){ sel.classList.remove('sel'); sel.classList.add('good'); $('.in',b).appendChild(sel); sel.onclick=null; sel=null; done++; $('.sfb',el).innerHTML='';
      if(done===c.items.length){ const s=Math.max(0,Math.round((c.items.length-miss)/c.items.length*100)); fin(el,`Semua kartu sudah di tempatnya! Salah tempat: ${miss} kali.`,()=>W.sort(el,c)); say('Alhamdulillah, selesai!'); } }
    else { miss++; sel.classList.add('no'); const s2=sel; setTimeout(()=>s2.classList.remove('no'),450); $('.sfb',el).innerHTML=`<div class="fb no">Belum tepat. “${esc(it[1])}” bukan termasuk ${esc(c.bins[k][1])}. Coba kotak lain!</div>`; } }); };

W.match=(el,c)=>{ const L=shuf(c.pairs.map((p,i)=>i)), R=shuf(c.pairs.map((p,i)=>i)); let sel=null, done=0, miss=0;
  el.innerHTML=`<div class="pairs"><div>${L.map(i=>`<button class="tok" data-l="${i}">${c.pairs[i][0]} ${esc(c.pairs[i][1])}</button>`).join('')}</div><div>${R.map(i=>`<button class="tok" data-r="${i}">${esc(c.pairs[i][2])}</button>`).join('')}</div></div><div class="mfb"></div>`;
  $$('[data-l]',el).forEach(b=>b.onclick=()=>{ if(b.classList.contains('good'))return; $$('[data-l]',el).forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=+b.dataset.l; say(c.pairs[sel][1]); });
  $$('[data-r]',el).forEach(b=>b.onclick=()=>{ if(sel==null||b.classList.contains('good'))return; const r=+b.dataset.r, lb=$(`[data-l="${sel}"]`,el);
    if(r===sel){ b.classList.add('good'); lb.classList.add('good'); lb.classList.remove('sel'); done++; $('.mfb',el).innerHTML=`<div class="fb ok">✅ ${esc(c.pairs[r][1])} — ${esc(c.pairs[r][2])}</div>`; say(c.pairs[r][1]+', '+c.pairs[r][2]); sel=null;
      if(done===c.pairs.length) fin(el,`${praise()} Semua pasangan cocok. Salah pilih: ${miss} kali.`,()=>W.match(el,c)); }
    else { miss++; b.classList.add('no'); setTimeout(()=>b.classList.remove('no'),450); } }); };

W.flash=(el,c)=>{ const Q=shuf(c.items); let i=0, sc=0;
  const show=()=>{ if(!alive(el))return; if(i>=Q.length){ const s=Math.round(sc/Q.length*100); el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">${s>=80?'🏆':s>=60?'🌟':'🌱'}</div><div class="big">${sc} dari ${Q.length} benar</div><button class="btn" id="fa">🔁 Main lagi</button></div>`; $('#fa',el).onclick=()=>W.flash(el,c); return; }
    const q=Q[i]; el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="muted">Soal ${i+1}/${Q.length}</span><span class="score">⭐ ${sc}</span></div><div class="prog"><i style="width:${i/Q.length*100}%"></i></div><div class="stage" style="text-align:center"><div class="huge">${q[0]}</div><div class="big">${esc(q[1])}</div></div><div class="opts">${c.opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div><div class="ffb"></div>`;
    say(q[1]);
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.k===q[2]; if(ok)sc++; $$('.opt',el).forEach(x=>{x.disabled=true;if(+x.dataset.k===q[2])x.classList.add('good');}); if(!ok)b.classList.add('no');
      $('.ffb',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ '+praise():'❌ Jawabannya: '+esc(c.opts[q[2]])} <span class="muted">${esc(q[3]||'')}</span></div><button class="btn" id="fn">Lanjut →</button>`; $('#fn',el).onclick=()=>{i++;show();}; }); };
  show(); };

/* ---------- simulasi khusus ---------- */
const EF={kimia:['🧪','kimia'],listrik:['⚡','listrik'],cahaya:['💡','cahaya'],gerak:['🔄','gerak'],panas:['🔥','panas'],bunyi:['🔊','bunyi']};
const efTile=(k,show)=>`<span class="ef k-${k} ${show?'show':''}"><span class="e">${EF[k][0]}</span>${EF[k][1]}</span>`;
const chainTxt=ch=>ch.map(s=>Array.isArray(s)?s.join(' dan '):s).join(' → ');
W.chain=(el,c)=>{ let cur=0, solved=new Set(store.get('chain3')||[]), build=[];
  const draw=()=>{ const d=c.devices[cur], ch=d[2];
    el.innerHTML=`<div class="devs">${c.devices.map((x,i)=>`<button class="dev ${i===cur?'on':''}" data-i="${i}"><span class="e">${x[0]}</span>${esc(x[1])}${solved.has(i)?' ✅':''}</button>`).join('')}</div>
     <div class="simbox" style="margin-top:12px"><div class="huge" id="dvi" style="transition:.3s">${d[0]}</div><div class="big">${esc(d[1])}</div>
      <button class="btn" id="on" style="margin:8px 0">▶️ Nyalakan & amati</button>
      <div class="chainv" id="cv"></div><p class="muted" id="cn"></p></div>
     <div class="stage"><b>🧩 Susun sendiri rantai energi ${esc(d[1])}:</b> ketuk bentuk energi sesuai urutan.<div class="row" style="margin:8px 0">${Object.keys(EF).map(k=>`<button class="tok" data-ef="${k}">${EF[k][0]} ${EF[k][1]}</button>`).join('')}</div>
      <div class="chainv" id="bv" style="min-height:50px;background:var(--card);border-radius:14px;padding:6px"></div><div class="row"><button class="btn soft" id="bx">↩️ Hapus</button><button class="btn" id="bc">✔️ Periksa</button></div><div id="bfb"></div></div>
     <p class="muted">Rantai terpecahkan: <b>${solved.size}/${c.devices.length}</b> alat.</p>`;
    $$('.dev',el).forEach(b=>b.onclick=()=>{cur=+b.dataset.i;build=[];draw();});
    $('#on',el).onclick=()=>{ const cv=$('#cv',el); const flat=[]; ch.forEach(s=>Array.isArray(s)?flat.push(s):flat.push([s]));
      cv.innerHTML=flat.map((g,i)=>(i?'<span class="arr">➜</span>':'')+g.map(k=>efTile(k)).join('<span class="arr">+</span>')).join('');
      $$('.ef',cv).forEach((t,i)=>setTimeout(()=>t.classList.add('show'),300+i*550)); $('#dvi',el).style.transform='scale(1.15)'; setTimeout(()=>{const x=$('#dvi',el); if(x)x.style.transform='';},700);
      $('#cn',el).textContent='Energi '+chainTxt(ch)+'.'; say(d[1]+'. Energi '+chainTxt(ch)); };
    const bdraw=()=>{ $('#bv',el).innerHTML=build.map((k,i)=>(i?'<span class="arr">➜</span>':'')+efTile(k,1)).join('')||'<span class="muted">(kosong)</span>'; }; bdraw();
    $$('[data-ef]',el).forEach(b=>b.onclick=()=>{ if(build.length<4){build.push(b.dataset.ef);bdraw();} });
    $('#bx',el).onclick=()=>{build.pop();bdraw();};
    $('#bc',el).onclick=()=>{ const head=ch.slice(0,-1), last=ch[ch.length-1], L=Array.isArray(last)?last:[last];
      const ok=build.length===head.length+L.length && head.every((k,i)=>build[i]===k) && L.every(k=>build.slice(head.length).includes(k));
      if(ok){ solved.add(cur); store.set('chain3',[...solved]); $('#bfb',el).innerHTML=`<div class="fb ok">✅ ${praise()} ${esc(d[1])}: ${chainTxt(ch)}.</div>`; say(praise()); setTimeout(()=>{ if(alive(el)){ const nx=c.devices.findIndex((x,i)=>!solved.has(i)); if(nx>=0){cur=nx;build=[];draw();} else { draw(); fin(el,'Semua rantai energi sudah kamu susun!'); } } },1400); }
      else $('#bfb',el).innerHTML=`<div class="fb no">Belum tepat. Petunjuk: tekan ▶️ Nyalakan untuk mengamati, lalu susun lagi.</div>`; }; };
  draw(); };

W.kincir=(el)=>{ const CON=[['⏸️','Kincir diam, tidak ditiup',0],['🌬️','Ditiup pelan',1.2],['💨','Ditiup kencang',4.5],['➡️','Dibawa berjalan cepat',2.6]];
  let speed=0, ang=0, res={}, raf;
  el.innerHTML=`<div class="simbox"><svg viewBox="0 0 300 230" width="300" aria-label="Kincir kertas"><g id="wind" stroke="#7fb3d5" stroke-width="3" stroke-linecap="round" opacity="0"><line x1="10" y1="70" x2="60" y2="70"/><line x1="20" y1="100" x2="80" y2="100"/><line x1="5" y1="130" x2="55" y2="130"/></g>
     <line x1="150" y1="100" x2="150" y2="225" stroke="#a8743c" stroke-width="7" stroke-linecap="round"/>
     <g id="pw" transform="rotate(0 150 100)"><path d="M150 100 L150 30 L190 60 Z" fill="#e05d4b"/><path d="M150 100 L220 100 L190 140 Z" fill="#f2b632"/><path d="M150 100 L150 170 L110 140 Z" fill="#2f63b0"/><path d="M150 100 L80 100 L110 60 Z" fill="#2a8a52"/></g>
     <circle cx="150" cy="100" r="7" fill="#555"/></svg>
     <div class="big" id="kst">Pilih keadaan di bawah</div><div class="row" style="justify-content:center;margin-top:6px">${CON.map((x,i)=>`<button class="btn ghost" data-c="${i}">${x[0]} ${x[1]}</button>`).join('')}</div>
     <label class="muted" style="display:block;margin-top:10px">Atau atur sendiri kekuatan angin: <input type="range" class="slider" id="ks" min="0" max="50" value="0"></label></div>
   <table class="t tbl-mini"><tr><th>Keadaan</th><th>Berputar?</th><th>Cepat / Lambat</th></tr>${CON.map((x,i)=>`<tr><td>${x[1]}</td><td id="r${i}a">–</td><td id="r${i}b">–</td></tr>`).join('')}</table><div id="kq"></div>`;
  const set=(v,label)=>{ speed=v; $('#wind',el).setAttribute('opacity',Math.min(1,v/3)); $('#kst',el).textContent=label+(v===0?' → kincir diam':v<2?' → berputar lambat':' → berputar cepat'); };
  $$('[data-c]',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.c, x=CON[i]; set(x[2],x[1]); $('#ks',el).value=x[2]*10; res[i]=1; $(`#r${i}a`,el).textContent=x[2]?'Ya':'Tidak'; $(`#r${i}b`,el).textContent=x[2]===0?'–':x[2]<2?'Lambat':'Cepat'; say(x[1]); if(Object.keys(res).length===4&&!$('#kq',el).innerHTML) ask(); });
  $('#ks',el).oninput=e=>set(+e.target.value/10,'Angin buatanmu');
  const ask=()=>{ const o=shuf([['energi angin → energi gerak',1],['energi listrik → energi cahaya',0],['energi gerak → energi angin',0]]);
    $('#kq',el).innerHTML=`<div class="stage"><b>Kesimpulan:</b> kincir berputar karena ...<div class="opts" style="margin-top:8px">${o.map(x=>`<button class="opt" data-ok="${x[1]}">${x[0]}</button>`).join('')}</div><div id="kqf"></div></div>`;
    $$('#kq .opt',el).forEach(b=>b.onclick=()=>{ const ok=b.dataset.ok==='1'; b.classList.add(ok?'good':'no'); $('#kqf',el).innerHTML=ok?`<div class="fb ok">✅ ${praise()} Energi angin (gerak udara) berubah menjadi energi gerak. Makin kencang angin, makin cepat kincir berputar.</div>`:'<div class="fb no">Coba lagi. Apa yang mendorong baling-baling?</div>'; }); };
  const loop=()=>{ if(!alive(el)) return; ang=(ang+speed*4)%360; const g=$('#pw',el); if(g) g.setAttribute('transform',`rotate(${ang} 150 100)`); raf=requestAnimationFrame(loop); }; loop(); };

W.dorong=(el,c)=>{ let x=50;
  el.innerHTML=`<div class="simbox"><div style="position:relative;height:110px;background:linear-gradient(#0000 75%,var(--line) 75%);border-radius:12px;overflow:hidden">
     <div style="position:absolute;left:8px;bottom:30px;font-weight:900;font-size:.85rem;text-align:center">📍<br>kamu</div>
     <div id="box" style="position:absolute;bottom:26px;left:50%;font-size:3rem;transition:left .7s cubic-bezier(.2,.8,.3,1);transform:translateX(-50%)">📦</div>
     <div id="arw" style="position:absolute;top:6px;left:0;right:0;font-weight:900;color:var(--acc)"></div></div>
     <div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pd">➡️ Dorong</button><button class="btn gold" id="pt">⬅️ Tarik</button><button class="btn ghost" id="pr">↺ Kembalikan</button></div></div>
   <h3 style="margin-top:14px">📋 Lembar observasi: dorong atau tarik?</h3><div id="obs"></div>`;
  const mv=(d)=>{ x=Math.max(18,Math.min(88,x+d)); $('#box',el).style.left=x+'%'; $('#arw',el).textContent=d>0?'Gaya dorong → kotak bergerak MENJAUH darimu':'Gaya tarik → kotak bergerak MENDEKAT kepadamu'; say(d>0?'Dorong, benda menjauh':'Tarik, benda mendekat'); };
  $('#pd',el).onclick=()=>mv(22); $('#pt',el).onclick=()=>mv(-22); $('#pr',el).onclick=()=>{x=50;$('#box',el).style.left='50%';$('#arw',el).textContent='';};
  let done=0; $('#obs',el).innerHTML=c.acts.map((a,i)=>`<div class="qi"><div class="qq">${a[0]} ${esc(a[1])}</div><div class="bsb"><button data-i="${i}" data-v="0">➡️ Dorong</button><button data-i="${i}" data-v="1">⬅️ Tarik</button></div><div class="ex" id="ox${i}"></div></div>`).join('');
  $$('#obs .bsb button',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i, a=c.acts[i]; if($(`#ox${i}`,el).textContent) return; const ok=+b.dataset.v===a[2];
    b.classList.add(ok?'good':'no'); if(!ok) $(`#obs [data-i="${i}"][data-v="${a[2]}"]`,el).classList.add('good');
    $(`#ox${i}`,el).innerHTML=(ok?'✅ ':'❌ ')+(a[2]?'Tarik → benda mendekat.':'Dorong → benda menjauh.'); done++; if(done===c.acts.length) fin(el,'Kesimpulan: gaya dorong membuat benda menjauh, gaya tarik membuat benda mendekat.'); }); };

W.gesek=(el)=>{ const S=[['🪟','Kaca','halus',125],['🧱','Lantai keramik','halus',92],['🪵','Meja kayu','agak kasar',58],['🧶','Keset / karpet','kasar',16]]; let cur=0, res={};
  el.innerHTML=`<div class="row">${S.map((s,i)=>`<button class="btn ghost" data-s="${i}">${s[0]} ${s[1]}</button>`).join('')}</div>
   <div class="simbox" style="margin-top:10px"><div id="trk" style="position:relative;height:90px;border-radius:12px;overflow:hidden;background:#cfe7f5">
     <div id="bk" style="position:absolute;left:2%;bottom:16px;font-size:2.4rem;transition:left 1.6s cubic-bezier(.15,.85,.35,1)">📘</div>
     <div style="position:absolute;left:0;right:0;bottom:0;height:16px;background:repeating-linear-gradient(90deg,#0002 0 2px,#0000 2px 10%)"></div></div>
     <div class="big" id="gs" style="margin-top:6px">Permukaan: ${S[0][1]}</div><button class="btn" id="gp">➡️ Dorong buku (sama kuat)</button></div>
   <table class="t tbl-mini"><tr><th>Permukaan</th><th>Halus / Kasar</th><th>Mudah / Sulit</th><th>Jarak meluncur</th></tr>${S.map((s,i)=>`<tr><td>${s[0]} ${s[1]}</td><td id="g${i}a">–</td><td id="g${i}b">–</td><td id="g${i}c">–</td></tr>`).join('')}</table><div id="gq"></div>`;
  const tex={0:'#cfe7f5',1:'#efe6d6',2:'#c99a63',3:'repeating-linear-gradient(45deg,#b84f3a 0 6px,#d77a52 6px 12px)'};
  const pick=i=>{ cur=i; $('#trk',el).style.background=tex[i]; $('#bk',el).style.transition='none'; $('#bk',el).style.left='2%'; $('#gs',el).textContent='Permukaan: '+S[i][1]; $$('[data-s]',el).forEach((b,k)=>b.className='btn '+(k===i?'':'ghost')); };
  $$('[data-s]',el).forEach(b=>b.onclick=()=>pick(+b.dataset.s)); pick(0);
  $('#gp',el).onclick=()=>{ const s=S[cur], bk=$('#bk',el); bk.style.transition='none'; bk.style.left='2%'; void bk.offsetWidth; bk.style.transition='left 1.6s cubic-bezier(.15,.85,.35,1)'; bk.style.left=(2+s[3]*0.6)+'%';
    setTimeout(()=>{ if(!alive(el))return; $(`#g${cur}a`,el).textContent=s[2]; $(`#g${cur}b`,el).textContent=s[3]>80?'Mudah':s[3]>40?'Sedang':'Sulit'; $(`#g${cur}c`,el).textContent=s[3]+' cm'; res[cur]=1; say(s[1]+', meluncur '+s[3]+' sentimeter');
      if(Object.keys(res).length===4&&!$('#gq',el).innerHTML){ $('#gq',el).innerHTML=`<div class="stage"><b>Kesimpulan:</b> makin kasar permukaan, gaya geseknya makin ...<div class="opts" style="margin-top:8px"><button class="opt" data-ok="1">besar, sehingga benda makin sulit didorong</button><button class="opt" data-ok="0">kecil, sehingga benda makin mudah didorong</button></div><div id="gqf"></div></div>`;
        $$('#gq .opt',el).forEach(b=>b.onclick=()=>{const ok=b.dataset.ok==='1';b.classList.add(ok?'good':'no');$('#gqf',el).innerHTML=ok?`<div class="fb ok">✅ ${praise()} Karpet paling kasar, jadi buku paling cepat berhenti.</div>`:'<div class="fb no">Lihat lagi tabelmu: di karpet buku meluncur paling dekat.</div>';}); } },1650); }; };

W.magnet=(el,c)=>{ let res={};
  el.innerHTML=`<h3>1️⃣ Uji benda dengan magnet</h3><div class="devs">${c.items.map((x,i)=>`<button class="dev" data-i="${i}"><span class="e">${x[0]}</span>${esc(x[1])}<br><small class="muted">${esc(x[2])}</small></button>`).join('')}</div>
   <div class="simbox" style="margin-top:10px"><div style="position:relative;height:96px"><div id="mg" style="position:absolute;left:8%;top:18px;font-size:3rem">🧲</div><div id="it" style="position:absolute;left:70%;top:24px;font-size:2.4rem;transition:left .6s cubic-bezier(.5,0,.3,1)"></div></div><div class="big" id="mt">Ketuk satu benda, lalu dekatkan magnet.</div><button class="btn" id="mn" disabled>🧲 Dekatkan magnet</button></div>
   <table class="t tbl-mini"><tr><th>Benda</th><th>Bahan</th><th>Ditarik magnet?</th></tr>${c.items.map((x,i)=>`<tr><td>${x[0]} ${esc(x[1])}</td><td>${esc(x[2])}</td><td id="m${i}">–</td></tr>`).join('')}</table><div id="mq"></div>
   <h3 style="margin-top:16px">2️⃣ Kutub magnet: tarik-menarik atau tolak-menolak?</h3>
   <div class="simbox"><svg viewBox="0 0 320 90" width="320"><g id="m1"><rect x="20" y="25" width="55" height="40" fill="#d64545" rx="4"/><rect x="75" y="25" width="55" height="40" fill="#2f63b0" rx="4"/><text x="47" y="52" fill="#fff" font-weight="900" font-size="18" text-anchor="middle">U</text><text x="102" y="52" fill="#fff" font-weight="900" font-size="18" text-anchor="middle">S</text></g>
     <g id="m2" style="transition:transform .7s"><rect x="190" y="25" width="55" height="40" id="m2a" rx="4"/><rect x="245" y="25" width="55" height="40" id="m2b" rx="4"/><text x="217" y="52" fill="#fff" font-weight="900" font-size="18" text-anchor="middle" id="m2ta"></text><text x="272" y="52" fill="#fff" font-weight="900" font-size="18" text-anchor="middle" id="m2tb"></text></g></svg>
     <div class="big" id="pt">Kutub yang berhadapan: S dan ?</div><div class="row" style="justify-content:center"><button class="btn ghost" id="pf">🔄 Balik magnet kanan</button><button class="btn" id="pa">↔️ Dekatkan</button></div></div>
   <h3 style="margin-top:16px">3️⃣ Gaya gravitasi: lepaskan benda!</h3>
   <div class="simbox"><div id="drop" style="position:relative;height:190px;background:linear-gradient(#0000 88%,#a8743c 88%);border-radius:12px;overflow:hidden"></div><div class="row" style="justify-content:center;margin-top:8px">${[['✏️','Pensil',.55],['📄','Kertas lembaran',2.6],['🧻','Kertas diremas',.6],['⚽','Bola',.55]].map(d=>`<button class="btn ghost" data-dr="${d[0]}|${d[1]}|${d[2]}">${d[0]} ${d[1]}</button>`).join('')}</div><p class="muted" id="dt">Semua benda ditarik bumi ke bawah. Kertas lembaran jatuh lebih pelan karena tertahan udara, tetapi tetap jatuh.</p></div>`;
  let sel=null; $$('[data-i]',el).forEach(b=>b.onclick=()=>{ sel=+b.dataset.i; $$('[data-i]',el).forEach(x=>x.classList.toggle('on',x===b)); const it=$('#it',el); it.style.transition='none'; it.style.left='70%'; it.textContent=c.items[sel][0]; $('#mt',el).textContent=c.items[sel][1]+' ('+c.items[sel][2]+')'; $('#mn',el).disabled=false; });
  $('#mn',el).onclick=()=>{ if(sel==null)return; const x=c.items[sel], it=$('#it',el); it.style.transition='left .6s cubic-bezier(.5,0,.3,1)';
    if(x[3]){ it.style.left='22%'; $('#mt',el).textContent='✅ '+x[1]+' DITARIK magnet! ('+x[2]+')'; } else { it.style.left='66%'; setTimeout(()=>{ if(alive(el)) it.style.left='70%'; },300); $('#mt',el).textContent='✖️ '+x[1]+' tidak ditarik magnet ('+x[2]+')'; }
    say(x[1]+(x[3]?' ditarik magnet':' tidak ditarik magnet')); $(`#m${sel}`,el).textContent=x[3]?'Ya':'Tidak'; res[sel]=1;
    if(Object.keys(res).length===c.items.length&&!$('#mq',el).innerHTML){ $('#mq',el).innerHTML=`<div class="stage"><b>Kesimpulan:</b> benda yang ditarik magnet biasanya terbuat dari ...<div class="opts" style="margin-top:8px"><button class="opt" data-ok="1">besi dan baja</button><button class="opt" data-ok="0">semua jenis logam</button><button class="opt" data-ok="0">kayu dan plastik</button></div><div id="mqf"></div></div>`;
      $$('#mq .opt',el).forEach(b=>b.onclick=()=>{const ok=b.dataset.ok==='1';b.classList.add(ok?'good':'no');$('#mqf',el).innerHTML=ok?`<div class="fb ok">✅ ${praise()} Ingat: kaleng aluminium juga logam, tetapi tidak ditarik magnet.</div>`:'<div class="fb no">Perhatikan kaleng aluminium: logam, tetapi tidak ditarik.</div>';}); } };
  let flip=false; const pdraw=()=>{ const a=flip?['S','#2f63b0']:['U','#d64545'], b=flip?['U','#d64545']:['S','#2f63b0']; $('#m2a',el).setAttribute('fill',a[1]); $('#m2b',el).setAttribute('fill',b[1]); $('#m2ta',el).textContent=a[0]; $('#m2tb',el).textContent=b[0]; $('#m2',el).style.transform=''; $('#pt',el).textContent=`Kutub yang berhadapan: S dan ${a[0]}`; };
  pdraw(); $('#pf',el).onclick=()=>{flip=!flip;pdraw();};
  $('#pa',el).onclick=()=>{ const face=flip?'S':'U', att=face!=='S'; $('#m2',el).style.transform=att?'translateX(-58px)':'translateX(24px)'; $('#pt',el).textContent=att?'S bertemu U → TARIK-MENARIK (kutub berbeda)':'S bertemu S → TOLAK-MENOLAK (kutub sejenis)'; say(att?'Tarik menarik':'Tolak menolak'); };
  $$('[data-dr]',el).forEach(b=>b.onclick=()=>{ const [e,n,t]=b.dataset.dr.split('|'), box=$('#drop',el); const d=document.createElement('div'); d.textContent=e; d.style.cssText=`position:absolute;top:4px;left:${15+Math.random()*65}%;font-size:2rem;transition:top ${t}s ${+t>1?'ease-in-out':'cubic-bezier(.55,0,1,.45)'}${+t>1?',transform '+t+'s':''}`; box.appendChild(d); void d.offsetWidth; d.style.top='140px'; if(+t>1) d.style.transform='rotate(25deg) translateX(20px)';
    $('#dt',el).textContent=n+(+t>1?' jatuh pelan dan melayang-layang (tertahan udara), tetapi tetap ke bawah.':' jatuh cepat ke bawah karena gaya gravitasi.'); say(n+' jatuh ke bawah'); setTimeout(()=>d.remove(),Math.max(2500,t*1000+1500)); }); };

W.pos=(el)=>{ const EFX=['menggerakkan benda diam','mempercepat gerak','memperlambat / menghentikan','mengubah arah','mengubah bentuk'];
  const P=[['⚽','Pos 1A: Bola diam','Dorong bola','a-move',0],['⚽','Pos 1B: Bola menggelinding','Tahan bola','a-stop',2],['⚽','Pos 1C: Bola menuju dinding','Pantulkan ke dinding','a-bounce',3],['🚲','Pos 2: Sepeda melaju pelan','Kayuh lebih kuat','a-fast',1],['🟤','Pos 3A: Plastisin bulat','Tekan plastisin','a-flat',4],['➰','Pos 3B: Karet gelang','Tarik karet','a-stretch',4]];
  el.innerHTML=`<style>.pz{position:relative;height:78px;background:var(--card);border-radius:12px;overflow:hidden;border:2px solid var(--line)}.pz .o{position:absolute;left:8%;top:14px;font-size:2.4rem;display:inline-block}.pz .wall{position:absolute;right:0;top:0;bottom:0;width:12px;background:#a8743c}
   .a-move .o{animation:pm 1.4s forwards}@keyframes pm{to{left:70%}}.a-stop .o{animation:ps 1.8s forwards}@keyframes ps{0%{left:8%}40%{left:40%}100%{left:46%}}
   .a-bounce .o{animation:pb 1.8s forwards}@keyframes pb{0%{left:8%}50%{left:82%}100%{left:20%}}.a-fast .o{animation:pf 2.2s forwards}@keyframes pf{0%{left:8%}50%{left:20%}100%{left:85%}}
   .a-flat .o{animation:pl .8s forwards;left:40%}@keyframes pl{to{transform:scale(1.7,.45) translateY(28px)}}.a-stretch .o{animation:pr 2s forwards;left:40%}@keyframes pr{40%{transform:scaleX(2.2)}100%{transform:none}}</style>
   ${P.map((p,i)=>`<div class="qi"><div class="qq">${esc(p[1])}</div><div class="pz" id="pz${i}">${p[3]==='a-bounce'?'<div class="wall"></div>':''}<span class="o" ${p[3].match(/flat|stretch/)?'style="left:40%"':''}>${p[0]}</span></div><button class="btn soft" data-go="${i}" style="margin:8px 0">▶️ ${esc(p[2])}</button><div class="opts" id="po${i}" hidden>${EFX.map((e,k)=>`<button class="opt" data-p="${i}" data-k="${k}">${e}</button>`).join('')}</div><div id="pf${i}"></div></div>`).join('')}`;
  let done=0;
  $$('[data-go]',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.go, z=$('#pz'+i,el); z.className='pz'; void z.offsetWidth; z.classList.add(P[i][3]); $('#po'+i,el).hidden=false; say(P[i][2]); });
  $$('[data-p]',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.p, k=+b.dataset.k, f=$('#pf'+i,el); if(f.dataset.d) return; const ok=k===P[i][4]; b.classList.add(ok?'good':'no');
    if(ok){ f.dataset.d=1; done++; f.innerHTML=`<div class="fb ok">✅ Gaya ${EFX[k]}.${i===5?' Setelah dilepas, karet kembali ke bentuk semula (lentur). Plastisin tidak kembali.':''}</div>`; if(done===P.length) fin(el,'Semua pos selesai! Gaya dapat menggerakkan, mempercepat, memperlambat, mengubah arah, dan mengubah bentuk benda.'); }
    else f.innerHTML='<div class="fb no">Coba amati lagi gerakannya.</div>'; }); };

W.lanskap=(el)=>{ const K={gunung:['⛰️','Gunung','alami','Gunung Salak menjulang di dekat Bogor. Hawanya sejuk.'],hutan:['🌳','Hutan','alami','Hutan di lereng gunung tumbuh atas kehendak Allah dan menjadi rumah banyak makhluk.'],sungai:['🏞️','Sungai','alami','Sungai Ciliwung mengalir dari pegunungan menuju laut.'],laut:['🌊','Laut','alami','Laut ada di pesisir. Banyak warga pesisir bekerja sebagai nelayan.'],teh:['🍵','Kebun teh','buatan','Kebun teh ditanam dan dirawat manusia di dataran tinggi yang sejuk.'],sawah:['🌾','Sawah','buatan','Sawah dibuat dan diolah oleh petani di dataran rendah. Jadi sawah termasuk lingkungan buatan.'],rumah:['🏠','Rumah','buatan','Rumah dibangun manusia sebagai tempat tinggal.'],masjid:['🕌','Masjid','buatan','Masjid dibangun manusia sebagai tempat ibadah.'],jalan:['🛣️','Jalan','buatan','Jalan dibuat manusia agar mudah bepergian.'],jembatan:['🌉','Jembatan','buatan','Jembatan dibangun manusia untuk menyeberangi sungai.']};
  let got={}, cur=null;
  el.innerHTML=`<div class="simbox" style="padding:0;overflow:hidden"><svg viewBox="0 0 400 250" width="100%" style="display:block;cursor:pointer">
    <rect width="400" height="250" fill="#cfeaf7"/>
    <g data-k="gunung"><polygon points="20,150 110,40 200,150" fill="#6c8f6f"/><polygon points="90,64 110,40 130,64 120,70 110,60 100,70" fill="#fff" opacity=".8"/></g>
    <g data-k="teh"><polygon points="150,150 200,150 175,110" fill="#5fb15a"/><path d="M160 140 h30 M165 130 h22 M170 120 h12" stroke="#3e8a3c" stroke-width="3"/></g>
    <g data-k="hutan">${[[30,150],[50,145],[70,152],[45,160]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="13" fill="#2f7a3a"/>`).join('')}</g>
    <rect y="150" width="400" height="100" fill="#a6d38a"/>
    <g data-k="sawah"><rect x="10" y="185" width="110" height="55" fill="#7cc35a"/><path d="M10 198h110M10 212h110M10 226h110M38 185v55M66 185v55M94 185v55" stroke="#5aa43c" stroke-width="2"/></g>
    <g data-k="sungai"><path d="M200 150 C230 175 180 200 215 250 L250 250 C220 205 265 175 228 150 Z" fill="#4aa3d8"/></g>
    <g data-k="jembatan"><rect x="188" y="196" width="72" height="10" fill="#8a5a2b"/><path d="M190 206 v8 M258 206 v8" stroke="#8a5a2b" stroke-width="4"/></g>
    <g data-k="jalan"><path d="M120 201 h68 M260 201 h70" stroke="#777" stroke-width="12"/><path d="M125 201 h60 M265 201 h60" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/></g>
    <g data-k="rumah"><rect x="140" y="215" width="34" height="26" fill="#f2c27b"/><polygon points="136,215 157,198 178,215" fill="#c0392b"/><rect x="152" y="227" width="9" height="14" fill="#8a5a2b"/></g>
    <g data-k="masjid"><rect x="275" y="160" width="42" height="30" fill="#f4f1e6"/><path d="M280 160 a16 16 0 0 1 32 0z" fill="#2a8a52"/><rect x="320" y="146" width="6" height="44" fill="#f4f1e6"/><circle cx="323" cy="144" r="4" fill="#2a8a52"/></g>
    <g data-k="laut"><path d="M330 150 L400 150 L400 250 L300 250 C320 220 330 190 330 150Z" fill="#2d7fc1"/><path d="M345 180 q8 -6 16 0 t16 0 M330 210 q8 -6 16 0 t16 0" stroke="#bfe3ff" stroke-width="2" fill="none"/></g>
    </svg></div><div id="li" class="stage"><b>Ketuk bagian pemandangan</b> (gunung, sungai, sawah, rumah, ...). Temukan semua 10 bagian!</div><div class="prog"><i id="lp" style="width:0"></i></div>`;
  const show=k=>{ cur=k; const x=K[k]; $('#li',el).innerHTML=`<div class="big">${x[0]} ${x[1]}</div><p>${x[3]} ${sp(x[1]+'. '+x[3])}</p>${got[k]?`<div class="fb ok">✅ Lingkungan ${x[2]}.</div>`:`<b>Termasuk lingkungan apa?</b><div class="row" style="margin-top:6px"><button class="btn" data-a="alami">🌳 Alami</button><button class="btn gold" data-a="buatan">🏗️ Buatan</button></div><div id="lf"></div>`}`;
    $$('[data-a]',el).forEach(b=>b.onclick=()=>{ if(b.dataset.a===x[2]){ got[k]=1; show(k); $('#lp',el).style.width=Object.keys(got).length*10+'%'; say(x[1]+', lingkungan '+x[2]); if(Object.keys(got).length===10) fin(el,'Kamu menemukan semua bagian! Alami = ciptaan Allah; buatan = dibuat manusia.'); } else $('#lf',el).innerHTML='<div class="fb no">Belum tepat. Apakah tempat ini dibuat oleh manusia?</div>'; }); };
  $$('[data-k]',el).forEach(g=>g.onclick=e=>{ e.stopPropagation(); show(g.dataset.k); }); };

W.denah=(el)=>{ const R={tidur:[20,50,110,100,'Kamar tidur'],mandi:[130,50,90,100,'Kamar mandi'],dapur:[220,50,120,100,'Dapur'],tamu:[20,150,200,100,'Ruang tamu'],makan:[220,150,120,100,'Ruang makan'],teras:[70,250,110,40,'Teras']};
  const Q=[['room','Dari teras, ruang apa yang pertama kali dimasuki?','tamu'],['dir','Dapur ada di sebelah ... ruang makan.','utara'],['dir','Kamar tidur ada di sebelah ... kamar mandi.','barat'],['dir','Ruang makan ada di sebelah ... ruang tamu.','timur'],['opt','Ada berapa jendela (garis ganda biru) di rumah Ahmad?','4',['2','3','4','5']],['room','Dari ruang tamu ke dapur, Ahmad melewati ruang apa?','makan'],['room','Ketuk ruangan tempat kompor berada.','dapur'],['opt','Saat shalat, Ahmad menghadap kiblat. Dari Indonesia, kiblat ada di arah ...','barat laut',['barat laut','timur','selatan','tenggara']]];
  let qi=0, sc=0, kib=false;
  const svg=()=>`<svg viewBox="0 0 360 300" width="100%" style="max-width:560px">
   <text x="20" y="30" font-weight="900" font-size="15" fill="currentColor">Denah Rumah Ahmad</text>
   <g transform="translate(322 28)"><circle r="17" fill="var(--card)" stroke="currentColor"/><path d="M0 -14 L5 0 L0 -3 L-5 0Z" fill="#d64545"/><path d="M0 14 L5 0 L0 3 L-5 0Z" fill="#888"/><text y="-19" font-size="10" text-anchor="middle" font-weight="900" fill="currentColor">U</text></g>
   ${Object.entries(R).map(([k,r])=>`<g class="roomq" data-r="${k}"><rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${k==='teras'?'#eadcc0':'#fffaf0'}" stroke="#555" stroke-width="2"/><text x="${r[0]+r[2]/2}" y="${r[1]+r[3]/2+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#444">${r[4]}</text></g>`).join('')}
   <rect x="32" y="60" width="44" height="26" fill="#9fc5e8" stroke="#555"/><rect x="32" y="60" width="44" height="7" fill="#fff" stroke="#555"/>
   <circle cx="250" cy="70" r="7" fill="none" stroke="#d64545" stroke-width="2"/><circle cx="270" cy="70" r="7" fill="none" stroke="#d64545" stroke-width="2"/><rect x="240" y="60" width="40" height="20" fill="none" stroke="#555"/>
   <rect x="252" y="165" width="56" height="24" fill="#d8b384" stroke="#555"/><rect x="150" y="65" width="40" height="22" rx="8" fill="#bfe3ff" stroke="#555"/>
   <rect x="40" y="222" width="70" height="18" fill="#c9a0dc" stroke="#555"/>
   ${[[18,70,18,100],[342,70,342,100],[342,175,342,205],[30,252,60,252]].map(w=>w[0]===w[2]?`<g stroke="#2f63b0" stroke-width="2"><line x1="${w[0]-2}" y1="${w[1]}" x2="${w[2]-2}" y2="${w[3]}"/><line x1="${w[0]+2}" y1="${w[1]}" x2="${w[2]+2}" y2="${w[3]}"/></g>`:`<g stroke="#2f63b0" stroke-width="2"><line x1="${w[0]}" y1="${w[1]-2}" x2="${w[2]}" y2="${w[3]-2}"/><line x1="${w[0]}" y1="${w[1]+2}" x2="${w[2]}" y2="${w[3]+2}"/></g>`).join('')}
   ${[[100,250,'h'],[220,180,'v'],[265,150,'h'],[55,150,'h']].map(d=>d[2]==='h'?`<path d="M${d[0]} ${d[1]} h22 M${d[0]} ${d[1]} a22 22 0 0 0 22 -22" fill="none" stroke="#c98b1d" stroke-width="2"/><line x1="${d[0]}" y1="${d[1]}" x2="${d[0]+22}" y2="${d[1]}" stroke="#fffaf0" stroke-width="4"/>`:`<path d="M${d[0]} ${d[1]} v22 M${d[0]} ${d[1]} a22 22 0 0 1 22 22" fill="none" stroke="#c98b1d" stroke-width="2"/><line x1="${d[0]}" y1="${d[1]}" x2="${d[0]}" y2="${d[1]+22}" stroke="#fffaf0" stroke-width="4"/>`).join('')}
   ${kib?'<g stroke="#2a8a52" stroke-width="4" fill="#2a8a52"><line x1="180" y1="150" x2="120" y2="95"/><polygon points="112,88 128,92 118,104" /></g><text x="96" y="84" font-size="11" font-weight="900" fill="#2a8a52">kiblat (barat laut)</text>':''}
   </svg>`;
  const draw=()=>{ if(qi>=Q.length){ el.innerHTML=`<div class="simbox">${svg()}</div><div class="stage" style="text-align:center"><div class="huge">🧭</div><div class="big">${sc} dari ${Q.length} benar</div><button class="btn" id="da">🔁 Ulangi</button></div>`; $('#da',el).onclick=()=>{qi=0;sc=0;kib=false;draw();}; return; }
    const q=Q[qi]; el.innerHTML=`<div class="simbox" style="color:var(--ink)">${svg()}<div class="legend"><span>🟥 kompor</span><span>▭ biru ganda = jendela</span><span>◜ busur = pintu</span><span>🟪 sofa · 🟫 meja makan · 🛏️ kasur · 🛁 bak mandi</span></div></div>
     <div class="stage"><div class="row" style="justify-content:space-between"><b>Pertanyaan ${qi+1}/${Q.length}</b><span class="score">⭐ ${sc}</span></div><p class="big" style="font-size:1.1rem">${esc(q[1])} ${sp(q[1])}</p>
     ${q[0]==='room'?'<p class="muted">Ketuk ruangan pada denah.</p>':q[0]==='dir'?`<div class="opts">${['utara','selatan','timur','barat'].map(d=>`<button class="opt" data-v="${d}">${d}</button>`).join('')}</div>`:`<div class="opts">${q[3].map(d=>`<button class="opt" data-v="${d}">${d}</button>`).join('')}</div>`}<div id="dfb"></div></div>`;
    const ans=v=>{ if($('#dfb',el).dataset.d)return; $('#dfb',el).dataset.d=1; const ok=v===q[2]; if(ok)sc++; if(qi===Q.length-1) kib=true;
      $('#dfb',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ '+praise():'❌ Jawabannya: '+(R[q[2]]?R[q[2]][4]:q[2])}</div><button class="btn" id="dn">Lanjut →</button>`; $('#dn',el).onclick=()=>{qi++;draw();}; };
    $$('.opt',el).forEach(b=>b.onclick=()=>{ b.classList.add(b.dataset.v===q[2]?'good':'no'); ans(b.dataset.v); });
    if(q[0]==='room') $$('[data-r]',el).forEach(g=>g.onclick=()=>{ g.querySelector('rect').setAttribute('fill',g.dataset.r===q[2]?'#c8f0d4':'#fbd4d4'); ans(g.dataset.r); }); };
  draw(); };

W.hemat=(el)=>{ const A=[['🛏️','Kamar','💡','Lampu kamar menyala','Matikan lampu','listrik'],['🛏️','Kamar','🌀','Kipas berputar tanpa orang','Matikan kipas','listrik'],['🛋️','Ruang tamu','📺','TV menyala tanpa ditonton','Matikan TV','listrik'],['🛋️','Ruang tamu','🔌','Charger masih tercolok','Cabut charger','listrik'],['🍳','Dapur','🚰','Keran dapur menetes','Tutup keran','air'],['🍳','Dapur','🧊','Pintu kulkas terbuka','Tutup pintu kulkas','listrik'],['🚿','Kamar mandi','🚰','Keran kamar mandi mengalir','Tutup keran','air'],['🚿','Kamar mandi','💡','Lampu kamar mandi menyala','Matikan lampu','listrik']];
  let on=A.map(()=>1), t0=Date.now(), w=0, liter=0, iv;
  el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="big">⏱️ <span id="ht">0</span> detik</span><span class="big">⚡ <span id="hw">0</span> · 💧 <span id="hl">0</span> L</span></div><div class="prog"><i id="hp" style="width:0"></i></div>
   <div class="bins">${['Kamar','Ruang tamu','Dapur','Kamar mandi'].map(r=>`<div class="bin" style="cursor:default"><h4>${A.find(a=>a[1]===r)[0]} ${r}</h4>${A.map((a,i)=>a[1]===r?`<button class="tok" data-h="${i}" style="margin:3px 0;width:100%">${a[2]} ${esc(a[3])}<br><small>➜ ${esc(a[4])}</small></button>`:'').join('')}</div>`).join('')}</div><div id="hf"></div>`;
  $$('[data-h]',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.h; if(!on[i])return; on[i]=0; b.classList.add('good'); b.innerHTML=`✅ ${A[i][5]==='air'?'Keran tertutup':'Sudah dimatikan'}`; say(A[i][4]); const n=on.filter(x=>x).length; $('#hp',el).style.width=(A.length-n)/A.length*100+'%';
    if(!n){ clearInterval(iv); const s=Math.round((Date.now()-t0)/1000); fin(el,`Rumah hemat dalam ${s} detik! Energi terbuang ${w} satuan dan air ${liter} liter. Memakai energi seperlunya adalah tanda syukur.`,()=>W.hemat(el)); } });
  iv=setInterval(()=>{ if(!alive(el)){clearInterval(iv);return;} on.forEach((x,i)=>{ if(x){ if(A[i][5]==='air') liter+=1; else w+=1; } }); $('#ht',el).textContent=Math.round((Date.now()-t0)/1000); $('#hw',el).textContent=w; $('#hl',el).textContent=liter; },1000); };

W.cuaca=(el)=>{ let sky=0, wind=0, temp=27; const found=new Set();
  const SKY=[['☀️','Cerah'],['⛅','Berawan'],['☁️','Mendung'],['🌧️','Hujan']], WIND=['Diam','Pelan','Kencang'];
  const SYM=[['☀️','Cerah'],['⛅','Berawan'],['🌧️','Hujan'],['🌬️','Berangin']];
  const want=()=>sky===3?2:wind===2?3:sky===0?0:1;
  const scene=()=>{ const skyc=['#8fd3ff','#b7d9ec','#9aa8b3','#7d8994'][sky], cl=[0,2,4,5][sky], dark=sky>=2;
    return `<svg viewBox="0 0 320 180" width="320"><rect width="320" height="180" fill="${skyc}"/>${sky<=1?'<circle cx="60" cy="45" r="24" fill="#ffd34d"/>':''}
     ${Array.from({length:cl},(_,i)=>`<g fill="${dark?'#6b7680':'#fff'}" opacity=".95"><ellipse cx="${80+i*45}" cy="${40+(i%2)*14}" rx="30" ry="15"/><ellipse cx="${100+i*45}" cy="${32+(i%2)*14}" rx="20" ry="13"/></g>`).join('')}
     ${sky===3?Array.from({length:26},(_,i)=>`<line x1="${(i*13)%320}" y1="${60+(i*7)%40}" x2="${(i*13)%320-4}" y2="${72+(i*7)%40}" stroke="#d7ecff" stroke-width="2"/>`).join(''):''}
     <rect y="140" width="320" height="40" fill="#8cc56b"/><line x1="250" y1="70" x2="250" y2="150" stroke="#555" stroke-width="3"/>
     <path d="M250 72 h${[8,22,40][wind]} l${[-2,-4,-6][wind]} ${[14,10,6][wind]} h-${[8,22,40][wind]}z" fill="#d64545"/><path d="M250 ${72+[14,10,6][wind]/2} h${[8,22,40][wind]} l${[-2,-4,-6][wind]} ${[14,10,6][wind]/2} h-${[8,22,40][wind]}z" fill="#fff"/>
     <g transform="translate(140 150) rotate(${[0,8,20][wind]})"><line y2="-40" stroke="#7a5230" stroke-width="5"/><circle cy="-48" r="16" fill="#2f7a3a"/></g>
     <g transform="translate(296 40)"><rect x="-6" y="0" width="12" height="90" rx="6" fill="#fff" stroke="#555"/><rect x="-3" y="${86-(temp-16)*4}" width="6" height="${(temp-16)*4}" fill="#d64545"/><circle cy="94" r="10" fill="#d64545"/></g></svg>`; };
  const draw=()=>{ el.innerHTML=`<div class="simbox">${scene()}<div class="big">${SKY[sky][0]} ${SKY[sky][1]} · angin ${WIND[wind].toLowerCase()} · ${temp} °C</div></div>
    <div class="stage"><b>Langit / awan:</b><div class="row" style="margin:4px 0 10px">${SKY.map((s,i)=>`<button class="btn ${i===sky?'':'ghost'}" data-s="${i}">${s[0]} ${s[1]}</button>`).join('')}</div>
     <b>Angin (lihat bendera & pohon):</b><div class="row" style="margin:4px 0 10px">${WIND.map((s,i)=>`<button class="btn ${i===wind?'':'ghost'}" data-w="${i}">${s}</button>`).join('')}</div>
     <b>Suhu (termometer):</b> <input type="range" class="slider" id="ct" min="18" max="34" value="${temp}"></div>
    <div class="stage"><b>Simbol cuaca yang paling tepat untuk keadaan ini?</b><div class="opts" style="margin-top:6px">${SYM.map((s,i)=>`<button class="opt" data-y="${i}">${s[0]} ${s[1]}</button>`).join('')}</div><div id="cf"></div><p class="muted">Simbol yang sudah kamu temukan: ${[...found].map(i=>SYM[i][0]).join(' ')||'–'} (${found.size}/4)</p></div>`;
    $$('[data-s]',el).forEach(b=>b.onclick=()=>{sky=+b.dataset.s;draw();say(SKY[sky][1]);}); $$('[data-w]',el).forEach(b=>b.onclick=()=>{wind=+b.dataset.w;draw();});
    $('#ct',el).oninput=e=>{temp=+e.target.value;draw();};
    $$('[data-y]',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.y===want(); b.classList.add(ok?'good':'no');
      if(ok){ found.add(want()); $('#cf',el).innerHTML=`<div class="fb ok">✅ ${praise()} Simbol ${SYM[want()][1].toLowerCase()}.${found.size<4?' Ubah keadaan langit/angin untuk menemukan simbol lain!':''}</div>`; if(found.size===4){ setTimeout(()=>{ if(alive(el)){ draw(); fin(el,'Keempat simbol cuaca sudah kamu temukan: cerah, berawan, hujan, berangin.'); } },900); } }
      else $('#cf',el).innerHTML='<div class="fb no">Belum tepat. Perhatikan: ada hujan? anginnya kencang? langitnya cerah?</div>'; }); };
  draw(); };

W.musim=(el)=>{ const BL=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']; let m=0, qd=0;
  const hujan=i=>i>=9||i<=2;
  const draw=()=>{ const h=hujan(m); el.innerHTML=`<div class="simbox"><div class="big">${BL[m]} → biasanya <span style="color:var(--acc)">${h?'🌧️ musim hujan':'☀️ musim kemarau'}</span></div>
    <input type="range" class="slider" id="mm" min="0" max="11" value="${m}" aria-label="Bulan"><div class="row" style="justify-content:space-between;font-size:.8rem" class="muted"><span>Jan</span><span>Apr</span><span>Jul</span><span>Okt</span><span>Des</span></div>
    <svg viewBox="0 0 320 120" width="320"><rect width="320" height="120" fill="${h?'#a9bccb':'#9fdcff'}"/>${h?Array.from({length:22},(_,i)=>`<line x1="${(i*15)%320}" y1="${10+(i*9)%40}" x2="${(i*15)%320-4}" y2="${22+(i*9)%40}" stroke="#eaf5ff" stroke-width="2"/>`).join(''):'<circle cx="270" cy="30" r="20" fill="#ffd34d"/>'}
     <rect y="70" width="160" height="50" fill="${h?'#6fbf4a':'#d9c27a'}"/>${h?Array.from({length:10},(_,i)=>`<path d="M${10+i*15} 110 v-18 m0 6 l-5 -6 m5 6 l5 -6" stroke="#2f7a3a" stroke-width="2" fill="none"/>`).join(''):Array.from({length:6},(_,i)=>`<path d="M${10+i*25} 95 l12 8 l10 -6" stroke="#a88a4a" stroke-width="2" fill="none"/>`).join('')}
     <rect x="160" y="70" width="160" height="50" fill="${h?'#4aa3d8':'#7cc0e6'}"/>${h?'':[0,1,2].map(i=>`<polygon points="${185+i*45},108 ${200+i*45},84 ${215+i*45},108" fill="#fff"/>`).join('')}
     <text x="80" y="66" text-anchor="middle" font-size="11" font-weight="800">sawah</text><text x="240" y="66" text-anchor="middle" font-size="11" font-weight="800">tambak garam</text></svg></div>
    <div class="bins"><div class="bin" style="cursor:default"><h4>🌾 Petani padi</h4>${h?'Menanam padi; sawah tergenang air hujan.':'Sawah mengering; petani memanen atau menunggu hujan.'}</div>
     <div class="bin" style="cursor:default"><h4>🧂 Petani garam</h4>${h?'Sulit membuat garam karena hujan.':'Panen garam! Panas matahari menguapkan air laut.'}</div>
     <div class="bin" style="cursor:default"><h4>🎒 Perlengkapanku</h4>${h?'☂️ payung, jas hujan, sepatu bot':'🧢 topi, botol minum, pakaian menyerap keringat'}</div>
     <div class="bin" style="cursor:default"><h4>🏞️ Sungai & sumur</h4>${h?'Air sungai naik, bisa meluap.':'Air sungai dan sumur surut.'}</div></div>
    <p class="muted">Catatan: “biasanya” — karena perubahan iklim, musim kadang tidak menentu.</p><div id="mq"></div>`;
    $('#mm',el).oninput=e=>{ m=+e.target.value; draw(); };
    if(!qd){ const months=shuf([0,3,6,10]).slice(0,3); $('#mq',el).innerHTML=`<div class="stage"><b>Uji dirimu:</b>${months.map(k=>`<div class="qi"><div class="qq">Bulan ${BL[k]} biasanya musim ...</div><div class="bsb"><button data-mk="${k}" data-v="1">🌧️ Hujan</button><button data-mk="${k}" data-v="0">☀️ Kemarau</button></div></div>`).join('')}</div>`;
      let ok=0, n=0; $$('[data-mk]',el).forEach(b=>b.onclick=()=>{ const k=+b.dataset.mk; if(b.parentNode.dataset.d)return; b.parentNode.dataset.d=1; const r=(b.dataset.v==='1')===hujan(k); b.classList.add(r?'good':'no'); n++; if(r)ok++; if(n===3){ qd=1; fin($('#mq',el),`${ok}/3 benar. Musim hujan sekitar Oktober–Maret, kemarau sekitar April–September.`); } }); } };
  draw(); };

W.selimut=(el)=>{ let asap=2, pohon=6, best=false, hot=false;
  const draw=()=>{ const net=Math.max(0,asap*1.3-pohon*.9), T=Math.round((14.5+net*0.55)*10)/10, st=net<1.5?['🌍','Sejuk & seimbang','ok']:net<5?['🌡️','Mulai menghangat','warn']:['🔥','Panas! Es kutub mencair, musim tidak menentu','bad'];
    if(st[2]==='bad') hot=true; if(hot&&st[2]==='ok'&&asap>=6) best=true;
    const earth=st[2]==='ok'?'#3aa0d8':st[2]==='warn'?'#d9a43b':'#d64545', thick=6+net*4;
    el.innerHTML=`<div class="simbox"><svg viewBox="0 0 320 200" width="320"><rect width="320" height="200" fill="#0b1c33"/><circle cx="40" cy="40" r="22" fill="#ffd34d"/>
      <circle cx="200" cy="110" r="${58+thick/2}" fill="none" stroke="#c7c7c7" stroke-opacity="${Math.min(.85,.15+net*.08)}" stroke-width="${thick}"/>
      <circle cx="200" cy="110" r="56" fill="${earth}"/><path d="M170 85 q20 -12 35 0 t30 10 q-8 18 -30 14 t-35 -24z M165 125 q25 -6 40 8 q-10 16 -30 10z" fill="#2f7a3a" opacity=".9"/>
      <path d="M60 52 L150 92" stroke="#ffd34d" stroke-width="3" marker-end="url(#ah)"/><path d="M150 100 L${net<5?70:120} ${net<5?150:130}" stroke="#ff9f43" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ah2)"/>
      <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#ffd34d"/></marker><marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#ff9f43"/></marker></defs>
      <text x="20" y="190" fill="#fff" font-size="12" font-weight="800">Suhu rata-rata bumi: ${T} °C</text></svg>
      <div class="big">${st[0]} ${st[1]}</div><p class="muted">${net<5?'Sebagian panas dapat keluar ke angkasa (panah putus-putus).':'Selimut udara tebal: panas terperangkap dan sulit keluar.'}</p></div>
     <div class="stage"><label><b>🏭🚗 Asap kendaraan, pabrik & sampah dibakar:</b> ${asap}<input type="range" class="slider" id="sa" min="0" max="10" value="${asap}"></label>
      <label><b>🌳 Pohon yang ditanam & hutan yang dijaga:</b> ${pohon}<input type="range" class="slider" id="sp" min="0" max="10" value="${pohon}"></label></div>
     <div class="stage"><b>🎯 Tantangan:</b> naikkan asap sampai bumi “Panas”, lalu tanam pohon sampai bumi kembali “Sejuk” walau asap masih 6 atau lebih. Ingat, mengurangi asap juga sangat membantu!${best?'<div class="fb ok">✅ Tantangan berhasil! Pohon menyerap gas yang memanaskan bumi. Menanam pohon adalah sedekah jariyah.</div>':''}</div>`;
    $('#sa',el).oninput=e=>{asap=+e.target.value;draw();}; $('#sp',el).oninput=e=>{pohon=+e.target.value;draw();}; };
  draw(); };

/* ---------- kuis (A–D) ---------- */
function quiz(el,P){ const Z=P.quiz, key='p'+P.n; const pg=Z.pg.map(q=>({...q,ord:shuf(q.o.map((_,i)=>i))})); const R=shuf(Z.jd.map((p,i)=>i)); const ans={pg:{},bs:{},jd:{}}; const ur=store.get('ur'+P.n)||{};
  const best=store.get(key);
  el.innerHTML=`<p class="muted">${P.ev?'Kerjakan sendiri dengan jujur dan teliti. Awali dengan bismillah.':'Baca setiap soal dengan teliti. Awali dengan bismillah.'} ${best!=null?`<b>Nilai terbaikmu: ${best}</b>`:''}</p>
   <div class="qsec">A. Pilihlah jawaban yang paling benar!</div>${pg.map((q,i)=>`<div class="qi" id="qa${i}"><div class="qq"><span class="n">${i+1}.</span>${esc(q.q)} ${sp(q.q)}</div><div class="opts">${q.ord.map((k,j)=>`<button class="opt" data-a="${i}" data-k="${k}">${'abcd'[j]}. ${esc(q.o[k])}</button>`).join('')}</div><div class="ex"></div></div>`).join('')}
   <div class="qsec">B. Benar atau Salah?</div>${Z.bs.map((b,i)=>`<div class="qi" id="qb${i}"><div class="qq"><span class="n">${pg.length+i+1}.</span>${esc(b[0])} ${sp(b[0])}</div><div class="bsb"><button data-b="${i}" data-v="1">✔️ Benar</button><button data-b="${i}" data-v="0">✖️ Salah</button></div><div class="ex"></div></div>`).join('')}
   <div class="qsec">C. Jodohkan!</div><div class="qi">${Z.jd.map((p,i)=>`<div class="jd" id="qc${i}"><b>${pg.length+Z.bs.length+i+1}. ${esc(p[0])}</b><select data-c="${i}"><option value="">— pilih —</option>${R.map(r=>`<option value="${r}">${esc(Z.jd[r][1])}</option>`).join('')}</select></div>`).join('')}</div>
   <div class="qsec">D. Jawablah dengan kalimatmu sendiri</div>${Z.ur.map((u,i)=>`<div class="qi"><div class="qq">${esc(u[0])}</div><textarea data-u="${i}" placeholder="Tulis jawabanmu…">${esc(ur[i]||'')}</textarea><button class="btn soft" data-show="${i}" style="margin-top:6px">💡 Lihat contoh jawaban</button><div class="ex" id="ue${i}" hidden>${esc(u[1])}</div></div>`).join('')}
   <div class="result"><button class="btn gold" id="qs" style="width:100%;font-size:1.1rem;padding:12px">✅ Periksa jawaban A, B, dan C</button></div><div id="qr"></div>`;
  $$('[data-a]',el).forEach(b=>b.onclick=()=>{ if(el.dataset.done)return; const i=+b.dataset.a; ans.pg[i]=+b.dataset.k; $$(`[data-a="${i}"]`,el).forEach(x=>x.classList.toggle('sel',x===b)); });
  $$('[data-b]',el).forEach(b=>b.onclick=()=>{ if(el.dataset.done)return; const i=+b.dataset.b; ans.bs[i]=b.dataset.v==='1'; $$(`[data-b="${i}"]`,el).forEach(x=>x.classList.toggle('sel',x===b)); });
  $$('[data-c]',el).forEach(s=>s.onchange=()=>{ ans.jd[+s.dataset.c]=s.value===''?null:+s.value; });
  $$('[data-u]',el).forEach(t=>t.oninput=()=>{ ur[+t.dataset.u]=t.value; store.set('ur'+P.n,ur); });
  $$('[data-show]',el).forEach(b=>b.onclick=()=>{ $('#ue'+b.dataset.show,el).hidden=false; });
  $('#qs',el).onclick=()=>{ const tot=pg.length+Z.bs.length+Z.jd.length, kos=tot-Object.keys(ans.pg).length-Object.keys(ans.bs).length-Object.values(ans.jd).filter(v=>v!=null).length;
    if(kos>0&&!el.dataset.warned){ el.dataset.warned=1; $('#qr',el).innerHTML=`<div class="fb no">Masih ada ${kos} soal yang belum dijawab. Tekan tombol periksa sekali lagi bila ingin tetap memeriksa.</div>`; return; }
    el.dataset.done=1; let ok=0;
    pg.forEach((q,i)=>{ const r=ans.pg[i]===0; if(r)ok++; $$(`[data-a="${i}"]`,el).forEach(x=>{ x.disabled=true; if(+x.dataset.k===0)x.classList.add('good'); else if(+x.dataset.k===ans.pg[i])x.classList.add('no'); }); $(`#qa${i} .ex`,el).innerHTML=(r?'✅ ':'❌ ')+esc(q.ex||''); });
    Z.bs.forEach((b,i)=>{ const r=ans.bs[i]===b[1]; if(r)ok++; $$(`[data-b="${i}"]`,el).forEach(x=>{ x.disabled=true; if((x.dataset.v==='1')===b[1])x.classList.add('good'); else if(x.classList.contains('sel'))x.classList.add('no'); }); $(`#qb${i} .ex`,el).innerHTML=(r?'✅ ':'❌ ')+(b[1]?'Benar.':'Salah. ')+esc(b[2]||''); });
    Z.jd.forEach((p,i)=>{ const s=$(`[data-c="${i}"]`,el), r=ans.jd[i]===i; if(r)ok++; s.disabled=true; s.classList.add(r?'good':'no'); if(!r) s.insertAdjacentHTML('afterend',`<div class="ex" style="grid-column:2">→ ${esc(p[1])}</div>`); });
    const nilai=Math.round(ok/tot*100), b0=store.get(key); if(b0==null||nilai>b0) store.set(key,nilai);
    $('#qs',el).hidden=true;
    $('#qr',el).innerHTML=`<div class="card" style="text-align:center;border:2px solid var(--gold)"><div class="huge">${nilai>=85?'🏆':nilai>=70?'🌟':'🌱'}</div><div class="big">Nilai: ${nilai}</div><p>${ok} dari ${tot} soal benar. ${nilai>=85?'MasyaAllah, luar biasa!':nilai>=70?'Alhamdulillah, bagus! Pelajari lagi soal yang salah.':'Ayo baca lagi Ayo Memahami, lalu coba lagi. Semangat!'}</p><p class="muted">Nilai terbaik: ${Math.max(nilai,b0||0)} · Bagian D diperiksa bersama ustadz/ustadzah.</p><button class="btn" id="qa">🔁 Ulangi kuis</button></div>`;
    $('#qa',el).onclick=()=>{ quiz(el,P); el.removeAttribute('data-done'); el.removeAttribute('data-warned'); el.scrollIntoView({behavior:'smooth'}); }; say(nilai>=70?'Alhamdulillah':'Semangat, coba lagi'); };
}

/* ---------- tugas rumah ---------- */
function tugas(P){ const T=P.tugas; let tbl='';
  if(T.cols){ const rows=T.fixed?T.fixed.map(f=>[f,...T.cols.slice(1).map(()=>'')]):Array.from({length:T.rows||4},()=>T.cols.map(()=>''));
    tbl=`<div class="tw"><table class="t"><tr><th>No</th>${T.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${T.ex?`<tr><td><i>Contoh</i></td>${T.ex.map(x=>`<td><i>${esc(x)}</i></td>`).join('')}</tr>`:''}${rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map((c,k)=>`<td class="blank">${k===0&&T.fixed?esc(c):''}</td>`).join('')}</tr>`).join('')}</table></div>`; }
  return `<div class="card printme"><h2>🏠 Tugas di Rumah: ${esc(T.t)}</h2><p>${esc(T.d)}</p>${T.steps?`<b>Langkah-langkah:</b><ol>${T.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}${tbl}${T.draw?`<div class="drawbox">${esc(T.draw)}</div>`:''}
   ${T.q?`<b>Jawablah:</b><ol>${T.q.map(q=>`<li>${esc(q)}<div style="border-bottom:1.5px dotted var(--muted);height:30px"></div></li>`).join('')}</ol>`:''}
   <div class="ortu"><b>Catatan untuk Ayah/Bunda:</b> Ananda sedang belajar “${esc(P.t)}”. Mohon dampingi ananda dan biarkan ananda menulis sendiri. Dikumpulkan pada pertemuan IPAS berikutnya.<br>Paraf orang tua: .................................</div>
   <div class="row noprint" style="margin-top:10px"><button class="btn" onclick="document.querySelectorAll('.panel').forEach(p=>p.classList.remove('printme'));document.getElementById('tugas').classList.add('printme');window.print()">🖨️ Cetak lembar tugas</button></div></div>`; }

/* ---------- halaman pertemuan ---------- */
function page(n){ const all=window.PTM, P=all.find(x=>x.n===n), prev=all.find(x=>x.n===n-1), next=all.find(x=>x.n===n+1), B=BAB[P.bab];
  document.body.dataset.bab=P.bab; document.title=`P${n} · ${P.t} · IPAS Qonuni 2`;
  const gk='g'+n, gs=store.get(gk)||[];
  const learn=P.learn.map(b=>`<div class="card learn"><h3>${esc(b.h)} ${sp(b.h+'. '+(b.p||'')+(b.li?b.li.map(l=>l[1]+', '+l[2]).join('. '):''))}</h3>${b.p?`<p>${esc(b.p)}</p>`:''}${b.li?b.li.map(l=>`<div class="li"><span class="e">${l[0]}</span><div><b>${esc(l[1])}</b> — ${esc(l[2])}</div></div>`).join(''):''}${b.ol?`<ol>${b.ol.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}${b.warn?`<div class="warn">⚠️ <b>Hati-hati:</b> ${esc(b.warn)}</div>`:''}</div>`).join('');
  const flow=`<div class="card"><h3>📊 ${esc(P.flow.t)}</h3><div class="flow ${P.flow.type==='map'?'':'chainf'}">${P.flow.s.map(s=>`<div class="st"><span class="e">${s[0]}</span>${esc(s[1])}</div>`).join('')}</div></div>`;
  document.body.innerHTML=`<header class="top"><div class="wrap"><a class="back" href="../index.html">← Beranda</a><div class="brand">${B[1]} IPAS Qonuni 2 <small>· Pertemuan ${n}</small></div><div class="pn">${prev?`<a href="p${String(prev.n).padStart(2,'0')}.html" title="Sebelumnya">‹</a>`:''}${next?`<a href="p${String(next.n).padStart(2,'0')}.html" title="Berikutnya">›</a>`:''}</div></div></header>
  <div class="wrap"><section class="hero"><span class="chip">Pertemuan ${n} · Bab ${P.bab}: ${esc(B[0])}</span> ${P.ev?'<span class="chip gold">📝 Evaluasi Bab</span>':''}<h1>${P.ic} ${esc(P.t)}</h1><div class="row"><span class="chip soft">Metode: ${esc(P.metode)}</span><span class="chip soft">⏱️ 1 × 60 menit</span></div></section>
   <div class="card ayat"><div class="lbl">🌙 Mari Mengingat Allah</div><blockquote>${esc(P.ayat[0])}</blockquote><cite>${esc(P.ayat[1])} ${sp(P.ayat[0]+'. '+P.ayat[1])}</cite><p>${esc(P.ayat[2])}</p></div>
   <div class="card"><h2><span class="ic">🎯</span>Hari Ini Aku Belajar</h2><ul class="goals">${P.goals.map((g,i)=>`<li><input type="checkbox" data-g="${i}" ${gs.includes(i)?'checked':''} aria-label="tandai tujuan ${i+1}"><span>${esc(g)}</span></li>`).join('')}</ul><p class="muted" style="margin:.4em 0 0;font-size:.9rem">Centang setelah kamu merasa bisa.</p></div>
   <nav class="tabs"><button data-t="pahami">📖 Ayo Memahami</button><button data-t="lab">🔬 Lab</button><button data-t="main">🎮 Latihan</button><button data-t="kuis">${P.ev?'📝 Evaluasi':'📝 Kuis'}</button><button data-t="tugas">🏠 Tugas Rumah</button></nav>
   <section class="panel" id="pahami">${learn}<div class="card tahu"><b>💡 Tahukah Kamu?</b> ${esc(P.tahu)} ${sp(P.tahu)}</div>${P.warn?`<div class="card warn">⚠️ ${esc(P.warn)}</div>`:''}${flow}<div class="row"><button class="btn" data-goto="lab">Lanjut ke Lab 🔬</button></div></section>
   <section class="panel" id="lab"><div class="card"><h2><span class="ic">${P.lab.ic}</span>${esc(P.lab.t)}</h2><p class="muted">${esc(P.lab.d)}</p><div id="labw"></div></div><div class="row"><button class="btn" data-goto="main">Lanjut ke Latihan 🎮</button></div></section>
   <section class="panel" id="main"><div class="card"><h2><span class="ic">${P.game.ic}</span>${esc(P.game.t)}</h2><p class="muted">${esc(P.game.d)}</p><div id="gamew"></div></div><div class="row"><button class="btn" data-goto="kuis">Lanjut ke ${P.ev?'Evaluasi':'Kuis'} 📝</button></div></section>
   <section class="panel" id="kuis"><div class="card"><h2><span class="ic">📝</span>${P.ev?'Evaluasi Bab '+P.bab+(n===16?' & Akhir Semester':''):'Kuis: Ayo Uji Dirimu!'}</h2><div id="quizw"></div></div></section>
   <section class="panel" id="tugas">${tugas(P)}</section>
   <div class="navbot">${prev?`<a class="btn ghost" href="p${String(prev.n).padStart(2,'0')}.html">‹ P${prev.n}: ${esc(prev.t)}</a>`:'<span></span>'}${next?`<a class="btn" href="p${String(next.n).padStart(2,'0')}.html">P${next.n}: ${esc(next.t)} ›</a>`:'<a class="btn" href="../latihan/index.html">📚 Latihan Semester ›</a>'}</div></div>
  <footer><div class="wrap">Virtual IPAS Lab · Qonuni 2 · Semester 1 · Kuttab Raudhah Nabawiyah</div></footer>`;
  const bs=$$('.tabs button'); const go=(id,u)=>{ bs.forEach(b=>b.classList.toggle('on',b.dataset.t===id)); $$('.panel').forEach(p=>p.classList.toggle('on',p.id===id)); if(u){ try{history.replaceState(null,'','#'+id);}catch(e){} window.scrollTo({top:Math.min(window.scrollY,$('.tabs').offsetTop-56)}); } };
  bs.forEach(b=>b.onclick=()=>go(b.dataset.t,1)); $$('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto,1));
  const h=location.hash.slice(1); go(bs.some(b=>b.dataset.t===h)?h:'pahami'); if(h) setTimeout(()=>window.scrollTo(0,0),0);
  $$('[data-g]').forEach(c=>c.onchange=()=>{ const s=$$('[data-g]').filter(x=>x.checked).map(x=>+x.dataset.g); store.set(gk,s); });
  W[P.lab.w]($('#labw'),P.lab); W[P.game.w]($('#gamew'),P.game); quiz($('#quizw'),P);
}
window.IPAS={page,W,store,say,sp,shuf,esc,$,$$,BAB,quiz};
})();
