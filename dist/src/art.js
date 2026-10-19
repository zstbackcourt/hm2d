import {hunterPose,monsterPose,clamp} from './motion.js';
import {MONSTERS} from './content.js';
// Pixel silhouettes are drawn on a low-resolution canvas; no remote assets.
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const poly=(c,pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();};
const pivot=(c,x,y,angle,draw)=>{c.save();c.translate(x,y);c.rotate(angle);c.translate(-x,-y);draw();c.restore();};
const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
function pine(c,x,y,s,color){rect(c,x-2*s,y-25*s,4*s,28*s,'#364b46');for(let i=0;i<4;i++){const z=i*9*s;poly(c,[[x,y-63*s+z],[x-14*s-i*3*s,y-36*s+z],[x+14*s+i*3*s,y-36*s+z]],color);}}
function mountain(c,x,base,w,h,color){poly(c,[[x,base],[x+w*.15,base-h*.3],[x+w*.22,base-h*.3],[x+w*.39,base-h*.72],[x+w*.45,base-h*.72],[x+w*.55,base-h],[x+w*.62,base-h],[x+w*.76,base-h*.46],[x+w*.85,base-h*.46],[x+w,base]],color);}
export function background(c,W,H,area=0,time=0,camera=0){const floor=H-32;const palettes=[['#c3d4bd','#9fb7a7','#78998c','#567d72','#315e54','#d5d5ae'],['#c3d6dc','#a1bccb','#809eae','#597c8d','#365767','#dce5dc'],['#473e48','#66505a','#694b50','#593a41','#332e39','#785e59']];const p=palettes[area];rect(c,0,0,W,H,p[0]);
 rect(c,0,0,W,35,p[1]);for(let i=0;i<6;i++){let x=(i*119-camera*.08)%(W+150)-50;rect(c,x,30+i%3*9,70,4,area===2?'#876669':'#d4ddc9');rect(c,x+13,26+i%3*9,38,4,area===2?'#876669':'#d4ddc9');}
 rect(c,W*.72,29,30,30,area===2?'#c48266':'#eee6bc');rect(c,W*.72-4,35,38,18,area===2?'#c48266':'#eee6bc');
 for(let i=-1;i<7;i++){mountain(c,i*120-(camera*.13)%120,floor-24,170,80+noise(i+3)*55,p[2]);}for(let i=-1;i<9;i++)mountain(c,i*83-(camera*.27)%83,floor-8,110,45+noise(i+9)*55,p[3]);
 for(let i=-1;i<12;i++){const x=i*62-(camera*.45)%62;if(area!==2)pine(c,x,floor, .5+noise(i+20)*.7,p[4]);else mountain(c,x,floor,38,30+noise(i+20)*70,p[4]);}
 if(area===0){const x=325-camera*.25;rect(c,x,floor-71,6,72,'#66554b');rect(c,x+57,floor-71,6,72,'#66554b');rect(c,x-10,floor-75,83,7,'#785c4e');rect(c,x-14,floor-82,91,5,'#514e43');rect(c,x-18,floor-85,12,5,'#514e43');rect(c,x+69,floor-85,12,5,'#514e43');rect(c,x+3,floor-58,58,5,'#785c4e');rect(c,x+29,floor-73,7,17,'#c09a68');}
 rect(c,0,floor,W,H-floor,'#303f3b');rect(c,0,floor,W,5,p[5]);rect(c,0,floor+5,W,5,area===2?'#a15b48':'#6b8270');
 for(let i=0;i<W/7;i++){let x=i*7;rect(c,x,floor+11+noise(i+10)*14,3+Math.floor(noise(i)*5),2,area===2?'#be6845':'#4b5950');if(area===2&&i%5===0)rect(c,x,floor+17,9,3,'#f8a75f');if(area===0&&i%3===0){rect(c,x,floor-3,2,5,'#6d8970');rect(c,x+3,floor-5,2,7,'#6d8970');}}
 for(let i=0;i<13;i++){const x=(noise(i+50)*W+time*(2+i%3))%W,y=30+noise(i+80)*(floor-40)+Math.sin(time+i)*4;rect(c,x,y,area===2?2:1,2,area===2?'#e7a36a':'#e7e3bd');}
 return floor;
}
function arm(c,sx,sy,hx,hy,bend,color){
 const dx=hx-sx,dy=hy-sy,length=Math.hypot(dx,dy)||1;
 const ex=(sx+hx)/2-dy/length*bend,ey=(sy+hy)/2+dx/length*bend;
 const bone=(x,y,xx,yy,width,tint)=>{c.save();c.translate(x,y);c.rotate(Math.atan2(yy-y,xx-x));rect(c,0,-width/2,Math.hypot(xx-x,yy-y)+2,width,tint);c.restore();};
 bone(sx,sy,ex,ey,6,color);bone(ex,ey,hx,hy,5,'#667b76');rect(c,hx-2,hy-2,5,5,'#dfb98c');
}
function weaponArt(c,weapon){
 if(weapon==='bow'){poly(c,[[5,-27],[13,-17],[16,-3],[12,10],[5,18],[9,2],[9,-13]],'#c5a578');rect(c,5,-26,1,44,'#e4d9ae');rect(c,-5,-4,27,2,'#dadcc0');}
 else if(['lbg','hbg'].includes(weapon)){rect(c,0,-7,weapon==='hbg'?29:23,10,'#4d5350');rect(c,14,-10,10,5,'#a9aa8b');rect(c,-3,0,7,9,'#8f7151');rect(c,22,-5,9,6,'#c6c6ac');}
 else if(['hammer','horn'].includes(weapon)){rect(c,1,-25,4,36,'#967452');rect(c,-7,-30,20,15,'#a9b6a1');rect(c,-5,-29,5,12,'#d4cfac');if(weapon==='horn'){rect(c,10,-35,7,15,'#ad986d');rect(c,13,-34,7,5,'#dbcaa0');}}
 else{const wide=['gs','axe','cb'].includes(weapon)?10:4;rect(c,1,-37,wide,37,'#c7d7ca');rect(c,1,-37,2,34,'#e8e8c8');poly(c,[[1,-37],[1+wide,-37],[1+wide,-48]],'#d9dfc4');rect(c,-4,-3,wide+10,4,'#c0a16b');rect(c,2,1,3,11,'#665340');if(['lance','gunlance','glaive'].includes(weapon))rect(c,2,-52,3,68,'#c4c8ac');if(weapon==='db'){rect(c,-18,-24,4,25,'#d4ddc4');}if(['sns','cb','lance'].includes(weapon)){rect(c,-21,-11,12,17,'#7f9290');rect(c,-18,-8,6,11,'#b59c70');}}

}
export function hunter(c,x,y,gender='male',weapon='ls',face=1,t=0,action='idle',flash=false,body=null){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(face,1);if(flash)c.globalAlpha=.45;
 const pose=hunterPose(body||{action,stride:t*12},t,weapon),a=body?.swing;
 if(!body)rect(c,-13,-1,27,2,'#27453d');
 c.translate(0,pose.bob);c.scale(pose.scaleX,pose.scaleY);c.translate(0,-20);c.rotate(pose.roll);c.translate(0,20);
 const leg=(x,angle,knee)=>pivot(c,x,-15,angle,()=>{rect(c,x-3,-16,6,9,'#343c3d');pivot(c,x,-8,knee,()=>{rect(c,x-3,-8,6,7,'#475656');rect(c,x-3,-3,10,4,'#ac8158');});});
 leg(-5,pose.legB,pose.kneeB);leg(5,pose.legA,pose.kneeA);
 c.translate(0,-15);c.rotate(pose.lean);c.translate(0,15);
 const supportX=pose.handX-Math.sin(pose.weapon)*7,supportY=pose.handY+Math.cos(pose.weapon)*7;
 const offX=pose.offX+(supportX-pose.offX)*pose.twoHand,offY=pose.offY+(supportY-pose.offY)*pose.twoHand;
 arm(c,-9,-27,offX,offY,5,'#637d78');
 poly(c,[[-11,-30],[9,-30],[12,-17],[5,-11],[-10,-15]],'#3c686c');rect(c,-6,-29,11,13,'#79a4a0');rect(c,-8,-18,18,4,'#b49667');rect(c,-12,-29,6,10,'#d2c39b');rect(c,8,-29,7,7,'#d2c39b');
 pivot(c,0,-31,pose.head,()=>{rect(c,-6,-42,14,13,'#d7b18a');rect(c,-9,-43,17,5,'#343c3d');rect(c,-9,-40,5,9,'#343c3d');rect(c,4,-37,3,2,'#292f31');
 if(gender==='female'){rect(c,-12,-40,4,17,'#343c3d');rect(c,-15,-28,5,8,'#343c3d');}else{rect(c,-3,-47,5,4,'#343c3d');rect(c,-4,-49,6,3,'#343c3d');}});
 rect(c,-8,-31,17,5,'#b95845');poly(c,[[-6,-30],[-19,-32+Math.sin(t*9)*2+pose.scarf*.5],[-27,-27+Math.sin(t*9-1)*3+pose.scarf],[-12,-26]],'#bf6950');
 if(pose.trail>0&&a&&!a.ranged){
  c.save();c.translate(pose.handX,pose.handY);c.globalAlpha*=pose.trail*.8;
  c.strokeStyle=a.kind==='ult'?'#ffd875':a.kind==='attack'?'#fff3ce':'#8de2d0';c.lineWidth=a.kind==='ult'?5:3;c.beginPath();
  if(a.kind==='skill2'||a.thrust&&a.kind!=='ult'){c.moveTo(-15,0);c.lineTo(a.range/2,0);}
  else if(a.kind==='ult'){c.arc(0,0,55,-1.8,1.25);c.moveTo(40,-52);c.lineTo(47,28);}
  else c.arc(0,0,a.kind==='skill1'?52:42,pose.weapon-3,pose.weapon-1.1);
  c.stroke();c.restore();
 }
 arm(c,10,-27,pose.handX,pose.handY,5,'#576768');
 c.save();c.translate(pose.handX,pose.handY);c.rotate(pose.weapon);weaponArt(c,weapon);c.restore();
 if(pose.twoHand>.5)rect(c,offX-2,offY-2,5,5,'#dfb98c');rect(c,pose.handX-2,pose.handY-2,5,5,'#dfb98c');
 c.restore();
}
export function monster(c,x,y,id='izuchi',face=-1,t=0,state='idle',flash=false,body=null,death=0){c.save();c.translate(Math.round(x),Math.round(y));c.scale(face,1);if(flash)c.globalAlpha=.5;const pose=monsterPose(body||{state},t,id);rect(c,-38,-1,78,3,'#2d4940');c.translate(0,pose.bob+clamp(death)*18);c.rotate(pose.lean-pose.recoil+clamp(death)*1.3);

 if(id==='izuchi'){
 pivot(c,-24,-25,pose.tail,()=>{poly(c,[[-24,-28],[-53,-35],[-71,-51],[-81,-51],[-70,-34],[-44,-19],[-20,-15]],'#ae6b3f');poly(c,[[-73,-48],[-84,-65],[-80,-84],[-70,-92],[-70,-74],[-62,-58]],'#e4d1a2');poly(c,[[-72,-79],[-76,-68],[-72,-56],[-67,-60]],'#f0e4b5');});
 poly(c,[[-30,-40],[0,-48],[22,-38],[20,-18],[-4,-12],[-29,-23]],'#d18a48');poly(c,[[-20,-40],[-8,-52],[2,-43],[8,-49],[17,-35]],'#ead2a0');pivot(c,15,-38,pose.head,()=>{poly(c,[[5,-38],[24,-63],[43,-61],[55,-49],[40,-39],[24,-35]],'#d39757');poly(c,[[26,-62],[26,-71],[33,-63],[39,-69],[43,-60]],'#e4d3a4');rect(c,37,-55,5,4,'#343d37');rect(c,39,-55,2,2,'#edc67c');poly(c,[[45,-47],[59,-48],[55,-41],[39,-39]],'#e1c58f');rect(c,48,-43,7,2,'#614932');});
 pivot(c,-12,-21,-pose.leg,()=>{poly(c,[[-17,-21],[-21,-7],[-14,-3],[-4,-4],[-9,-9],[-7,-21]],'#9b613c');});pivot(c,5,-20,pose.leg,()=>{poly(c,[[7,-20],[10,-7],[20,-5],[21,-2],[4,-2],[-2,-17]],'#bb7740');});pivot(c,-12,-21,-pose.leg,()=>rect(c,-18,-3,15,3,'#e0cda0'));pivot(c,5,-20,pose.leg,()=>rect(c,8,-2,15,3,'#e0cda0'));poly(c,[[16,-33],[30,-24],[39,-27],[32,-19],[20,-22]],'#e4c48f');
 }else if(id==='arzuros'){
 poly(c,[[-34,-45],[-26,-66],[-4,-74],[20,-66],[30,-43],[26,-16],[7,-7],[-26,-15],[-37,-30]],'#3e717c');poly(c,[[-14,-59],[8,-63],[24,-48],[20,-21],[0,-13],[-14,-25]],'#bdad79');for(let i=0;i<5;i++)rect(c,-30+i%2*7,-54+i*9,12,5,'#6b99a0');
 pivot(c,4,-62,pose.head,()=>{rect(c,-11,-81,32,22,'#547e80');rect(c,-14,-85,8,8,'#436c73');rect(c,18,-85,8,8,'#436c73');rect(c,9,-69,22,12,'#cfb98a');rect(c,25,-69,7,5,'#334a49');rect(c,13,-76,4,3,'#eacb83');});
 pivot(c,18,-51,pose.arm,()=>{poly(c,[[12,-54],[30,-53],[41,-33],[36,-20],[23,-23],[18,-38]],'#558a91');for(let i=0;i<3;i++)poly(c,[[28+i*5,-27],[31+i*5,-26],[30+i*5,-15],[26+i*5,-18]],'#e1d5ae');});pivot(c,-20,-20,-pose.leg,()=>{rect(c,-28,-20,16,18,'#426d75');});pivot(c,15,-18,pose.leg,()=>{rect(c,7,-18,17,16,'#426d75');});pivot(c,-20,-20,-pose.leg,()=>rect(c,-30,-5,19,5,'#b6b491'));pivot(c,15,-18,pose.leg,()=>rect(c,8,-5,20,5,'#b6b491'));
 }else{
 pivot(c,-26,-25,pose.tail*.7,()=>{poly(c,[[-26,-30],[-55,-32],[-76,-43],[-95,-38],[-70,-25],[-46,-15],[-18,-12]],'#708457');poly(c,[[-83,-39],[-94,-48],[-92,-33],[-102,-30],[-88,-27]],'#a1aa70');});
 pivot(c,-10,-39,-pose.wing,()=>{poly(c,[[-28,-41],[-45,-72],[-41,-105],[-15,-91],[9,-60],[17,-35]],'#829360');poly(c,[[-39,-91],[-32,-69],[-20,-47],[5,-41],[-8,-68]],'#b5b27d');poly(c,[[-42,-102],[-44,-74],[-31,-45],[-25,-48],[-35,-76]],'#4f6c4d');});
 poly(c,[[-31,-37],[-8,-53],[29,-42],[35,-22],[8,-12],[-25,-15]],'#798b55');pivot(c,20,-40,pose.head,()=>{poly(c,[[-7,-47],[17,-67],[39,-61],[57,-45],[44,-35],[23,-34]],'#8f9e64');poly(c,[[25,-62],[29,-74],[34,-63],[43,-69],[45,-56]],'#bdbe8b');rect(c,37,-52,5,3,'#e4bc6a');rect(c,40,-52,2,2,'#29382e');poly(c,[[47,-43],[63,-42],[56,-34],[41,-35]],'#adad76');rect(c,47,-36,12,2,'#3b523d');});
 pivot(c,0,-38,pose.wing,()=>{poly(c,[[-9,-40],[9,-74],[29,-85],[21,-58],[25,-38],[16,-26]],'#899961');poly(c,[[10,-65],[22,-77],[16,-54],[20,-38],[7,-34]],'#c1b57c');});pivot(c,-12,-20,-pose.leg,()=>{poly(c,[[-18,-20],[-21,-4],[-5,-3],[-5,-7],[-9,-9],[-5,-21]],'#60784d');});pivot(c,15,-18,pose.leg,()=>{poly(c,[[16,-18],[19,-5],[33,-3],[34,0],[12,0],[8,-17]],'#60784d');});pivot(c,-12,-20,-pose.leg,()=>rect(c,-21,-3,17,3,'#d1c494'));pivot(c,15,-18,pose.leg,()=>rect(c,17,-2,18,3,'#d1c494'));
 }c.restore();}
