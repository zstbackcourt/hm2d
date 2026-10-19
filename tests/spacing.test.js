import test from 'node:test';import assert from 'node:assert/strict';
import {Battle} from '../dist/src/engine.js';import {createSave} from '../dist/src/model.js';
const make=(i=0)=>{const b=new Battle(createSave('测试','female'),i);b.m.x=500;b.m.state='recover';b.m.timer=100;return b;};
for(let i=0;i<3;i++)for(const side of [-1,1]){
 test(`walking and lunging cannot enter torso ${i}/${side}`,()=>{const b=make(i);b.p.x=500+side*150;b.p.face=-side;for(let n=0;n<120;n++){b.step(1/60,{left:side>0,right:side<0,attack:true});assert.ok((b.p.x-b.m.x)*side>=90);} });
 test(`roll crosses and separates ${i}/${side}`,()=>{const b=make(i);b.p.x=500+side*100;b.p.face=-side;b.act('dodge');for(let n=0;n<35;n++)b.step(1/60);assert.ok((b.p.x-b.m.x)*side<=-90);});
 test(`short blades hit from contact distance ${i}/${side}`,()=>{const b=make(i);b.w={...b.w,range:61};b.p.x=500+side*100;b.p.face=-side;b.act('attack');for(let n=0;n<30;n++)b.step(1/60);assert.ok(b.m.hp<b.m.maxHp);});
}
test('charge pushes without crossing or pinning at wall',()=>{const b=make(1);b.p.x=35;b.m.x=140;b.beginMonsterAttack(1);b.m.state='strike';b.m.stateAge=.1;b.m.timer=b.m.motion.strike;for(let n=0;n<80;n++){b.step(1/60);assert.ok(b.p.x>=35);assert.ok(b.m.x-b.p.x>=90);}assert.ok(b.p.hp<b.p.maxHp);});
test('airborne crossing and landing separates',()=>{const b=make();b.p.x=470;b.p.y=-180;b.p.vy=0;for(let n=0;n<60;n++)b.step(1/60,{right:true});assert.ok(b.p.x>b.m.x+90);assert.equal(b.p.y,0);});
for(const dt of [1/30,1/120])for(const side of [-1,1])test(`charge wall separation at ${dt}/${side}`,()=>{const b=make(2);b.p.x=side<0?35:b.width-35;b.m.x=b.p.x-side*110;b.beginMonsterAttack(1);for(let n=0;n<3/dt;n++){b.step(dt);assert.ok(b.p.x>=35&&b.p.x<=b.width-35);assert.ok((b.p.x-b.m.x)*side>=96-1e-6);}assert.ok(b.p.hp<b.p.maxHp);});
