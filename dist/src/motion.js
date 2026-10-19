export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;

export function attackMotion(w,kind){
 const heavy=['gs','hammer','horn','axe','cb','hbg'].includes(w.id);
 const duration=kind==='attack'?w.speed:kind==='ult'?1.05:kind==='skill1'?.62:.58;
 const windup=duration*(kind==='ult'?.38:kind==='skill2'?.4:heavy?.42:.27);
 const active=duration*(kind==='ult'?.3:.24);
 return {duration,windup,active,impact:windup+active*.7,
  lunge:kind==='skill2'&&!w.heal&&!w.vault?(w.ranged?-85:90):w.ranged?0:kind==='ult'?45:heavy?16:10,
  launchAt:kind==='ult'&&['ls','glaive'].includes(w.id)?.13:null,
  heavy,thrust:['lance','gunlance','glaive'].includes(w.id),ranged:!!w.ranged,heal:!!w.heal};
}

// Interpolate whole silhouettes, not just the weapon angle. Every track returns
// to the incoming locomotion pose so releasing an attack does not pop to idle.
function track(base,frames,t){
 const keys=Object.keys(base),f=frames.map(([at,values])=>({at,pose:{...base,...values}}));
 let i=1;while(i<f.length-1&&t>f[i].at)i++;
 const a=f[i-1],b=f[i],u=ease((t-a.at)/(b.at-a.at));
 return Object.fromEntries(keys.map(k=>[k,mix(a.pose[k],b.pose[k],u)]));
}

