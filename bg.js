(function(){var c=document.getElementById("bg"),x=c.getContext("2d"),W,H,P=[],m={x:-999,y:-999},rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function size(){W=c.width=innerWidth;H=c.height=innerHeight;P=[];for(var i=0;i<Math.min(70,W*H/16000);i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3})}
addEventListener("resize",size);addEventListener("pointermove",function(e){m.x=e.clientX;m.y=e.clientY});size();
function f(){x.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var a=P[i];if(!rm){a.x+=a.vx;a.y+=a.vy}if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
var dm=Math.hypot(a.x-m.x,a.y-m.y);x.fillStyle=dm<140?"#8fd0ff":"rgba(61,139,255,.6)";x.beginPath();x.arc(a.x,a.y,dm<140?2.2:1.4,0,6.3);x.fill();
for(var j=i+1;j<P.length;j++){var b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){x.strokeStyle="rgba(61,139,255,"+(.22*(1-d/130))+")";x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
if(dm<160){x.strokeStyle="rgba(143,208,255,"+(.5*(1-dm/160))+")";x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke()}}
if(!rm&&!document.hidden)requestAnimationFrame(f);else if(!rm)setTimeout(function(){requestAnimationFrame(f)},500)}
f()})();