export function renderBattle(canvas,b){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.save();c.scale(2,2);const W=canvas.width/2,H=canvas.height/2;const camera=Math.max(0,Math.min(b.width/2-W,b.p.x/2-W*.36));const ground=background(c,W,H,b.index,b.elapsed,camera);if(b.shake>0&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)c.translate(Math.round(Math.sin(b.elapsed*90)*b.shake/2),0);
 c.save();c.translate(-camera,ground);const m=b.m,p=b.p;if(m.state==='windup'){const range=m.move===1?140:75;rect(c,m.x/2+(m.face<0?-range:0),-3,range,3,'#e9ab69');c.globalAlpha=.15+.1*Math.sin(b.elapsed*20);rect(c,m.x/2+(m.face<0?-range:0),-36,range,36,'#f2a767');c.globalAlpha=1;}
 const shadow=13-clamp(-p.y/25,0,6);rect(c,p.x/2-shadow,-1,shadow*2,2,'#27453d');
 monster(c,m.x/2,0,b.spec.id,m.face,b.elapsed,m.state,m.flash>0,m,b.status==='won'?b.endAge:0);
 if(p.swing?.kind==='skill2'&&p.swing.age>p.swing.windup&&p.swing.age<p.swing.windup+p.swing.active){for(let i=2;i>0;i--){c.save();c.globalAlpha=.12/i;hunter(c,p.x/2-p.face*i*12,p.y/2,b.save.gender,b.w.id,p.face,b.elapsed,p.action,false,p);c.restore();}}
 hunter(c,p.x/2,p.y/2,b.save.gender,b.w.id,p.face,b.elapsed,p.action,p.inv>0&&Math.floor(b.elapsed*20)%2===0,p);
 for(const f of b.particles||[]){c.globalAlpha=clamp(f.life/f.max);rect(c,f.x/2,f.y/2,2,2,f.color);}c.globalAlpha=1;

 for(const q of b.projectiles){rect(c,q.x/2-4,q.y/2,9,q.owner==='monster'?6:q.ult?5:2,q.owner==='monster'?'#ffb66d':'#e7e4ae');rect(c,q.x/2-7,q.y/2+1,3,2,'#d9824c');}
 for(const f of b.fx){c.globalAlpha=Math.min(1,f.life*2);c.fillStyle=f.color;c.font='bold 10px monospace';c.textAlign='center';c.fillText(f.text,f.x/2,f.y/2);}c.globalAlpha=1;
 if(m.state==='windup'){c.font='bold 9px sans-serif';c.textAlign='center';c.fillStyle='#fff0bf';c.fillText('! '+b.spec.moves[m.move],m.x/2,-105);}
 c.restore();c.restore();}
export function renderScene(canvas,area=0,time=0,save=null){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.save();c.scale(2,2);const W=canvas.width/2,H=canvas.height/2,g=background(c,W,H,area,time,0);hunter(c,W*.59,g,save?.gender||'female',save?.weapon||'ls',1,time);monster(c,W*.82,g,MONSTERS[area].id,-1,time);c.restore();}
export function portrait(canvas,id){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.save();c.translate(canvas.width/2,canvas.height-12);c.scale(1.5,1.5);monster(c,0,0,id,-1,0);c.restore();}
