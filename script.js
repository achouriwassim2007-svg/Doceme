// Doceme engine: card states, note-taker, teaching loop, exam, coach, views.
// Needs pack.js loaded first (it defines PACK).
const $=s=>document.querySelector(s);
let S,view="student";
const fresh=()=>({step:0,code:"",lang:"English",pre:[],post:[],states:{},log:[],notes:[],cur:0,asked:false,exam:null,level:""});
S=fresh();let SESSIONS=[];try{SESSIONS=JSON.parse(localStorage.getItem("doceme_sessions")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("doceme_sessions",JSON.stringify(SESSIONS))}catch(e){}};
const STEPS=["Topic","Pre-test","Learn first","Teach","Exam","Coach","Post-test","Results"];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const words=t=>new Set(t.toLowerCase().match(/[a-zà-ÿ']+/g)||[]);
const sim=(a,b)=>{const A=words(a),B=words(b);let i=0;A.forEach(w=>B.has(w)&&i++);return i/(new Set([...A,...B]).size||1)};
const lang=t=>/[\u0600-\u06FF]/.test(t)?"Arabic":/\b(le|la|les|est|une|un|des|quand|pour|on|il|elle|que)\b/i.test(t)?"French":"English";
const cnt=k=>PACK.cards.filter(c=>S.states[c.id]===k).length;
// ---------- Doceme's mind: knowledge lives in code, never in the model's memory ----------
function rubric(card,txt){const L=lang(txt);const wrong=card.wrong.test(txt);
 if(L!=="English")return{L,acc:null,comp:txt.split(/\s+/).length>=8,ex:/"|«|"/.test(txt)||txt.length>60,wrong:false};
 return{L,acc:!wrong&&card.key.test(txt),comp:txt.split(/\s+/).length>=12,ex:/said|asked|"|example|e\.g\./i.test(txt),wrong}}
function teach(txt){const card=PACK.cards[S.cur];S.log.push({w:"s",t:txt});const r=rubric(card,txt);
 const score=(r.acc?1:0)+(r.comp?1:0)+(r.ex?1:0);let reply;
 S.notes.push({card:card.id,words:txt,summary:txt.slice(0,80)+(txt.length>80?"…":""),score,lang:r.L});
 if(sim(txt,card.src)>0.5){reply="That sounds just like the book! I need your own words and your own example, please.";S.notes.at(-1).paste=true}
 else if(r.wrong){S.states[card.id]="Mis-learned";reply=`Okay, I will do exactly what you said! <b>${esc(card.test)}</b> → "${esc(card.bad)}" Is that right?`}
 else if(r.acc===null){S.states[card.id]=S.states[card.id]==="Learned"?"Learned":"Learning";reply=`Thank you, I noted that you explained in ${r.L}. Your teacher will check it. Can you also give me one example in a sentence?`}
 else if(r.acc){const ns=score===3?"Learned":(S.states[card.id]==="Learned"?"Learned":"Learning");S.states[card.id]=ns;
  reply=`Ooh, I think I see! <b>${esc(card.test)}</b> → "${esc(card.good)}" `+(ns==="Learned"?"I understand this one now. ":"")+(score<3?"Can you add "+(!r.ex?"an example":"more detail")+"? ":"")+`<br><i>${esc(card.why)}</i>`}
 else reply="I am still confused. Can you explain the rule again, and give me an example?";
 S.log.push({w:"d",t:reply});}
function answer(c,i){const st=S.states[c.id];const ok=st==="Learned"||(st==="Learning"&&i%2===0);return{ok,t:ok?c.good:c.bad}}
// ---------- Views ----------
function mind(){return `<div class="p mind"><h3>Doceme's mind</h3><div class="mu">Card states kept in code.</div>${PACK.cards.map(c=>`<div class="c"><span>${c.id} ${esc(c.idea.slice(0,34))}…</span><span class="st ${S.states[c.id]||"Unknown"}">${S.states[c.id]||"Unknown"}</span></div>`).join("")}${S.level?`<p class="mu">Confusion level: <b>${S.level}</b></p>`:""}</div>`}
function mcq(items,k){return items.map((it,i)=>`<div class="p" style="margin:8px 0"><b>${i+1}. ${esc(it.q)}</b>${it.o.map((o,j)=>`<label class="o"><input type="radio" name="${k}${i}" value="${j}"> ${esc(o)}</label>`).join("")}</div>`).join("")}
function readMcq(items,k){return items.map((it,i)=>{const e=document.querySelector(`input[name="${k}${i}"]:checked`);return e&&+e.value===it.a?1:0})}
function render(){const a=$("#app");if(view==="teacher")return teacherView(a);
 const st=S.step;let h=`<div class="steps">${STEPS.map((s,i)=>`<span class="${i===st?"on":""}">${s}</span>`).join("")}</div><div class="grid"><div class="p">`;
 if(st===0)h+=`<h2>Choose a topic</h2><p>Doceme builds knowledge from the topic pack. Today's pack: <b>${PACK.topic}</b> (${PACK.level}), ${PACK.cards.length} concept cards, each checked against <i>${PACK.source}</i>.</p>
  <p class="mu">Free-topic packs (any subject, built from your upload or trusted sites) are the next step on the roadmap.</p>
  <label>Student code (no names)<input id="code" placeholder="e.g. 3AS-014" maxlength="12"></label><br><br><button class="btn" id="go">Start with the pre-test</button>`;
 if(st===1)h+=`<h2>Pre-test</h2><p class="mu">Five short questions. Your result sets how confused Doceme is.</p>${mcq(PACK.cards.map(c=>c.pre),"p")}<button class="btn" id="go">See Doceme</button>`;
 if(st===2)h+=`<h2>Learn first</h2><p>Worked example:</p><div class="p"><p>"Do you like English?" the teacher asked.</p><p>→ <b>The teacher asked <u>if</u> I liked English.</b></p>
  <ul><li>Add <b>if</b> (or <b>whether</b>).</li><li>Statement word order, so <b>do</b> disappears.</li><li>Verb one step back, pronoun changes, full stop at the end.</li></ul></div><br><button class="btn" id="go">I am ready to teach</button>`;
 if(st===3){const c=PACK.cards[S.cur];h+=`<h2>Teach Doceme</h2><p class="mu">Pick a rule, then explain it in your own words with an example. English, Arabic or French.</p>
  <select id="card">${PACK.cards.map((x,i)=>`<option value="${i}" ${i===S.cur?"selected":""}>${x.id}: ${esc(x.idea)}</option>`).join("")}</select><br><br>
  <div class="log" id="log">${S.log.length?"":'<div class="m d">Hello! I am Doceme. I do not know this topic yet. Please teach me!</div>'}${S.log.map(m=>`<div class="m ${m.w}">${m.w==="s"?esc(m.t):m.t}</div>`).join("")}</div>
  <textarea id="msg" rows="3" placeholder="Explain this rule to Doceme…"></textarea><br><br><button class="btn" id="send">Send</button> <button class="btn g" id="go">It is exam time</button>`}
 if(st===4){if(!S.exam)S.exam=PACK.cards.map((c,i)=>({c,...answer(c,i)}));const n=S.exam.filter(e=>e.ok).length;
  h+=`<h2>Doceme's exam</h2><p>One item per card. Doceme answers from what you taught. Score: <b>${n} / ${S.exam.length}</b> (computed in code).</p><div class="sc"><table><tr><th>Item</th><th>Doceme's answer</th><th></th></tr>${S.exam.map(e=>`<tr><td>${esc(e.c.test)}<br><span class="mu">${e.c.id}</span></td><td>${esc(e.t)}</td><td class="${e.ok?"ok":"no"}">${e.ok?"Correct":"Wrong"}</td></tr>`).join("")}</table></div><br><button class="btn" id="go">Hear the coach</button>`}
 if(st===5){const g=l=>PACK.cards.filter(c=>l.includes(S.states[c.id]||"Unknown"));const w=g(["Learned"]),k=g(["Learning"]),m=g(["Unknown","Mis-learned"]);
  const li=(a,f)=>a.length?`<ul>${a.map(f).join("")}</ul>`:'<p class="mu">None.</p>';
  h+=`<h2>The coach</h2><p>Lists come from code. Every source is a real section of the pack.</p><h3 class="ok">Taught well</h3>${li(w,c=>`<li>${c.id}: ${esc(c.idea)}</li>`)}
  <h3 style="color:var(--wr)">Taught weakly</h3>${li(k,c=>`<li>${c.id}: add a clear example. Review: ${esc(c.sec)}</li>`)}
  <h3 class="no">Not taught or taught wrongly</h3>${li(m,c=>`<li>${c.id}: ${esc(c.idea)} ${S.states[c.id]==="Mis-learned"?"Doceme learned a wrong idea. ":""}Review: <b>${esc(c.sec)}</b>, ${esc(PACK.source)}.</li>`)}<button class="btn" id="go">Take the post-test</button>`}
 if(st===6)h+=`<h2>Post-test</h2><p class="mu">New questions on the same cards.</p>${mcq(PACK.cards.map(c=>c.post),"q")}<button class="btn" id="go">See my results</button>`;
 if(st===7){const pr=S.pre.reduce((a,b)=>a+b,0),po=S.post.reduce((a,b)=>a+b,0);
  h+=`<h2>Your results</h2><p>Pre-test <b>${pr}/5</b> → post-test <b>${po}/5</b>. Learning gain: <b>${po-pr>=0?"+":""}${po-pr}</b>. Doceme's exam: <b>${S.exam.filter(e=>e.ok).length}/5</b>.</p><p class="mu">Doceme's score shows what you taught. Your own gain shows what you learned. They are measured separately.</p><button class="btn" id="go">New session</button>`}
 h+=`</div>${mind()}</div>`;a.innerHTML=h;wire()}
function wire(){const go=$("#go");if(!go)return;const st=S.step;
 go.onclick=()=>{
  if(st===0){S.code=($("#code").value||"").trim();if(!S.code){$("#code").focus();$("#code").placeholder="Enter a code first";return}}
  if(st===1){S.pre=readMcq(PACK.cards.map(c=>c.pre),"p");const sc=S.pre.reduce((a,b)=>a+b,0);
   S.level=sc<=1?"Very confused":sc<=3?"Partly confused":"Almost there";
   PACK.cards.forEach((c,i)=>S.states[c.id]=(sc>1&&S.pre[i])?"Learning":"Unknown")}
  if(st===3&&!S.notes.length&&!confirm("You have not taught anything yet. Doceme will fail its exam. Continue?"))return;
  if(st===6){S.post=readMcq(PACK.cards.map(c=>c.post),"q");SESSIONS.push({code:S.code,topic:PACK.topic,pre:S.pre.reduce((a,b)=>a+b,0),post:S.post.reduce((a,b)=>a+b,0),exam:S.exam.filter(e=>e.ok).length,notes:S.notes});save()}
  if(st===7){S=fresh();render();return}
  S.step++;render()};
 if(st===3){$("#card").onchange=e=>S.cur=+e.target.value;
  $("#send").onclick=()=>{const t=$("#msg").value.trim();if(!t)return;teach(t);render();const l=$("#log");l.scrollTop=l.scrollHeight}}}
function teacherView(a){a.innerHTML=`<div class="p" style="margin-top:12px"><h2>Teacher dashboard</h2><p class="mu">Student codes only, no names. Data stays in this browser. Pack review: every card cites its source passage.</p>
 <h3>Pack review: ${esc(PACK.topic)}</h3><div class="sc"><table><tr><th>Card</th><th>Idea</th><th>Source</th></tr>${PACK.cards.map(c=>`<tr><td>${c.id}</td><td>${esc(c.idea)}</td><td>${esc(c.sec)}</td></tr>`).join("")}</table></div>
 <h3>Sessions</h3>${SESSIONS.length?`<div class="sc"><table><tr><th>Code</th><th>Pre</th><th>Post</th><th>Gain</th><th>Doceme</th><th>Notebook</th></tr>${SESSIONS.map(s=>`<tr><td>${esc(s.code)}</td><td>${s.pre}</td><td>${s.post}</td><td>${s.post-s.pre}</td><td>${s.exam}/5</td><td>${s.notes.map(n=>`${n.card} (${n.score}/3, ${n.lang}${n.paste?", pasted":""}): ${esc(n.summary)}`).join("<br>")||"-"}</td></tr>`).join("")}</table></div>`:'<p class="mu">No sessions yet. Run one as a student.</p>'}
 <br><button class="btn g" id="clr">Clear stored sessions</button></div>`;$("#clr").onclick=()=>{SESSIONS=[];save();teacherView(a)}}
$("#tS").onclick=()=>{view="student";render()};$("#tT").onclick=()=>{view="teacher";render()};
render();
