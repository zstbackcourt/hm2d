import {getWeapon,MONSTERS} from './content.js';
import {stats} from './model.js';
export class Battle {
 constructor(save,index){this.save=save;this.index=index;this.spec=MONSTERS[index];this.w=getWeapon(save.weapon);const st=stats(save);this.p={x:240,y:0,vy:0,face:1,hp:st.hp,maxHp:st.hp,attack:st.attack,defense:st.defense,stamina:100,meter:0,potions:3,cool:0,c1:0,c2:0,healCool:0,inv:0,dodge:0,anim:0,action:'idle'};this.m={x:760,hp:this.spec.hp,maxHp:this.spec.hp,face:-1,state:'approach',timer:1,move:0,flash:0,anim:0,struck:false,enraged:false};this.queuedAction=null;this.status='playing';this.time=300;this.elapsed=0;this.projectiles=[];this.fx=[];this.shake=0;this.events=[];this.width=1800;this.id=globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random());}
 event(kind,text,x,y,color){this.events.push({kind,text});if(text)this.fx.push({text,x,y:y??-80,life:1,max:1,color:color||'#fff2c2'});}
 hit(damage,ultimate=false){if(this.status!=='playing')return;damage=Math.round(damage);this.m.hp=Math.max(0,this.m.hp-damage);this.m.flash=.12;this.shake=Math.min(8,damage/8);if(!ultimate)this.p.meter=Math.min(100,this.p.meter+8);this.event('hit',String(damage),this.m.x,-100,ultimate?'#ffd875':'#fff4ce');if(this.m.hp<=0){this.status='won';this.event('won');}}
 hurt(damage){const p=this.p;if(this.status!=='playing'||p.inv>0)return false;p.hp=Math.max(0,p.hp-Math.max(1,damage-p.defense));p.inv=.8;this.shake=7;this.event('hurt','−'+Math.max(1,damage-p.defense),p.x,p.y-70,'#ff8c78');if(p.hp<=0){this.status='lost';this.event('lost');}return true;}
 request(action){if(this.status!=='playing')return false;if(!['skill1','skill2','ult'].includes(action))return this.act(action);const p=this.p;if((action==='skill1'&&p.c1>0)||(action==='skill2'&&p.c2>0)||(action==='ult'&&p.meter<100))return false;if(p.cool>0||p.dodge>0){this.queuedAction=action;return true;}return this.act(action);}
 act(action){if(this.status!=='playing')return false;const p=this.p,w=this.w;
 if(action==='jump'){if(p.y<0)return false;p.vy=-470;this.event('jump');return true;}
 if(action==='dodge'){if(p.stamina<25||p.dodge>0)return false;p.stamina-=25;p.dodge=.28;p.inv=.38;p.action='dodge';this.event('dodge');return true;}
 if(action==='heal'){if(p.potions<=0||p.healCool>0||p.hp===p.maxHp)return false;p.potions--;p.healCool=1;p.hp=Math.min(p.maxHp,p.hp+45);this.event('heal','+45',p.x,p.y-60,'#9ee2b3');return true;}
 if(p.cool>0||p.dodge>0)return false;
 let multiplier=1,range=w.range;
 if(action==='skill1'){if(p.c1>0)return false;p.c1=5;multiplier=2.6;range+=35;}
 else if(action==='skill2'){if(p.c2>0)return false;p.c2=9;multiplier=3.4;range+=45;if(w.heal){p.hp=Math.min(p.maxHp,p.hp+25);this.event('heal','+25',p.x,p.y-60,'#9ee2b3');}else if(w.vault){p.vy=-470;}else{p.x=Math.max(35,Math.min(this.width-35,p.x+p.face*(w.ranged?-85:90)));p.inv=.24;}}
 else if(action==='ult'){if(p.meter<100)return false;p.meter=0;multiplier=8;range=w.ranged?700:250;p.inv=.9;this.shake=10;}
 else if(action!=='attack')return false;
 p.cool=action==='attack'?w.speed:.55;p.anim=action==='ult'?.65:.28;p.action=action;const damage=p.attack*multiplier;
 if(w.ranged){this.projectiles.push({x:p.x+p.face*16,y:p.y-30,vx:p.face*620,life:range/620,damage,owner:'player',ult:action==='ult'});}
 else if(Math.abs(this.m.x-p.x)<=range+35&&(this.m.x-p.x)*p.face>=-15&&p.y>-130){this.hit(damage,action==='ult');}
 this.event(action);return true;
 }
 step(dt,input={}){if(this.status!=='playing')return;const p=this.p,m=this.m;this.elapsed+=dt;this.time=Math.max(0,this.time-dt);if(this.time===0){this.status='lost';this.event('lost');return;}
 for(const k of ['cool','c1','c2','healCool','inv','dodge','anim'])p[k]=Math.max(0,p[k]-dt);m.flash=Math.max(0,m.flash-dt);this.shake=Math.max(0,this.shake-dt*30);p.stamina=Math.min(100,p.stamina+dt*20);
 const dir=(input.right?1:0)-(input.left?1:0);if(p.dodge>0)p.x+=p.face*450*dt;else if(dir){p.face=dir;p.x+=dir*190*dt;if(p.anim===0)p.action='run';}else if(!p.anim)p.action='idle';p.x=Math.max(35,Math.min(this.width-35,p.x));p.vy+=1050*dt;p.y+=p.vy*dt;if(p.y>0){p.y=0;p.vy=0;}if(this.queuedAction&&p.cool===0&&p.dodge===0){const action=this.queuedAction;this.queuedAction=null;this.act(action);}if(input.attack)this.act('attack');
 m.enraged=m.hp<m.maxHp*.35;const delta=p.x-m.x,abs=Math.abs(delta);m.anim+=dt;m.timer-=dt;
 if(m.state==='approach'){m.face=delta>=0?1:-1;if(abs>105)m.x+=m.face*this.spec.speed*(m.enraged?1.4:1)*dt;if(m.timer<=0&&(abs<150||this.index===2)){m.state='windup';m.timer=m.enraged?.65:.95;m.move=(m.move+1)%3;m.struck=false;this.event('warning');}}
 else if(m.state==='windup'&&m.timer<=0){m.state='strike';m.timer=m.move===1?.55:.28;if(this.index===2&&m.move===0){for(let i=0;i<3;i++)this.projectiles.push({x:m.x+m.face*50,y:-28-i*30,vx:m.face*(220+i*45),life:5,owner:'monster',damage:this.spec.damage});m.struck=true;}}
 else if(m.state==='strike'){if(m.move===1)m.x+=m.face*(this.index===1?340:430)*dt;const inFront=(p.x-m.x)*m.face>-35;const radius=m.move===2?135:115;if(!m.struck&&Math.abs(p.x-m.x)<radius&&p.y>-(m.move===2?45:80)&&inFront){if(this.hurt(this.spec.damage*(m.enraged?1.2:1)))m.struck=true;}if(m.timer<=0){m.state='recover';m.timer=m.enraged?.65:1.25;}}
 else if(m.state==='recover'&&m.timer<=0){m.state='approach';m.timer=m.enraged?.25:.65;}
 m.x=Math.max(65,Math.min(this.width-65,m.x));
 for(const q of this.projectiles){const oldX=q.x;q.x+=q.vx*dt;q.life-=dt;const target=q.owner==='player'?m:p;const crossed=Math.min(oldX,q.x)<=target.x+35&&Math.max(oldX,q.x)>=target.x-35;const height=q.owner==='player'?q.y>-120:Math.abs(q.y-(p.y-30))<35;if(crossed&&height){if(q.owner==='player')this.hit(q.damage,q.ult);else this.hurt(q.damage);q.life=-1;}}
 this.projectiles=this.projectiles.filter(q=>q.life>0);for(const f of this.fx){f.life-=dt;f.y-=dt*28;}this.fx=this.fx.filter(f=>f.life>0);
 }
}
