import {Battle} from './engine.js';
import {createSave} from './model.js';
import {MONSTERS} from './content.js';
import {monster} from './art.js';
const $=id=>document.getElementById(id);
document.title=$('title').textContent='怪物攻击 · 动作分解';$('description').textContent='每一招都有独立的蓄力、命中与收招。切换怪物，观察尾、爪、头和翅膀的动作。';$('hunter-link').textContent='← 猎人动作预览';$('note').textContent='同一战斗引擎生成的动作分解，支持半速循环；不读取或修改存档。';$('play').textContent='播放动画';$('face').textContent='面向左侧';$('monster').setAttribute('aria-label','选择怪物');
for(const [i,m] of MONSTERS.entries()){const o=document.createElement('option');o.value=i;o.textContent=m.name;$('monster').append(o);}
let clips=[],playing=false,face=1,clock=0,last=0;
function rebuild(){const index=Number($('monster').value),spec=MONSTERS[index];$('sheets').innerHTML='';clips=[0,1,2].map(move=>{
 const b=new Battle(createSave('预览','female'),index);b.m.x=700;b.p.x=1500;b.beginMonsterAttack(move);const a=b.m.motion,duration=a.windup+a.strike+a.recover,frames=[];
 for(let i=0;i<=Math.ceil(duration*60);i++){frames.push({m:structuredClone(b.m),shots:structuredClone(b.projectiles),time:b.elapsed});b.step(1/60);}
 const section=document.createElement('section'),h=document.createElement('h2'),c=document.createElement('canvas');h.textContent=spec.moves[move];c.width=1000;c.height=220;c.setAttribute('aria-label',h.textContent+'蓄力攻击收招');section.append(h,c);$('sheets').append(section);
 return {c,spec,frames,duration,moments:[a.windup*.95,a.windup+a.strike*.23,a.windup+a.strike*.52,a.windup+a.strike+a.recover*.22,duration-.02]};});clock=0;draw();}
function draw(){for(const clip of clips){const c=clip.c.getContext('2d');c.clearRect(0,0,1000,220);c.imageSmoothingEnabled=false;clip.moments.forEach((base,i)=>{
 const time=playing?(base+clock)%clip.duration:base,f=clip.frames[Math.min(clip.frames.length-1,Math.round(time*60))],x=100+i*200;
 c.fillStyle='#ced6c2';c.fillRect(i*200+6,180,188,2);c.fillStyle='#466353';c.font='13px system-ui';c.textAlign='center';c.fillText(['蓄力','出招','命中','收招','恢复'][i],x,210);
 c.save();c.beginPath();c.rect(i*200,0,200,190);c.clip();c.translate(x,178);monster(c,0,0,clip.spec.id,face,f.time,f.m.state,false,f.m);
 for(const q of f.shots){c.fillStyle='#eea35f';c.fillRect((q.x-f.m.x)/2*face,q.y/2-3,9,6);}c.restore();});}}
$('monster').onchange=rebuild;$('play').onclick=e=>{playing=!playing;e.target.textContent=playing?'暂停动画':'播放动画';if(!playing){clock=0;draw();}};$('face').onclick=e=>{face*=-1;e.target.textContent=face===1?'面向左侧':'面向右侧';draw();};
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(playing){clock+=dt*.5;draw();}requestAnimationFrame(frame);}rebuild();requestAnimationFrame(frame);
