export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export function attackMotion(w,kind){
 const heavy=['gs','hammer','horn','axe','cb','hbg'].includes(w.id);
 const duration=kind==='attack'?w.speed:kind==='ult'?.9:.55;
 const windup=duration*(heavy?.42:.27),active=duration*.24;
 return {duration,windup,active,impact:windup+active*.7,lunge:kind==='skill2'&&!w.heal&&!w.vault?(w.ranged?-85:90):w.ranged?0:kind==='ult'?45:heavy?16:10,heavy,thrust:['lance','gunlance','glaive'].includes(w.id),ranged:!!w.ranged};
}
export function hunterPose(p,t){
 const run=p.action==='run',cycle=p.stride??t*12;
 const pose={lean:run?.13:0,bob:run?-Math.abs(Math.sin(cycle))*2:Math.sin(t*3)*.6,legA:run?Math.sin(cycle)*.85:.08,legB:run?-Math.sin(cycle)*.85:-.12,arm:-.2,weapon:-.35,reach:0,roll:0,trail:0};
 if(p.y<0){pose.legA=p.vy<0?-.8:.3;pose.legB=p.vy<0?.6:-.6;pose.lean=.08;}
 if(p.land>0){pose.bob+=p.land*22;pose.legA=-.45;pose.legB=.5;}
 if(p.dodge>0){pose.roll=(1-p.dodge/.28)*Math.PI*2;pose.bob=10;pose.legA=-1.3;pose.legB=1.1;pose.arm=-1.2;}
 const a=p.swing;if(a){const prep=ease(a.age/a.windup),swing=ease((a.age-a.windup)/a.active),recover=ease((a.age-a.windup-a.active)/(a.duration-a.windup-a.active));
 const reverse=a.combo===1&&!a.heavy&&!a.thrust&&!a.ranged;
 const start=reverse?2.7:-1.45,end=reverse?-.9:2.6;
 pose.weapon=(-.35+(start+.35)*prep+(end-start)*swing)*(1-recover)-.35*recover;
 pose.lean=(-.2*prep+.5*swing)*(1-recover);pose.bob+=a.heavy?prep*2-swing*3:0;
 pose.arm=pose.weapon*.48;pose.legA=-.25;pose.legB=.35;pose.reach=(a.thrust?19:5)*Math.sin(swing*Math.PI)*(1-recover);
 if(a.thrust)pose.weapon=1.57-.35*prep+.35*swing;
 if(a.ranged){pose.weapon=0;pose.arm=-1.1;pose.reach=7-8*Math.sin(swing*Math.PI);pose.lean=-.18*Math.sin(swing*Math.PI);}
 pose.trail=a.age>=a.windup&&a.age<=a.windup+a.active?Math.sin(swing*Math.PI):0;
 }
 if(p.hurt>0){pose.lean-=p.hurt*1.4;pose.bob-=p.hurt*8;}
 return pose;
}
export function monsterPose(m,t,id){
 const walking=m.state==='approach',cycle=t*(id==='arzuros'?7:11),wind=m.state==='windup'?ease((m.stateAge||0)/(m.enraged?.65:.95)):0;
 const strike=m.state==='strike'?Math.sin(clamp((m.stateAge||0)/(m.move===1?.55:.28))*Math.PI):0;
 const recovery=m.state==='recover'?(1-ease((m.stateAge||0)/(m.enraged?.65:1.25)))*.25:0;
 return {bob:walking?-Math.abs(Math.sin(cycle))*3:wind*3-strike*7,lean:-wind*.12+strike*.22+recovery,
 leg:walking?Math.sin(cycle)*.45:strike*.5,tail:Math.sin(t*3)*.12+(m.move===0||id==='rathian'&&m.move===2?-wind*.7+strike*1.5:-wind*.15+strike*.25),
 head:m.move===1?wind*.2-strike*.25:-wind*.3+strike*.45,arm:m.move===1?-.4:-wind*1.35+strike*1.8,wing:Math.sin(t*3)*.08+(m.move===2?-wind*.6+strike*1.1:-wind*.2+strike*.3),
 recoil:(m.hurt||0)*1.2};
}
