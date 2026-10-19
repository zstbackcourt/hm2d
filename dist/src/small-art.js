import {smallPose} from './small-monsters.js';
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const poly=(c,pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const joint=(c,x,y,angle,draw)=>{c.save();c.translate(x,y);c.rotate(angle);draw();c.restore();};
export function drawSmall(c,s,time){
 if(s.hp<=0&&s.deadAge>1)return;
 const pose=smallPose(s,time),tint=s.color,light=s.accent;
 c.save();c.translate(Math.round(s.x/2),Math.round(s.y/2));
 if(s.hp<=0){c.globalAlpha=Math.max(0,1-s.deadAge);c.translate(0,5);c.rotate(s.deadAge*.8);}
 else if(s.flash>0)c.globalAlpha=.55;
 c.scale(s.face,1);c.translate(0,pose.bob);c.rotate(pose.lean);
 const flying=s.fly,quad=['lizard','deer','rhino'].includes(s.shape),bodyY=quad?-12:-17;
 const tail=()=>joint(c,-9,bodyY,pose.tail,()=>{poly(c,[[0,-3],[-13,-4],[-22,-10],[-19,-4],[-10,3],[0,3]],tint);if(s.kind==='izuchi')poly(c,[[-19,-5],[-23,-14],[-19,-19],[-16,-12]],light);});
 if(!['insect','deer','rhino'].includes(s.shape))tail();
 if(flying){
  for(const side of [-1,1])joint(c,-1,-18,side*pose.wing,()=>{if(s.shape==='insect')poly(c,[[0,0],[side*18,-14],[side*21,-8],[side*12,2]],light);else{poly(c,[[0,0],[side*18,-21],[side*24,-8],[side*12,-10],[side*6,2]],light);poly(c,[[0,0],[side*18,-21],[side*16,-15],[side*5,1]],tint);}});
 }
 // Legs have independent joints; short bodies remain readable beside the boss.
 if(!flying)for(const [x,a] of [[-8,pose.legB],[8,pose.legA]])joint(c,x,s.shape==='deer'?-15:bodyY+4,a,()=>{const length=s.shape==='deer'?16:quad?10:14;rect(c,-2,0,4,length,tint);rect(c,-2,length-2,7,3,light);});
 if(s.shape==='insect'){
  poly(c,[[-7,-19],[-3,-26],[4,-23],[6,-12],[0,-5],[-4,-9]],tint);
  joint(c,0,-7,pose.tail,()=>poly(c,[[-2,0],[1,8],[3,0]],'#cec7aa'));
  for(let i=0;i<3;i++)joint(c,0,-19+i*4,pose.arm,()=>poly(c,[[0,0],[10,3+i],[4,5+i],[2,3]],tint));
 }else if(s.shape==='rhino'){
  poly(c,[[-16,-9],[-14,-24],[0,-29],[14,-22],[14,-9]],tint);poly(c,[[-13,-21],[-3,-26],[5,-21],[1,-13],[-9,-13]],light);
 }else if(s.shape==='deer'){
  poly(c,[[-13,-13],[-13,-23],[6,-23],[11,-13]],tint);poly(c,[[4,-20],[9,-35],[14,-34],[13,-17]],light);
 }else{poly(c,[[-13,bodyY-3],[-9,bodyY-10],[8,bodyY-8],[13,bodyY],[5,bodyY+5],[-10,bodyY+4]],tint);
  if(s.kind==='jagras')for(let i=0;i<4;i++)poly(c,[[-10+i*5,bodyY-7],[-8+i*5,bodyY-14],[-4+i*5,bodyY-7]],light);
  if(s.kind==='uroktor')for(let i=0;i<4;i++)rect(c,-10+i*5,bodyY-5,3,6,light);
 }
 const hy=s.shape==='deer'?-31:s.shape==='rhino'?-19:bodyY-7;
 joint(c,10+pose.neck,hy,pose.head,()=>{
  if(s.shape==='insect'){poly(c,[[-4,-5],[3,-7],[7,-2],[4,4],[-3,3]],tint);rect(c,4,-4,3,3,light);poly(c,[[5,1],[13,6],[6,3]],light);rect(c,-1,-11,1,6,tint);return;}
  const long=s.kind==='uroktor'?16:10;
  poly(c,[[-4,-6],[7,-7],[long,-2],[long,3],[-3,4]],tint);rect(c,6,-4,2,2,'#e4d4a1');
  joint(c,1,3,pose.jaw*.5,()=>poly(c,[[0,-1],[long-1,-1],[long-3,3],[0,2]],light));
  if(s.kind==='baggi')poly(c,[[-5,-5],[-5,-14],[1,-8],[5,-6]],'#6f8499');
  if(s.shape==='deer'){for(const x of [-1,5]){rect(c,x,-17,2,12,light);rect(c,x-3,-15,4,2,light);rect(c,x+1,-12,4,2,light);}}
  if(s.shape==='rhino'){poly(c,[[1,-5],[5,-16],[8,-5]],light);poly(c,[[-5,-6],[-9,-14],[0,-10]],light);}
  if(pose.breath>0){c.save();c.globalAlpha*=pose.breath*.6;poly(c,[[long,0],[long+22,-4],[long+30,2],[long+20,6]],'#b9c9d0');c.restore();}
 });
 if(!flying&&s.shape!=='deer')joint(c,6,bodyY,pose.arm,()=>{rect(c,0,0,4,9,tint);rect(c,0,7,8,2,light);});
 if(s.motion&&s.state==='strike'&&s.moves[s.move]==='tail')tail();
 c.restore();
 if(s.hp>0){c.save();c.translate(s.x/2,s.y/2);if(s.state==='windup'){c.fillStyle='#dbc59b';c.font='bold 9px sans-serif';c.textAlign='center';c.fillText('!',0,-43);}if(s.hp<s.maxHp||s.state==='windup'){rect(c,-12,-38,24,2,'#3e4842');rect(c,-12,-38,24*s.hp/s.maxHp,2,'#bdad79');}c.restore();}
}
