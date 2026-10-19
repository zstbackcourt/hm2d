// Independent ambient combatants: never alter the main quest objective or rewards.
export const SMALL_SPECIES={
 izuchi:{name:'镰鼬龙',hp:32,damage:3,shape:'raptor',color:'#bc895a',accent:'#d7c99d',moves:['bite','pounce','tail']},
 jagras:{name:'凶豺龙',hp:38,damage:4,shape:'lizard',color:'#a8a054',accent:'#cfbc70',moves:['bite','claw','tail']},
 bnahabra:{name:'飞甲虫',hp:30,damage:3,shape:'insect',fly:true,color:'#8e708e',accent:'#c4d5bd',moves:['sting','swoop','wing']},
 baggi:{name:'眠狗龙',hp:36,damage:3,shape:'raptor',color:'#779eb0',accent:'#c2d2c8',moves:['bite','charge','breath']},
 anteka:{name:'雪鹿',hp:38,damage:3,shape:'deer',color:'#a99982',accent:'#d5d0bb',moves:['horn','kick','charge']},
 remobra:{name:'蛇翼龙',hp:32,damage:4,shape:'wyvern',fly:true,color:'#81778d',accent:'#ada5b2',moves:['bite','swoop','tail']},
 uroktor:{name:'熔岩兽',hp:40,damage:4,shape:'lizard',color:'#8c6656',accent:'#c28d62',moves:['bite','charge','tail']},
 rhenoplos:{name:'草食龙',hp:45,damage:5,shape:'rhino',color:'#a79874',accent:'#cebd96',moves:['horn','charge','kick']}
};
export const SMALL_POOLS=[['izuchi','jagras','bnahabra'],['baggi','anteka','remobra'],['uroktor','rhenoplos','remobra']];
export const SMALL_MOVES={
 bite:{name:'探头咬击',range:70,prep:{head:-.6,neck:-5,jaw:.5},hit:{head:.5,neck:8,jaw:.9,lean:.2},follow:{head:.2,neck:4}},
 pounce:{name:'短扑',range:76,travel:30,prep:{bob:5,legA:-.8,legB:.6,head:-.2},hit:{bob:-9,lean:.3,legA:.7,legB:-.7,arm:-.8},follow:{bob:5,legA:-.5,legB:.6}},
 tail:{name:'小幅甩尾',range:82,prep:{tail:.7,head:-.3,legA:-.4},hit:{tail:2.5,head:.4,lean:.15,legA:.5},follow:{tail:1.8,head:.2}},
 claw:{name:'前爪挥击',range:72,prep:{arm:-2,head:-.15,lean:-.2},hit:{arm:.5,head:.3,lean:.3},follow:{arm:1,lean:.2}},
 charge:{name:'短距离冲撞',range:78,travel:28,prep:{head:.4,neck:-3,bob:4,legA:-.5,legB:.5},hit:{head:.25,neck:4,lean:.25,legA:.8,legB:-.8},follow:{bob:4,head:-.2,legA:-.7,legB:.7}},
 breath:{name:'短距离吐息',range:96,prep:{head:-.55,neck:-4,jaw:.3},hit:{head:.2,neck:7,jaw:1,breath:1},follow:{head:.3,neck:3,jaw:.4}},
 sting:{name:'低空针刺',range:66,prep:{lean:-.6,tail:-.4,wing:-.7},hit:{lean:.7,tail:1.2,wing:.4},follow:{lean:.3,tail:.7}},
 swoop:{name:'俯冲扑击',range:82,travel:28,prep:{head:-.3,wing:-1,lean:-.3},hit:{head:.4,wing:.7,lean:.5,arm:.8},follow:{wing:-.8,lean:-.15}},
 wing:{name:'振翅拍击',range:74,prep:{wing:-1.3,lean:-.2},hit:{wing:1.1,lean:.25,arm:.8},follow:{wing:.6,lean:.1}},
 horn:{name:'低头顶撞',range:72,prep:{head:-.5,neck:-3,legA:-.4},hit:{head:.65,neck:7,lean:.2,legA:.5},follow:{head:.4,neck:3}},
 kick:{name:'前足蹬踢',range:76,prep:{legA:.8,tail:.3,head:-.2},hit:{legA:-1.4,legB:.4,lean:-.2,tail:-.5},follow:{legA:-.7,lean:-.1}}
};
export function createSmall(kind,x,rng=Math.random){const spec=SMALL_SPECIES[kind];return {kind,...spec,maxHp:spec.hp,x,home:x,y:spec.fly?-110:0,face:-1,state:'idle',age:0,phase:rng()*6,cooldown:5+rng()*3,lastMove:-1,flash:0,deadAge:0};}
export function createSmallPack(area,rng=Math.random){const pool=SMALL_POOLS[area],first=rng()<.5?0:1,chosen=[pool[first],pool[2]];if(rng()<.5)chosen.push(pool[1-first]);return chosen.map((id,i)=>createSmall(id,[490,1080,1460][i],rng));}
export function beginSmallAttack(s,move,playerX){s.move=move;s.lastMove=move;s.motion=SMALL_MOVES[s.moves[move]];s.state='windup';s.age=0;s.struck=false;s.face=playerX>=s.x?1:-1;s.startX=s.x;s.startY=s.y;s.cancelPose=null;}
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const SMALL_TIMING={windup:.65,strike:.42,recover:1.1};
export function stepSmallMonsters(b,dt){
 if(b.status!=='playing')return;
 let busy=b.smalls.some(s=>s.hp>0&&s.state!=='idle');
 for(const s of b.smalls){s.flash=Math.max(0,s.flash-dt);s.age+=dt;
  if(s.hp<=0){s.deadAge+=dt;continue;}
  const near=Math.abs(b.p.x-s.x)<=100&&Math.abs(b.p.y-s.y)<155;
  if(s.state==='idle'){
   // Patrol is anchored to home, not to the hunter's position.
   const target=s.home+Math.sin(b.elapsed*.32+s.phase)*32,delta=target-s.x;
   s.x+=Math.sign(delta)*Math.min(Math.abs(delta),dt*10);if(Math.abs(delta)>1)s.face=Math.sign(delta);
   if(s.fly)s.y=-110+Math.sin(b.elapsed*1.3+s.phase)*7;
   if(near){s.cooldown=Math.max(0,s.cooldown-dt);if(s.cooldown===0){s.cooldown=5+b.smallRng()*3;if(!busy&&b.smallRng()<.2){const choices=[0,1,2].filter(i=>i!==s.lastMove);beginSmallAttack(s,choices[Math.min(choices.length-1,Math.floor(b.smallRng()*choices.length))],b.p.x);busy=true;}}}
  }else if(s.state==='windup'){
   if(!near){s.cancelPose=smallPose(s,b.elapsed);s.recoverY=s.y;s.state='recover';s.age=0;continue;}
   if(s.fly)s.y=s.startY+(-28-s.startY)*ease(s.age/SMALL_TIMING.windup);
   if(s.age>=SMALL_TIMING.windup){s.state='strike';s.age=0;}
  }else if(s.state==='strike'){
   const u=clamp(s.age/SMALL_TIMING.strike),a=s.motion;
   s.x=s.startX+s.face*(a.travel||0)*ease(u);
   if(u>=.35&&u<=.75&&!s.struck&&Math.abs(b.p.x-s.x)<a.range&&(b.p.x-s.x)*s.face>-18&&Math.abs((b.p.y-25)-(s.y-18))<42){if(b.hurt(s.damage))s.struck=true;}
   if(s.age>=SMALL_TIMING.strike){s.recoverY=s.y;s.state='recover';s.age=0;}
  }else if(s.state==='recover'){
   if(s.fly)s.y=(s.recoverY??-28)+(-110-(s.recoverY??-28))*ease(s.age/SMALL_TIMING.recover);
   if(s.age>=SMALL_TIMING.recover){s.state='idle';s.age=0;s.cooldown=5+b.smallRng()*3;}
  }
  s.x=Math.max(40,Math.min(b.width-40,s.x));
 }
}
const rest={head:0,neck:0,jaw:0,tail:0,arm:0,legA:0,legB:0,wing:0,lean:0,bob:0,breath:0};
const blend=(a,b,t)=>Object.fromEntries(Object.keys(rest).map(k=>[k,a[k]+(b[k]-a[k])*ease(t)]));
export function smallPose(s,t){const base={...rest,legA:Math.sin(t*4+s.phase)*.2,legB:-Math.sin(t*4+s.phase)*.2,wing:Math.sin(t*10+s.phase)*.35,tail:Math.sin(t*2)*.08};if(!s.motion||s.state==='idle'||s.state==='dead')return base;const a=s.motion,prep={...rest,...a.prep},hit={...rest,...a.hit},follow={...rest,...a.follow},u=s.age/SMALL_TIMING[s.state];return s.state==='windup'?blend(base,prep,u):s.state==='strike'?(u<.55?blend(prep,hit,u/.55):blend(hit,follow,(u-.55)/.45)):blend(s.cancelPose||follow,base,u);}
