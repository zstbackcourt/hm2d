import {chooseNormalVariant,normalVariants} from './normal-attacks.js';
import {monsterAttack,monsterMouth} from './monster-motion.js';
import {getWeapon,MONSTERS} from './content.js';
import {attackMotion,clamp} from './motion.js';
import {stats} from './model.js';
export class Battle {
 constructor(save,index){this.save=save;this.index=index;this.spec=MONSTERS[index];this.w=getWeapon(save.weapon);const st=stats(save);this.p={x:240,y:0,vy:0,face:1,hp:st.hp,maxHp:st.hp,attack:st.attack,defense:st.defense,stamina:100,meter:0,potions:3,cool:0,c1:0,c2:0,healCool:0,inv:0,dodge:0,anim:0,action:'idle',vx:0,stride:0,land:0,hurt:0,combo:0,comboTime:0,swing:null,jumpStyle:0};this.m={x:760,hp:this.spec.hp,maxHp:this.spec.hp,face:-1,state:'approach',timer:1,move:0,flash:0,anim:0,struck:false,enraged:false};this.hitstop=0;this.endAge=0;this.particles=[];this.queuedAction=null;this.status='playing';this.time=300;this.elapsed=0;this.projectiles=[];this.fx=[];this.shake=0;this.events=[];this.width=1800;this.id=globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random());}
 event(kind,text,x,y,color){this.events.push({kind,text});if(text)this.fx.push({text,x,y:y??-80,life:1,max:1,color:color||'#fff2c2'});}
 burst(x,y,color,count=10){for(let i=0;i<count;i++){const a=i*2.399;this.particles.push({x,y,vx:Math.cos(a)*(55+i*8),vy:Math.sin(a)*(50+i*6)-35,life:.22+i*.014,max:.22+i*.014,color});}}
 hit(damage,ultimate=false){if(this.status!=='playing')return;damage=Math.round(damage);this.m.hp=Math.max(0,this.m.hp-damage);this.m.flash=.12;this.m.hurt=.2;this.hitstop=Math.max(this.hitstop,ultimate?.085:damage>30?.055:.035);this.burst(this.m.x,-55,ultimate?'#ffd875':'#fff0ba',ultimate?20:10);this.shake=Math.min(8,damage/8);if(!ultimate)this.p.meter=Math.min(100,this.p.meter+8);this.event('hit',String(damage),this.m.x,-100,ultimate?'#ffd875':'#fff4ce');if(this.m.hp<=0){this.status='won';this.event('won');}}
 hurt(damage){const p=this.p;if(this.status!=='playing'||p.inv>0)return false;p.hp=Math.max(0,p.hp-Math.max(1,damage-p.defense));p.inv=.8;p.hurt=.25;this.hitstop=.045;this.burst(p.x,p.y-35,'#ee9b76',8);this.shake=7;this.event('hurt','−'+Math.max(1,damage-p.defense),p.x,p.y-70,'#ff8c78');if(p.hp<=0){this.status='lost';this.event('lost');}return true;}
 request(action){if(this.status!=='playing')return false;if(!['skill1','skill2','ult'].includes(action))return this.act(action);const p=this.p;if((action==='skill1'&&p.c1>0)||(action==='skill2'&&p.c2>0)||(action==='ult'&&p.meter<100))return false;if(p.cool>0||p.dodge>0){this.queuedAction=action;return true;}return this.act(action);}
 act(action){if(this.status!=='playing')return false;const p=this.p,w=this.w;
 if(action==='jump'){if(p.y<0||p.vy<0)return false;p.jumpStyle=(p.jumpStyle+1)%2;p.land=0;p.vy=-470;this.burst(p.x,0,'#c8c6a7',5);this.event('jump');return true;}
 if(action==='dodge'){if(p.stamina<25||p.dodge>0)return false;p.stamina-=25;p.dodge=.28;p.inv=.38;p.swing=null;p.anim=0;p.cool=0;this.queuedAction=null;this.burst(p.x,0,'#c8c6a7',7);p.action='dodge';this.event('dodge');return true;}
 if(action==='heal'){if(p.potions<=0||p.healCool>0||p.hp===p.maxHp)return false;p.potions--;p.healCool=1;p.hp=Math.min(p.maxHp,p.hp+45);this.event('heal','+45',p.x,p.y-60,'#9ee2b3');return true;}
 if(p.cool>0||p.dodge>0)return false;
 let multiplier=1,range=w.range;
 if(action==='skill1'){if(p.c1>0)return false;p.c1=5;multiplier=2.6;range+=35;}
 else if(action==='skill2'){if(p.c2>0)return false;p.c2=9;multiplier=3.4;range+=45;if(w.heal){p.hp=Math.min(p.maxHp,p.hp+25);this.event('heal','+25',p.x,p.y-60,'#9ee2b3');}else if(w.vault){p.vy=-470;}else{p.inv=.4;}}
 else if(action==='ult'){if(p.meter<100)return false;p.meter=0;multiplier=8;range=w.ranged?700:250;p.inv=.9;}
 else if(action!=='attack')return false;
 const profile=attackMotion(w,action);p.combo=p.comboTime>0?(p.combo+1)%3:0;p.comboTime=1.2;
 p.cool=profile.duration;p.anim=profile.duration;p.action=action;
 p.swing={...profile,kind:action,age:0,face:p.face,combo:p.combo,damage:p.attack*multiplier,range,hit:false,canLaunch:p.y===0&&p.vy===0,launched:false};
 if(action==='attack'){const variant=chooseNormalVariant(w,p.lastNormalVariant);p.lastNormalVariant=variant;p.swing.variant=variant;p.swing.trailStyle=normalVariants(w)[variant].trail;}
 this.event(action);return true;
 }
 bodyShape(){return [{radius:72,height:82},{radius:80,height:125},{radius:76,height:90}][this.index];}
 separateBodies(previousSide=0){
  const p=this.p,m=this.m,shape=this.bodyShape();
  if(p.dodge>0||p.y<=-shape.height){this.bodyPassing=true;return;}
  const gap=shape.radius+20,side=this.bodyPassing?Math.sign(p.x-m.x)||p.face:previousSide||Math.sign(p.x-m.x)||-m.face;
  this.bodyPassing=false;
  if((p.x-m.x)*side>=gap)return;
  // Preserve the approach side under fast lunges/charges, but permit deliberate dodge/air crossings.
  p.x=clamp(m.x+side*gap,35,this.width-35);
  if((p.x-m.x)*side<gap)m.x=p.x-side*gap;
  if(p.vx*side<0)p.vx=0;
 }
 impact(a){const p=this.p;if(this.w.ranged)this.projectiles.push({x:p.x+a.face*16,y:p.y-30,vx:a.face*620,life:a.range/620,damage:a.damage,owner:'player',ult:a.kind==='ult'});
 else if(Math.abs(this.m.x-p.x)<=a.range+this.bodyShape().radius&&(this.m.x-p.x)*a.face>=-15&&p.y>-130)this.hit(a.damage,a.kind==='ult');}
 beginMonsterAttack(move){const m=this.m;m.move=move;m.motion=monsterAttack(this.spec.id,move,m.enraged);m.state='windup';m.stateAge=0;m.timer=m.motion.windup;m.struck=false;m.shots=0;m.impactFx=false;m.face=this.p.x>=m.x?1:-1;m.aimX=this.p.x;m.aimY=this.p.y-30;this.event('warning');}
 monsterStep(dt){
  const m=this.m,p=this.p;const delta=p.x-m.x;m.anim+=dt;m.timer-=dt;m.stateAge=(m.stateAge||0)+dt;
  if(m.state==='approach'){m.enraged=m.hp<m.maxHp*.35;m.face=delta>=0?1:-1;if(Math.abs(delta)>105)m.x+=m.face*this.spec.speed*(m.enraged?1.4:1)*dt;if(m.timer<=0&&(Math.abs(delta)<150||this.index===2))this.beginMonsterAttack((m.move+1)%3);}
  else{
   const a=m.motion||monsterAttack(this.spec.id,m.move,m.enraged);
   if(m.state==='windup'&&m.timer<=0){m.motion=a;m.state='strike';m.stateAge=0;m.timer=a.strike;m.shots=0;}
   else if(m.state==='strike'){
    const u=m.stateAge/a.strike;
    if(a.kind==='charge'&&u<.9)m.x+=m.face*a.speed*Math.min(1,u/.16)*Math.min(1,(.9-u)/.18)*dt;
    if(a.kind==='fire'){
     while((m.shots||0)<a.shots.length&&u>=a.shots[m.shots||0]){const mouth=monsterMouth(m,this.elapsed,this.spec.id),vx=m.face*260,travel=Math.max(.2,Math.abs((m.aimX??p.x)-mouth.x)/260),vy=clamp(((m.aimY??p.y-30)-mouth.y)/travel,-100,130);this.projectiles.push({...mouth,vx,vy,life:5,owner:'monster',damage:this.spec.damage});m.shots=(m.shots||0)+1;this.burst(mouth.x,mouth.y,'#ffb66d',6);}
    }else if(u>=a.activeStart&&u<=a.activeEnd){
     if(!m.impactFx){m.impactFx=true;if(a.kind==='slam'||a.kind==='charge')this.burst(m.x+m.face*50,0,'#c8b692',10);}
     if(!m.struck&&(p.x-m.x)*m.face>-35&&Math.abs(p.x-m.x)<a.radius&&p.y>-a.height){if(this.hurt(this.spec.damage*(m.enraged?1.2:1)))m.struck=true;}
    }
    if(m.timer<=0){m.state='recover';m.stateAge=0;m.timer=a.recover;}
   }else if(m.state==='recover'&&m.timer<=0){m.state='approach';m.stateAge=0;m.motion=null;m.timer=m.enraged?.25:.65;}
  }
  m.x=clamp(m.x,65,this.width-65);
 }
 step(dt,input={}){
 for(const f of this.particles){f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=260*dt;}this.particles=this.particles.filter(f=>f.life>0);
 if(this.status!=='playing'){this.endAge+=dt;return;}
 if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return;}
