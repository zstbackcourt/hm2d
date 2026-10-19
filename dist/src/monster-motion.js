// One attack description drives anticipation, contact timing and recovery.
const attacks={
 izuchi:[
  {kind:'tail',windup:.9,strike:.46,recover:1.1,radius:150,height:80,prep:{tail:.65,tailTip:.8,head:-.18,arm:-.3,legA:-.3,legB:.3},hit:{tail:2.25,tailTip:-.3,head:.2,arm:.3,legA:.4,legB:-.35},follow:{tail:1.7,tailTip:-.65,head:.2,legA:.3,legB:-.3}},
  {kind:'charge',windup:.75,strike:.62,recover:1.05,radius:115,height:80,speed:430,prep:{bob:7,head:.35,headX:-7,tail:-.2,arm:-.75,legA:-.6,legB:.7},hit:{bob:3,head:.3,headX:8,tail:-.35,arm:-.8,legA:.8,legB:-.8},follow:{bob:5,head:-.1,headX:3,tail:.25,arm:.2,legA:-.7,legB:.6}},
  {kind:'peck',windup:.7,strike:.4,recover:.9,radius:145,height:75,prep:{head:-.65,headX:-8,jaw:.2,tail:.25,arm:-.2,legA:.2,legB:-.1},hit:{head:.6,headX:17,jaw:.5,tail:-.25,arm:.55,legA:-.3,legB:.4},follow:{head:.4,headX:12,jaw:.1,tail:-.1,arm:.4,legA:-.25,legB:.3}}
 ],
 arzuros:[
  {kind:'claw',windup:.9,strike:.48,recover:1.15,radius:145,height:85,prep:{arm:-2.1,elbow:.55,backArm:.3,head:-.2,legA:-.35,legB:.25},hit:{arm:-.45,elbow:-.5,backArm:-.8,head:.2,legA:.45,legB:-.3},follow:{arm:.65,elbow:-.4,backArm:-.4,head:.25,legA:.4,legB:-.25}},
  {kind:'charge',windup:.9,strike:.68,recover:1.25,radius:120,height:80,speed:340,prep:{bob:9,lean:.16,head:.3,arm:-.6,backArm:-.6,elbow:1,legA:-.6,legB:.6},hit:{bob:6,lean:.22,head:.15,arm:-1.1,backArm:-1.1,elbow:.7,legA:.8,legB:-.8},follow:{bob:8,lean:.1,head:-.15,arm:.2,backArm:.3,elbow:.2,legA:-.7,legB:.65}},
  {kind:'slam',windup:1.05,strike:.55,recover:1.3,radius:145,height:45,prep:{bob:-5,head:-.35,arm:-2.85,backArm:-2.5,elbow:.25,backElbow:.3,legA:-.2,legB:.2},hit:{bob:11,head:.4,arm:-.3,backArm:-.2,elbow:-.15,legA:-.55,legB:.6},follow:{bob:10,head:.35,arm:0,backArm:.05,legA:-.55,legB:.6}}
 ],
 rathian:[
  {kind:'fire',windup:1.05,strike:1.05,recover:1.15,radius:0,height:0,shots:[.16,.46,.76],prep:{head:-.55,headX:-5,jaw:.5,chest:1,wing:-.25,wingBack:.2,tail:.15,legA:-.25,legB:.2},hit:{head:.2,headX:8,jaw:1,chest:.5,wing:.15,wingBack:-.1,tail:-.1},follow:{head:.3,headX:6,jaw:.65,chest:.2,wing:.25,tail:-.15}},
  {kind:'charge',windup:.8,strike:.65,recover:1.1,radius:125,height:85,speed:400,prep:{bob:8,head:.4,headX:-6,jaw:.1,wing:.75,wingBack:-.65,tail:-.2,legA:-.65,legB:.65},hit:{bob:4,head:.35,headX:9,wing:.6,wingBack:-.5,tail:-.35,legA:.9,legB:-.8},follow:{bob:7,head:-.1,wing:-.15,wingBack:.2,tail:.3,legA:-.65,legB:.7}},
  {kind:'tail',windup:1,strike:.55,recover:1.25,radius:165,height:80,prep:{bob:-3,tail:.75,tailTip:.55,head:-.25,wing:-.8,wingBack:.65,legA:-.3,legB:.35},hit:{bob:-12,tail:2.6,tailTip:-.45,head:.35,wing:.4,wingBack:-.5,legA:-.9,legB:.85},follow:{bob:5,tail:1.85,tailTip:-.5,head:.2,wing:.55,wingBack:-.35,legA:-.4,legB:.5}}
 ]
};
export function monsterAttack(id,move,enraged=false){const a=attacks[id]?.[move]||attacks.izuchi[0],speed=enraged?.78:1;return {...a,windup:a.windup*speed,strike:a.strike*speed,recover:a.recover*speed,activeStart:a.kind==='charge'?.1:.38,activeEnd:a.kind==='charge'?.86:.7};}
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const rest={bob:0,lean:0,head:0,headX:0,jaw:0,chest:0,tail:0,tailTip:0,arm:0,elbow:0,backArm:0,backElbow:0,wing:0,wingBack:0,legA:0,legB:0,breath:0,recoil:0};
const blend=(a,b,t)=>Object.fromEntries(Object.keys(rest).map(k=>[k,a[k]+(b[k]-a[k])*ease(t)]));
export function monsterPose(m,t,id){
 const a=m.motion||monsterAttack(id,m.move??0,m.enraged),prep={...rest,...a.prep},hit={...rest,...a.hit},follow={...rest,...a.follow};
 const u=clamp((m.stateAge||0)/(a[m.state]||1));let p;
 if(m.state==='windup')p=blend(rest,prep,u);
 else if(m.state==='strike'){p=u<.52?blend(prep,hit,u/.52):blend(hit,follow,(u-.52)/.48);
  if(a.kind==='charge'){const stride=Math.sin(u*Math.PI*8)*Math.sin(u*Math.PI);p.legA+=stride*.65;p.legB-=stride*.65;}
  if(a.kind==='fire'){const pulse=Math.max(...a.shots.map(at=>Math.max(0,1-Math.abs(u-at)/.1)));const weight=ease(u/.16)*ease((1-u)/.14);p.breath=pulse;p.jaw+=(.45+.65*pulse-p.jaw)*weight;p.head+=(.2-.12*pulse-p.head)*weight;p.headX+=(8-5*pulse-p.headX)*weight;}
 }else if(m.state==='recover')p=blend(follow,rest,Math.max(0,(u-.18)/.82));
 else{p={...rest};p.head=Math.sin(t*2)*.025;p.tail=Math.sin(t*2.5)*.08;p.tailTip=Math.sin(t*2.5-.7)*.12;p.wing=Math.sin(t*2)*.04;if(m.state==='approach'){p.legA=Math.sin(t*(id==='arzuros'?7:11))*.4;p.legB=-p.legA;p.bob=-Math.abs(p.legA)*3;}}
 p.recoil=(m.hurt||0)*1.2;return p;
}
export function monsterMouth(m,t,id='rathian'){
 const p=monsterPose(m,t,id),hx=20,hy=-40,dx=59-hx,dy=-38+p.jaw*4-hy;
 const x=hx+dx*Math.cos(p.head)-dy*Math.sin(p.head)+p.headX,y=hy+dx*Math.sin(p.head)+dy*Math.cos(p.head);
 const angle=p.lean-p.recoil;
 return {x:m.x+m.face*2*(x*Math.cos(angle)-y*Math.sin(angle)),y:2*(x*Math.sin(angle)+y*Math.cos(angle)+p.bob)};
}