export function hunterPose(p,t,weapon='ls'){
 const run=p.action==='run',cycle=p.stride??t*12;
 let pose={lean:run?.13:0,bob:run?-Math.abs(Math.sin(cycle))*2:Math.sin(t*3)*.6,
  legA:run?Math.sin(cycle)*.85:.08,legB:run?-Math.sin(cycle)*.85:-.12,
  kneeA:run?Math.max(0,-Math.sin(cycle))*.9:.1,kneeB:run?Math.max(0,Math.sin(cycle))*.9:.1,
  weapon:-.35,handX:11,handY:-21,offX:-12,offY:-17,twoHand:0,
  head:0,scarf:0,scaleX:1,scaleY:1,roll:0,trail:0};
 const air=p.y<0||p.vy<0;
 if(air){
  const flight=clamp((p.vy+470)/940),alternate=(p.jumpStyle||0)%2===1;
  pose=track(pose,[
   [0,{lean:-.14,weapon:alternate?.8:-1.15,handX:1,handY:-29,legA:-.3,legB:.5,kneeA:.2,kneeB:.7,offX:-20,offY:-26,scaleX:.94,scaleY:1.08}],
   [.24,{lean:-.19,weapon:alternate?1.1:-1.55,handX:-2,handY:-37,legA:-1.05,legB:.35,kneeA:1.3,kneeB:1.1,offX:-19,offY:-32,head:.1,scarf:4}],
   [.5,{lean:.03,weapon:alternate?1.65:.65,handX:12,handY:-32,legA:-.95,legB:.75,kneeA:1.3,kneeB:1.15,offX:-19,offY:-34,head:.1,scarf:-2}],
   [.78,{lean:.18,weapon:alternate?2.1:1.45,handX:15,handY:-25,legA:-.4,legB:.35,kneeA:.55,kneeB:.7,offX:-20,offY:-22,scarf:-5}],
   [1,{lean:.12,weapon:.6,handX:14,handY:-21,legA:-.24,legB:.2,kneeA:.25,kneeB:.35,offX:-16,offY:-18}]
  ],flight);
  if(['gs','hammer','horn','axe','cb'].includes(weapon)){pose.weapon*=.72;pose.twoHand=1;}
  if(['bow','lbg','hbg'].includes(weapon)){pose.weapon*=.25;pose.twoHand=1;}
 }
 if(p.land>0&&!air){const weight=clamp(p.land/.2);pose.bob+=6*weight;pose.scaleY-=.12*weight;pose.scaleX+=.08*weight;pose.lean+=.18*weight;pose.legA-=.45*weight;pose.legB+=.45*weight;pose.kneeA+=.65*weight;pose.kneeB+=.65*weight;pose.weapon+=.8*weight;}
 const a=p.swing;
 if(a){
  const before={...pose},start=a.windup/a.duration,end=(a.windup+a.active)/a.duration;
  const phase=a.age/a.duration;
  if(a.kind==='skill1'){
   // Broad turn through the shoulders into a sweeping cut.
   pose=track(pose,[[0,{}],[start,{weapon:-1.9,handX:-9,handY:-32,lean:-.32,legA:-.55,legB:.6,bob:3,twoHand:1}],
    [end,{weapon:2.3,handX:19,handY:-26,lean:.33,legA:.5,legB:-.55,head:-.2,twoHand:1}],[1,{}]],phase);
  }else if(a.kind==='skill2'){
   // Low hip draw, then an extended blade and trailing rear leg.
   pose=track(pose,[[0,{}],[start,{weapon:-1.55,handX:-7,handY:-13,lean:.34,bob:7,legA:-.65,legB:.8,kneeA:.9,kneeB:.8,twoHand:1}],
    [end,{weapon:1.6,handX:25,handY:-23,lean:.52,bob:3,legA:-.75,legB:.85,kneeA:.25,kneeB:.1,offX:-22,offY:-28}],[1,{}]],phase);
  }else if(a.kind==='ult'){
   // Two-handed overhead lift followed by a descending cleave.
   pose=track(pose,[[0,{}],[start,{weapon:-.65,handX:0,handY:-46,lean:-.19,bob:-2,legA:-.5,legB:.5,kneeA:.8,kneeB:.65,twoHand:1}],
    [end,{weapon:2.75,handX:17,handY:-23,lean:.48,bob:5,legA:-.6,legB:.6,kneeA:.7,kneeB:.65,twoHand:1}],[1,{}]],phase);
  }else{
   const reverse=a.combo===1&&!a.heavy&&!a.thrust&&!a.ranged;
   pose=track(pose,[[0,{}],[start,{weapon:reverse?2.7:-1.45,handX:6,handY:a.heavy?-34:-24,lean:-.2,twoHand:a.heavy?1:0}],
    [end,{weapon:reverse?-.9:2.6,handX:17,handY:-22,lean:.3,twoHand:a.heavy?1:0}],[1,{}]],phase);
  }
  const strength=Math.sin(Math.PI*clamp((a.age-a.windup)/a.active));
  if(a.thrust&&a.kind!=='ult'&&a.kind!=='skill2'){
   pose.weapon=mix(pose.weapon,1.57,ease(phase/start)*(1-ease((phase-end)/(1-end))));pose.handX+=strength*10;
  }
  if(a.ranged){
   // Aim high, slide low, or brace an ultimate: distinct even before firing.
   const target=a.kind==='skill1'?{weapon:-.3,handX:15,handY:-35,lean:-.12,bob:0}:
    a.kind==='skill2'?{weapon:.15,handX:7,handY:-14,lean:.35,bob:7}:
    a.kind==='ult'?{weapon:-.7,handX:-2,handY:-44,lean:-.25,bob:-2}:
    {weapon:0,handX:14,handY:-26,lean:0,bob:0};
   pose=track(before,[[0,{}],[start,{...target,twoHand:1}],
    [end,{...target,weapon:0,handX:target.handX-9,lean:target.lean-.2,twoHand:1}],[1,{}]],phase);
  }
  if(a.heal&&a.kind==='skill2')pose=track(before,[[0,{}],[start,{weapon:.1,handX:1,handY:-30,lean:-.2,twoHand:1}],
   [end,{weapon:.8,handX:11,handY:-38,lean:.15,twoHand:1}],[1,{}]],phase);
  if(air){for(const key of ['legA','legB','kneeA','kneeB'])pose[key]=before[key];pose.bob=before.bob;}
  pose.trail=a.age>=a.windup&&a.age<=a.windup+a.active?strength:0;
 }
 if(p.dodge>0){pose.roll=(1-p.dodge/.28)*Math.PI*2;pose.bob=10;pose.legA=-1.3;pose.legB=1.1;pose.kneeA=1.4;pose.kneeB=1.4;pose.weapon=.3;pose.handX=5;pose.handY=-29;}
 if(p.hurt>0){pose.lean-=p.hurt*1.4;pose.bob-=p.hurt*8;}
 return pose;
}
export {monsterPose} from './monster-motion.js';
