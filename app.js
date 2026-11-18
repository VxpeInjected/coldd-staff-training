var $=function(s){return document.querySelector(s)},M=$("main"),K="coldd-training-v1";
var S;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}
S=S||{v:"home",i:0,a:{},d:{}};
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function team(){return TEAMS.filter(function(t){return t.id===S.t})[0]}
function go(v){S.v=v;save();render();scrollTo(0,0)}
function reset(){S={v:"home",i:0,a:{},d:S.d};save();render()}
var LV=[["Foundation","You are at the start of this. Work the exercises in order and expect to want a senior’s review on early cases."],
["Developing","Your instincts are good but not yet consistent. The exercises below turn them into habits."],
["Proficient","You handle most situations well. Focus on your weakest area and on edge cases."],
["Advanced","You are ready for hard cases and for helping train others. Use the exercises to sharpen the edges."]];
function lv(p){return p<.34?0:p<.6?1:p<.85?2:3}
function score(){var t=team(),r=t.comps.map(function(){return 0});
t.qs.forEach(function(q,i){var a=S.a[t.bg.length+i];if(a!=null)r[q.c]+=q.o[a][1]});return r}
function render(){var t=team(),h="",st=$("#st");st.textContent="";
if(S.v==="home"){h='<div class="hero fade"><img src="banner.jpg" alt="coldd"></div><div class="intro"><h1 class="fade" style="--d:.2s">Staff Training</h1><p class="fade mut" style="--d:.35s">Choose your team. Answer a short set of questions about how you would handle real situations. You will get an overview of where you stand and a set of exercises to build the skills that matter most for your role.</p><button class="btn fade" style="--d:.5s" id="go">Begin</button></div>';
M.className="wide";M.innerHTML=h;$("#go").onclick=function(){go("team")};return}
M.className="";
if(S.v==="team"){h='<h1>Choose your team</h1><p class="mut" style="margin-bottom:2rem">Pick the department you work in or are joining.</p>'+TEAMS.map(function(x){return'<button class="row" data-t="'+x.id+'"><h2>'+x.name+'</h2><p>'+x.line+'</p></button>'}).join("");
M.innerHTML=h;M.querySelectorAll(".row").forEach(function(b){b.onclick=function(){if(S.t!==b.dataset.t){S.a={};S.i=0}S.t=b.dataset.t;go("quiz")}});return}
if(S.v==="quiz"){var Q=t.bg.map(function(x){return{q:x.q,o:x.o.map(function(y){return[y,0]})}}).concat(t.qs),q=Q[S.i];
st.textContent=t.name+", question "+(S.i+1)+" of "+Q.length;
h='<div class="bar"><i style="width:'+(S.i/Q.length*100)+'%"></i></div><div class="q"><div class="qn">'+(S.i<t.bg.length?"About you":"Scenario")+'</div><h2>'+q.q+'</h2>'+q.o.map(function(o,j){return'<button class="opt'+(S.a[S.i]===j?" on":"")+'" data-j="'+j+'"><b>'+"ABCD"[j]+'</b><span>'+o[0]+'</span></button>'}).join("")+'</div><button class="btn q" id="bk">Back</button>';
M.innerHTML=h;M.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){S.a[S.i]=+b.dataset.j;save();b.classList.add("on");setTimeout(function(){if(S.i+1>=Q.length){go("results")}else{S.i++;save();render()}},220)}});
$("#bk").onclick=function(){if(S.i>0){S.i--;save();render()}else go("team")};return}
var sc=score(),tot=sc.reduce(function(a,b){return a+b},0),mx=t.comps.length*6,L=LV[lv(tot/mx)],order=t.comps.map(function(_,i){return i}).sort(function(a,b){return sc[a]-sc[b]});
st.textContent=t.name;
var bgl=t.bg.map(function(x,i){return S.a[i]!=null?x.o[S.a[i]]:null}).filter(Boolean).join(", ");
h='<div class="qn">'+t.name+' overview</div><div class="lvl">'+L[0]+'</div><p>'+L[1]+'</p><p class="mut">'+t.good+'</p><p class="pg">You told us: '+bgl+'.</p><div class="sec"><h3>Where you stand</h3>'+t.comps.map(function(c,i){return'<div class="cb"><div><span>'+c+'</span><span>'+LV[lv(sc[i]/6)][0]+'</span></div><div class="tr"><i style="width:'+(sc[i]/6*100)+'%"></i></div></div>'}).join("")+'</div>';
var all=0,dn=0;
h+='<div class="sec"><h3>Your training path</h3><p class="mut">Ordered with your weakest area first. Do the exercises, tick off your self-check, then mark each one complete.</p><p class="pg" id="pp"></p>';
order.forEach(function(c){h+='<h3 style="margin-top:1.8rem;font-size:1.25rem">'+t.comps[c]+'</h3>';
t.ex.forEach(function(e,n){if(e.c!==c)return;var id=t.id+n;all++;if(S.d[id])dn++;
h+='<details class="ex'+(S.d[id]?" done":"")+'"><summary><span>'+e.t+'</span><span>'+e.m+' min</span></summary><p>'+e.d+'</p><p class="pg">You are done when:</p><ul>'+e.k.map(function(k){return'<li>'+k+'</li>'}).join("")+'</ul><label><input type="checkbox" data-id="'+id+'"'+(S.d[id]?" checked":"")+'> Mark complete</label></details>'})});
h+='</div><details class="rv"><summary>Review your answers</summary>'+t.qs.map(function(q,i){var a=S.a[t.bg.length+i],best=q.o.filter(function(o){return o[1]===3})[0][0];return'<p><b>'+q.q+'</b><small>You chose: '+q.o[a][0]+'</small><small>Strongest answer: '+best+'</small><small>'+q.why+'</small></p>'}).join("")+'</details><button class="btn q" id="rt">Retake assessment</button> <button class="btn q" id="tm">Change team</button>';
M.innerHTML=h;
function pp(){$("#pp").textContent=dn+" of "+all+" exercises complete"}pp();
M.querySelectorAll(".ex input").forEach(function(c){c.onchange=function(){S.d[c.dataset.id]=c.checked;save();dn=Object.keys(S.d).filter(function(k){return S.d[k]&&k.indexOf(t.id)===0}).length;c.closest(".ex").classList.toggle("done",c.checked);pp()}});
$("#rt").onclick=function(){S.a={};S.i=0;go("quiz")};$("#tm").onclick=function(){go("team")}}
if(S.v==="quiz"&&!S.t)S.v="team";if(S.v==="results"&&!S.t)S.v="team";if(S.v==="results"&&S.t){var tt=team(),n=tt.bg.length+tt.qs.length;for(var z=0;z<n;z++)if(S.a[z]==null){S.v="quiz";S.i=z;break}}
render();