const p=this.p,m=this.m;const bodySide=Math.sign(p.x-m.x);this.elapsed+=dt;this.time=Math.max(0,this.time-dt);if(this.time===0){this.status='lost';this.event('lost');return;}
 for(const k of ['cool','c1','c2','healCool','inv','dodge','anim','land','hurt','comboTime'])p[k]=Math.max(0,p[k]-dt);m.hurt=Math.max(0,(m.hurt||0)-dt);m.flash=Math.max(0,m.flash-dt);this.shake=Math.max(0,this.shake-dt*30);p.stamina=Math.min(100,p.stamina+dt*20);
 const dir=(input.right?1:0)-(input.left?1:0),wasAir=p.y<0;
 if(p.dodge>0){p.x+=p.face*800*dt;p.vx=0;}
 else{const target=dir*190*(p.swing?.45:1);p.vx+=clamp(target-p.vx,-2400*dt,2400*dt);p.x+=p.vx*dt;if(dir&&!p.swing)p.face=dir;if(!p.swing)p.action=dir?'run':'idle';}
 p.stride+=Math.abs(p.vx)*dt*.075;
 p.vy+=1050*dt;p.y+=p.vy*dt;if(p.y>0){p.y=0;p.vy=0;if(wasAir){p.land=.2;this.burst(p.x,0,'#c8c6a7',6);}}
 this.separateBodies(bodySide);
 const a=p.swing;if(a){const old=a.age;a.age+=dt;if(a.launchAt!==null&&a.canLaunch&&!a.launched&&a.age>=a.launchAt){a.launched=true;if(p.y===0&&p.vy===0){p.vy=-340;p.land=0;this.burst(p.x,0,'#c8c6a7',7);}}const travel=t=>clamp((t-a.windup)/a.active,0,1);p.x+=a.face*a.lunge*(travel(a.age)-travel(old));this.separateBodies(bodySide);if(!a.hit&&a.age>=a.impact){a.hit=true;this.impact(a);}if(a.age>=a.duration){p.swing=null;if(dir)p.face=dir;}}
 p.x=clamp(p.x,35,this.width-35);
 if(this.queuedAction&&p.cool===0&&p.dodge===0){const action=this.queuedAction;this.queuedAction=null;this.act(action);}if(input.attack)this.act('attack');
 const beforeMonsterSide=Math.sign(p.x-m.x);
 this.monsterStep(dt);
 this.separateBodies(beforeMonsterSide);
 for(const q of this.projectiles){const oldX=q.x;q.x+=q.vx*dt;q.y+=(q.vy||0)*dt;q.life-=dt;const target=q.owner==='player'?m:p;const crossed=Math.min(oldX,q.x)<=target.x+35&&Math.max(oldX,q.x)>=target.x-35;const height=q.owner==='player'?q.y>-120:Math.abs(q.y-(p.y-30))<35;if(crossed&&height){if(q.owner==='player')this.hit(q.damage,q.ult);else this.hurt(q.damage);q.life=-1;}}
 this.projectiles=this.projectiles.filter(q=>q.life>0);for(const f of this.fx){f.life-=dt;f.y-=dt*28;}this.fx=this.fx.filter(f=>f.life>0);
 }
}
