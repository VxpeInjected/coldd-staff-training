var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))},M=$("#app"),K="coldd-training-v2";
var S;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}
S=S||{};S.v=S.v||"home";S.i=S.i||0;S.a=S.a||{};S.d=S.d||{};S.hist=S.hist||[];S.self=S.self||[3,3,3];
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function team(){return TEAMS.filter(function(t){return t.id===S.t})[0]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function go(v){S.v=v;save();render();scrollTo(0,0)}
var TYPE={single:"Scenario",multi:"Select all that apply",order:"Put in order",tap:"Spot the problems",scale:"Self rating"};
var KIND={sim:"Simulation",build:"Builder",order:"Ordering",flash:"Flashcards",write:"Writing"};
var LV=[["Foundation","You are at the start of this. Work the path in order and expect to want a senior’s review on early cases."],["Developing","Your instincts are good but not yet consistent. The path below turns them into habits."],["Proficient","You handle most situations well. Focus on your weakest area and on edge cases."],["Advanced","You are ready for hard cases and for helping train others. Use the path to sharpen the edges."]];
function lv(p){return p<.34?0:p<.6?1:p<.85?2:3}
function QL(t){return[{t:"single",bg:1,q:t.bg[0].q,o:t.bg[0].o.map(function(x){return[x,0]})},{t:"single",bg:1,q:t.bg[1].q,o:t.bg[1].o.map(function(x){return[x,0]})},{t:"scale",bg:1,q:"How confident are you in each area right now?",items:t.comps}].concat(t.qs)}
function qsc(q,a){if(a==null)return 0;
if(q.t==="single")return q.o[a][1]/3;
if(q.t==="multi"){var tc=q.o.filter(function(o){return o[1]}).length,r=0;a.forEach(function(i){r+=q.o[i][1]?1:-1});return Math.max(0,r/tc)}
if(q.t==="order"){var n=0;a.forEach(function(id,p){if(id===p)n++});return n/q.items.length}
if(q.t==="tap"){var f=q.segs.filter(function(s){return s[1]}).length,r2=0;a.forEach(function(i){r2+=q.segs[i][1]?1:-1});return Math.max(0,r2/f)}
return 0}
function calc(t){var p=t.comps.map(function(){return[]});t.qs.forEach(function(q,i){p[q.c].push(qsc(q,S.a[3+i]))});return p.map(function(a){return a.reduce(function(x,y){return x+y},0)/a.length})}
function rev(n){var a=[];for(var i=n-1;i>=0;i--)a.push(i);return a}

/* effects */
function post(){
$$("[data-n]").forEach(function(el){var to=+el.dataset.n,s=el.dataset.s||"",t0=null;function f(t){t0=t0||t;var p=Math.min(1,(t-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)});
setTimeout(function(){$$("[data-w]").forEach(function(el){el.style.width=el.dataset.w+"%"});$$("[data-l]").forEach(function(el){el.style.left=el.dataset.l+"%"});$$("[data-p]").forEach(function(el){el.style.strokeDasharray=(el.dataset.p*el.dataset.c)+" 999"})},200);
}
function donut(p,txt,sub,big){var c=2*Math.PI*48;return'<div class="donut" style="'+(big?"":"width:3.4rem;height:3.4rem")+'"><svg viewBox="0 0 120 120"><circle class="t" cx="60" cy="60" r="48"/><circle class="v" cx="60" cy="60" r="48" data-p="'+p+'" data-c="'+c+'"/></svg><div style="'+(big?"":"font-size:.8rem")+'"><span>'+txt+'</span>'+(sub?'<small>'+sub+'</small>':"")+'</div></div>'}

/* charts */
function radar(labels,series){var n=labels.length;function pt(i,v){var a=-Math.PI/2+i*2*Math.PI/n;return[160+Math.cos(a)*110*v,160+Math.sin(a)*110*v]}
var s='<svg class="radar" viewBox="-70 -5 460 330" role="img" aria-label="Radar chart of competencies">';
[.25,.5,.75,1].forEach(function(r){s+='<polygon class="rg" points="'+labels.map(function(_,i){return pt(i,r).join(",")}).join(" ")+'"/>'});
labels.forEach(function(l,i){var p=pt(i,1),q=pt(i,1.18),an=q[0]<150?"end":q[0]>170?"start":"middle",w=l.split(" "),h=Math.ceil(w.length/2);
s+='<line class="rg" x1="160" y1="160" x2="'+p[0]+'" y2="'+p[1]+'"/><text x="'+q[0]+'" y="'+q[1]+'" text-anchor="'+an+'"><tspan x="'+q[0]+'" dy="0">'+w.slice(0,h).join(" ")+'</tspan><tspan x="'+q[0]+'" dy="13">'+w.slice(h).join(" ")+'</tspan></text>'});
series.forEach(function(se,k){var pts=se.v.map(function(v,i){return pt(i,Math.max(.03,v)).join(",")}).join(" ");
s+='<g class="pt p'+(k+1)+'"><polygon points="'+pts+'" fill="'+se.fill+'" stroke="'+se.stroke+'" stroke-width="2"'+(se.dash?' stroke-dasharray="5 4"':"")+'/>'+(se.dash?"":se.v.map(function(v,i){var p=pt(i,Math.max(.03,v));return'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#fff"/>'}).join(""))+'</g>'});
return s+'</svg>'}
function lineChart(vals,w,h,lab){var n=vals.length,px=function(i){return 30+(n===1?0:i*(w-50)/(n-1))},py=function(v){return h-20-v*(h-40)};
var s='<svg class="line" viewBox="0 0 '+w+' '+h+'" style="width:100%">';
[0,.5,1].forEach(function(g){s+='<line x1="30" x2="'+(w-10)+'" y1="'+py(g)+'" y2="'+py(g)+'" stroke="#2b3040"/><text x="2" y="'+(py(g)+3)+'">'+Math.round(g*100)+'</text>'});
s+='<path class="ln" d="M'+vals.map(function(v,i){return px(i)+","+py(v)}).join(" L")+'"/>';
vals.forEach(function(v,i){s+='<circle cx="'+px(i)+'" cy="'+py(v)+'" r="4" fill="#8fd0ff"/><text x="'+px(i)+'" y="'+(h-4)+'" text-anchor="middle">'+(lab?lab[i]:i+1)+'</text>'});
return s+'</svg>'}

/* order widget */
function orderW(ul,items,arr,chg){function draw(){ul.innerHTML=arr.map(function(id,p){return'<li class="oi" draggable="true" data-p="'+p+'"><span class="n">'+(p+1)+'</span><span class="ot">'+items[id]+'</span><span class="ob"><button aria-label="Move up" data-m="-1">↑</button><button aria-label="Move down" data-m="1">↓</button></span></li>'}).join("");bind()}
function mv(a,b){if(b<0||b>=arr.length||a==null)return;var x=arr.splice(a,1)[0];arr.splice(b,0,x);chg();draw()}
function bind(){$$("li",ul).forEach(function(li){var p=+li.dataset.p;$$("button",li).forEach(function(b){b.onclick=function(){mv(p,p+ +b.dataset.m)}});
li.ondragstart=function(e){e.dataTransfer.setData("text","x");ul._d=p;li.classList.add("drag")};li.ondragend=function(){li.classList.remove("drag")};li.ondragover=function(e){e.preventDefault()};li.ondrop=function(e){e.preventDefault();mv(ul._d,p)}})}draw()}

/* views */
function unlocked(id){try{return JSON.parse(sessionStorage.getItem("coldd-unlocked")||"[]").indexOf(id)>-1}catch(e){return false}}
function unlock(id){try{var u=JSON.parse(sessionStorage.getItem("coldd-unlocked")||"[]");u.push(id);sessionStorage.setItem("coldd-unlocked",JSON.stringify(u))}catch(e){}}
function sha(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(function(b){return[].map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")})}
function answered(t){var n=QL(t).length;for(var z=3;z<n;z++)if(S.a[z]==null)return false;return true}
function enter(id){var t=TEAMS.filter(function(x){return x.id===id})[0];if(S.t===id&&S.hist.some(function(h){return h.t===id})&&answered(t)){go("results");return}S.t=id;S.i=0;S.a={};S.self=[3,3,3];go("quiz")}
function home(){var lock='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
M.innerHTML='<img class="banner" src="banner.jpg" alt="coldd"><h1>Staff training</h1><p class="intro">Training for coldd Development staff. Choose your department and enter the password your team lead gave you. You will answer a short assessment about situations you may face on the job, then get a training plan based on your answers. It takes around 10 minutes.</p><h2 class="sub">Departments</h2><div class="depts">'+TEAMS.map(function(t){var done=S.hist.some(function(h){return h.t===t.id}),dn=t.ex.filter(function(_,n){return S.d[t.id+n]!=null}).length;return'<button class="dept" data-t="'+t.id+'"><span><b>'+t.name+'</b><span class="mut">'+t.line+'</span>'+(done?'<small>Assessment done, '+dn+' of '+t.ex.length+' exercises complete</small>':"")+'</span><span class="lk">'+lock+'Password</span></button>'}).join("")+'</div>';
$$(".dept").forEach(function(b){b.onclick=function(){if(unlocked(b.dataset.t))enter(b.dataset.t);else{S.g=b.dataset.t;go("gate")}}})}
function gate(){var t=TEAMS.filter(function(x){return x.id===S.g})[0];if(!t){S.v="home";return home()}
M.innerHTML='<button class="btn ghost" id="bk">Back</button><h1 style="margin-top:2rem">'+t.name+'</h1><p class="intro">Enter the department password. If you do not have it, ask your team lead.</p><div class="gate"><input id="pw" type="password" autocomplete="off" placeholder="Password" aria-label="Password"><button class="btn" id="en">Continue</button></div><p class="err" id="er" role="alert"></p>';
var inp=$("#pw");inp.focus();
function tryit(){if(!window.crypto||!crypto.subtle){$("#er").textContent="This page needs a secure (https) connection to check passwords.";return}sha(t.id+":"+inp.value.trim()).then(function(h){if(h===t.pw){unlock(t.id);enter(t.id)}else{$("#er").textContent="That password is not correct.";inp.select()}})}
$("#en").onclick=tryit;inp.onkeydown=function(e){if(e.key==="Enter")tryit()};$("#bk").onclick=function(){go("home")}}
function quiz(){var t=team(),Q=QL(t),i=S.i,q=Q[i];
M.innerHTML='<div class="bar">'+Q.map(function(_,k){return'<i class="'+(k<i?"d":k===i?"c":"")+'"></i>'}).join("")+'</div><div class="qm"><span>'+(q.bg?"Profile / ":"")+TYPE[q.t]+'</span><span>'+(i+1)+' / '+Q.length+'</span></div><div class="qc"><h2>'+q.q+'</h2><div id="qb"></div></div><div class="qf"><button class="btn ghost" id="bk">Back</button><button class="btn" id="lk">Lock in</button></div>';
var b=$("#qb"),lk=$("#lk");
function nx(){if(i+1>=Q.length){var per=calc(t),tot=per.reduce(function(x,y){return x+y},0)/per.length;S.hist.push({t:t.id,ts:Date.now(),tot:tot,sc:per,self:S.self.slice()});go("results")}else{S.i++;go("quiz")}}
lk.onclick=nx;$("#bk").onclick=function(){if(i>0){S.i--;go("quiz")}else go("home")};
if(q.t==="single"){lk.style.display="none";b.innerHTML=q.o.map(function(o,j){return'<button class="opt'+(S.a[i]===j?" on":"")+'" data-j="'+j+'"><b>'+"ABCD"[j]+'</b><span>'+o[0]+'</span></button>'}).join("");
$$(".opt",b).forEach(function(x){x.onclick=function(){S.a[i]=+x.dataset.j;save();$$(".opt",b).forEach(function(y){y.classList.remove("on")});x.classList.add("on");setTimeout(nx,260)}})}
else if(q.t==="multi"){S.a[i]=S.a[i]||[];lk.disabled=!S.a[i].length;b.innerHTML=q.o.map(function(o,j){return'<button class="opt ck'+(S.a[i].indexOf(j)>-1?" on":"")+'" data-j="'+j+'"><b></b><span>'+o[0]+'</span></button>'}).join("");
$$(".opt",b).forEach(function(x){x.onclick=function(){var j=+x.dataset.j,k=S.a[i].indexOf(j);if(k>-1)S.a[i].splice(k,1);else S.a[i].push(j);x.classList.toggle("on");lk.disabled=!S.a[i].length;save()}})}
else if(q.t==="order"){S.a[i]=S.a[i]||rev(q.items.length);b.innerHTML='<p class="mut">Drag the items, or use the arrows.</p><ul class="ol"></ul>';orderW($(".ol",b),q.items,S.a[i],save)}
else if(q.t==="tap"){S.a[i]=S.a[i]||[];b.innerHTML='<p class="mut">Tap the parts that should be fixed.</p><div class="msg">'+q.segs.map(function(s,j){return'<button data-j="'+j+'" class="'+(S.a[i].indexOf(j)>-1?"on":"")+'">'+s[0]+'</button>'}).join("")+'</div>';
$$("button",b).forEach(function(x){x.onclick=function(){var j=+x.dataset.j,k=S.a[i].indexOf(j);if(k>-1)S.a[i].splice(k,1);else S.a[i].push(j);x.classList.toggle("on");save()}})}
else{b.innerHTML='<p class="mut">This is not scored. It is compared with your results later.</p>'+q.items.map(function(c,j){return'<div class="sl"><div><span>'+c+'</span><output id="o'+j+'">'+S.self[j]+' / 5</output></div><input type="range" min="1" max="5" step="1" value="'+S.self[j]+'" data-j="'+j+'" aria-label="'+c+'"></div>'}).join("");
$$("input",b).forEach(function(x){x.oninput=function(){S.self[+x.dataset.j]=+x.value;$("#o"+x.dataset.j).textContent=x.value+" / 5";save()}})}}
function corr(q){if(q.t==="single")return q.o.filter(function(o){return o[1]===3})[0][0];if(q.t==="multi")return q.o.filter(function(o){return o[1]}).map(function(o){return o[0]}).join("; ");if(q.t==="order")return q.items.join(" > ");return q.segs.filter(function(s){return s[1]}).map(function(s){return s[0].trim()}).join(" / ")}
function mine(q,a){if(a==null)return"No answer";if(q.t==="single")return q.o[a][0];if(q.t==="multi")return a.length?a.map(function(i){return q.o[i][0]}).join("; "):"Nothing selected";if(q.t==="order")return a.map(function(i){return q.items[i]}).join(" > ");return a.length?a.map(function(i){return q.segs[i][0].trim()}).join(" / "):"Nothing tapped"}
function results(){var t=team(),per=calc(t),tot=per.reduce(function(a,b){return a+b},0)/per.length,L=LV[lv(tot)],self=S.self.map(function(v){return v/5}),hist=S.hist.filter(function(h){return h.t===t.id}),
ord=per.map(function(_,i){return i}).sort(function(a,b){return per[a]-per[b]}),weak=ord[0],best=ord[ord.length-1],pc=function(v){return Math.round(v*100)};
var all=t.ex.length,dn=t.ex.filter(function(_,n){return S.d[t.id+n]!=null}).length;
var h='<div class="tag">'+t.name+' / report</div><div class="lvl" style="margin-top:1.2rem">'+donut(tot,'<span data-n="'+pc(tot)+'" data-s="%">0%</span>','overall',1)+'<div><div class="lname">'+L[0]+'</div><p>'+L[1]+'</p><p class="mut">'+t.good+'</p></div></div>';
h+='<div class="two"><div class="panel cut"><h3>Skill radar</h3><p class="mut">Tested results against how you rated yourself.</p>'+radar(t.comps,[{v:self,fill:"rgba(138,148,170,.12)",stroke:"#8a94aa",dash:1},{v:per,fill:"rgba(61,139,255,.3)",stroke:"#8fd0ff"}])+'<div class="lg"><span><i></i>tested</span><span><i class="s"></i>self rating</span></div></div>';
h+='<div class="panel cut"><h3>Competency scores</h3><p class="mut">White marker is your self rating.</p>'+t.comps.map(function(c,i){var g=self[i]-per[i],tg=g>.25?"confidence ahead of results":g<-.25?"you rate yourself lower than you scored":"well calibrated";return'<div class="cb"><div class="r"><span>'+c+'</span><span><span data-n="'+pc(per[i])+'" data-s="%">0%</span> / '+LV[lv(per[i])][0]+'</span></div><div class="tr"><i data-w="'+pc(per[i])+'"></i><u data-l="'+pc(self[i])+'"></u></div><div class="mono mut" style="font-size:.72rem;margin-top:.3rem">'+tg+'</div></div>'}).join("")+'</div></div>';
h+='<div class="panel cut"><h3>Overview</h3><p>Your strongest area is <b>'+t.comps[best]+'</b> at '+pc(per[best])+'%. Your priority is <b>'+t.comps[weak]+'</b> at '+pc(per[weak])+'%, so your training path starts there.</p></div>';
h+='<div class="panel cut"><h3>Progress over attempts</h3>'+(hist.length>1?lineChart(hist.map(function(x){return x.tot}),320,130,hist.map(function(_,i){return"#"+(i+1)})):'<p class="mut">Retake the assessment after some training to chart your progress here.</p>')+'</div>';
h+='<div class="sec"><div class="ch"><span>Your training path</span><span class="mono mut">'+dn+' / '+all+' complete</span></div><p class="mut">Ordered with your weakest area first. Each exercise is interactive.</p><div class="tr" style="margin-bottom:1rem"><i data-w="'+Math.round(dn/all*100)+'"></i></div>';
ord.forEach(function(c){var ex=t.ex.map(function(e,n){return[e,n]}).filter(function(x){return x[0].c===c}),d=ex.filter(function(x){return S.d[t.id+x[1]]!=null}).length;
h+='<div class="ch"><span style="font-size:1.05rem">'+t.comps[c]+'</span>'+donut(d/ex.length,d+'/'+ex.length,"",0)+'</div><div class="xg">'+ex.map(function(x){var e=x[0],id=t.id+x[1],s=S.d[id];return'<button class="card xc'+(s!=null?" done":"")+'" data-e="'+x[1]+'"><span class="k">'+KIND[e.k]+'</span><h3>'+e.t+'</h3><span class="f"><span>'+e.m+' min</span><span>'+(s!=null?"best "+s+"%":"not started")+'</span></span></button>'}).join("")+'</div>'});
h+='</div><details class="rv sec"><summary>Review your answers</summary>'+t.qs.map(function(q,i){return'<div class="q"><b>'+q.q+'</b><small>You: '+mine(q,S.a[3+i])+'</small><small>Strongest: '+corr(q)+'</small><small>'+q.why+'</small></div>'}).join("")+'</details><div class="row"><button class="btn ghost" id="rt">Retake assessment</button><button class="btn ghost" id="tm">Change team</button></div>';
M.innerHTML=h;$$(".xc").forEach(function(b){b.onclick=function(){S.e=+b.dataset.e;go("ex")}});$("#rt").onclick=function(){S.a={};S.i=0;S.self=[3,3,3];go("quiz")};$("#tm").onclick=function(){go("home")};post()}

/* exercise engines */
function finish(el,id,score,extra){score=Math.round(score);S.d[id]=Math.max(S.d[id]||0,score);save();
el.innerHTML=(extra||"")+'<div class="fin"><div class="big" data-n="'+score+'" data-s="%">0%</div><p class="mut">Your best: '+S.d[id]+'%</p><div class="row" style="justify-content:center"><button class="btn" id="bp">Back to path</button><button class="btn ghost" id="rt2">Try again</button></div></div>';
$("#bp").onclick=function(){go("results")};$("#rt2").onclick=function(){render()};post();el.scrollIntoView({behavior:"smooth",block:"start"})}
function spark(h){var w=300,hh=70,s='<svg viewBox="0 0 '+w+' '+hh+'" style="width:100%;max-width:26rem" class="line"><path class="ln" d="M'+h.map(function(v,i){return(10+i*(w-20)/(h.length-1))+","+(hh-8-v/100*(hh-16))}).join(" L")+'"/>';h.forEach(function(v,i){s+='<circle cx="'+(10+i*(w-20)/(h.length-1))+'" cy="'+(hh-8-v/100*(hh-16))+'" r="3.5" fill="#8fd0ff"/>'});return s+'</svg>'}
var ENG={
sim:function(e,el,id){var mood=e.start,hist=[mood],n=0;
el.innerHTML='<div class="meter"><div class="r"><span>'+e.meter+'</span><span id="mv"></span></div><div class="tr"><i id="mb"></i></div></div><div class="chat" id="sc"></div><div id="so"></div>';
function setm(){$("#mv").textContent=mood+"%";$("#mb").style.width=mood+"%"}setm();
function step(){var s=e.steps[n];$("#sc").innerHTML+='<div class="bub"><small>'+e.who+'</small>'+s.say+'</div>';
$("#so").innerHTML=s.o.map(function(o,i){return'<button class="opt" data-i="'+i+'"><b>'+"ABC"[i]+'</b><span>'+o[0]+'</span></button>'}).join("");
$$(".opt",$("#so")).forEach(function(b){b.onclick=function(){pick(s.o[+b.dataset.i])}})}
function pick(o){mood=clamp(mood+o[1],0,100);hist.push(mood);setm();$("#sc").innerHTML+='<div class="bub me"><small>You</small>'+o[0]+'</div>';
$("#so").innerHTML='<div class="fb '+(o[1]>0?"g":"b")+'">'+(o[1]>0?"+":"")+o[1]+'. '+o[2]+'</div><button class="btn" id="nx">'+(n+1>=e.steps.length?"See result":"Continue")+'</button>';
$("#nx").onclick=function(){n++;if(n>=e.steps.length){var msg=mood>=70?"Excellent. You kept the conversation on track.":mood>=45?"Solid. A few replies could be stronger.":"Tough one. Review the feedback and try again.";finish(el,id,mood,'<p>'+msg+'</p><p class="mut">'+e.meter+' over the conversation</p>'+spark(hist))}else step()}}
$("#sc").innerHTML='<div class="fb g" style="border-color:var(--blue);background:rgba(61,139,255,.08)">'+e.intro+'</div>';step()},
build:function(e,el,id){var p=e.slots.map(function(){return null});
el.innerHTML=e.slots.map(function(s,i){return'<div class="slot"><div class="l">'+s.l+'</div>'+s.o.map(function(o,j){return'<button class="chip" data-s="'+i+'" data-j="'+j+'">'+o[0]+'</button>'}).join("")+'<div class="fb" id="f'+i+'" style="display:none"></div></div>'}).join("")+'<div class="l mono mut" style="font-size:.75rem">Your message</div><div class="pre" id="pv"></div><button class="btn" id="sb" disabled>Submit</button>';
$$(".chip",el).forEach(function(c){c.onclick=function(){var i=+c.dataset.s;if($("#sb").dataset.done)return;p[i]=+c.dataset.j;$$(".chip[data-s='"+i+"']",el).forEach(function(x){x.classList.remove("on")});c.classList.add("on");$("#pv").textContent=p.map(function(v,k){return v==null?"...":e.slots[k].o[v][0]}).join(" ");$("#sb").disabled=p.indexOf(null)>-1}});
$("#sb").onclick=function(){$("#sb").dataset.done=1;var sum=0;e.slots.forEach(function(s,i){var o=s.o[p[i]],bst=s.o.filter(function(x){return x[1]===3})[0][0];sum+=o[1];var f=$("#f"+i);f.style.display="block";f.className="fb "+(o[1]===3?"g":"b");f.textContent=o[1]===3?"Strongest choice.":"Stronger: "+bst;$$(".chip[data-s='"+i+"']",el)[p[i]].classList.add(o[1]===3?"g":"b")});
$("#sb").remove();var sc=sum/(3*e.slots.length)*100;var d=document.createElement("div");el.appendChild(d);finish(d,id,sc,"")}},
order:function(e,el,id){var a=rev(e.items.length);el.innerHTML='<p class="mut">Drag the items, or use the arrows.</p><ul class="ol"></ul><button class="btn" id="ck">Check order</button>';orderW($(".ol",el),e.items,a,function(){});
$("#ck").onclick=function(){var ok=0;a.forEach(function(x,p){if(x===p)ok++});var sc=ok/a.length*100,
h='<ul class="ol">'+a.map(function(x,p){return'<li class="oi '+(x===p?"ok":"no")+'" style="cursor:default"><span class="n">'+(p+1)+'</span><span class="ot">'+e.items[x]+'</span></li>'}).join("")+'</ul><div class="fb '+(sc===100?"g":"b")+'"><b>Correct order:</b> '+e.items.join(" > ")+'<br>'+e.why+'</div>';finish(el,id,sc,h)}},
flash:function(e,el,id){var q=e.cards.map(function(_,i){return i}),first={},n=e.cards.length;
function draw(){if(!q.length){var ok=0;for(var k in first)if(first[k])ok++;finish(el,id,ok/n*100,'<p class="mut">First-try recall</p>');return}
var c=e.cards[q[0]],m=n-q.length;el.innerHTML='<div class="r mono mut" style="font-size:.75rem">'+m+' / '+n+' mastered</div><div class="tr"><i style="width:'+(m/n*100)+'%"></i></div><div class="fl" id="fl"><div class="in"><div class="s"><div><small>Tap to flip</small>'+c[0]+'</div></div><div class="s"><div><small>Answer</small>'+c[1]+'</div></div></div></div><div class="row" id="fb" style="visibility:hidden;justify-content:center"><button class="btn ghost" id="ag">Again</button><button class="btn" id="gt">Got it</button></div>';
$("#fl").onclick=function(){$("#fl").classList.add("f");$("#fb").style.visibility="visible"};
$("#gt").onclick=function(){if(first[q[0]]==null)first[q[0]]=true;q.shift();draw()};$("#ag").onclick=function(){if(first[q[0]]==null)first[q[0]]=false;q.push(q.shift());draw()}}draw()},
write:function(e,el,id){el.innerHTML='<textarea id="ta" placeholder="Write here. Nothing is saved or sent."></textarea><div class="mono mut" style="font-size:.78rem;margin:.4rem 0 1rem"><span id="wc">0</span> / '+e.min+' words minimum</div><p>Self-check before you finish:</p>'+e.checks.map(function(c,i){return'<label class="ck2"><input type="checkbox" data-i="'+i+'"> '+c+'</label>'}).join("")+'<button class="btn" id="fn" style="margin-top:1.2rem" disabled>Finish</button>';
function up(){var w=$("#ta").value.trim().split(/\s+/).filter(Boolean).length;$("#wc").textContent=w;$("#fn").disabled=!(w>=e.min&&$$("input:checked",el).length===e.checks.length)}
$("#ta").oninput=up;$$("input",el).forEach(function(x){x.onchange=up});$("#fn").onclick=function(){finish(el,id,100,'<p class="mut">Self-checked against every criterion.</p>')}}};
function exView(){var t=team(),e=t.ex[S.e],id=t.id+S.e;
M.innerHTML='<button class="btn ghost" id="bk">Back to path</button><div class="ch" style="margin-top:1.8rem"><span class="tag">'+KIND[e.k]+' / '+t.comps[e.c]+'</span><span class="mono mut">'+e.m+' min</span></div><h1 style="font-size:clamp(1.8rem,5vw,3rem);margin:.6rem 0 1rem">'+e.t+'</h1><p class="mut">'+(e.intro||e.prompt||"Flip each card, then mark whether you knew it.")+'</p><div id="xb" class="panel cut"></div>';
$("#bk").onclick=function(){go("results")};ENG[e.k](e,$("#xb"),id)}
function render(){var t=team(),st=$("#st");
if(["home","gate","quiz","results","ex"].indexOf(S.v)<0)S.v="home";
if(["quiz","results","ex"].indexOf(S.v)>-1&&(!t||!unlocked(t.id)))S.v="home";
if(S.v==="results"||S.v==="ex"){var n=QL(t).length;for(var z=3;z<n;z++)if(S.a[z]==null){S.v="quiz";S.i=z;break}}
if(S.v==="ex"&&!t.ex[S.e])S.v="results";
st.textContent=t&&["quiz","results","ex"].indexOf(S.v)>-1?t.name:"";
({home:home,gate:gate,quiz:quiz,results:results,ex:exView})[S.v]();if(S.v==="quiz"||S.v==="ex")post()}
$("#hm").onclick=function(){go("home")};
render();
