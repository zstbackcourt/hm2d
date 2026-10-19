import test from 'node:test';
import assert from 'node:assert/strict';
import {createSave,rewardHunt,upgrade,parseSave,stats} from '../dist/src/model.js';
test('hunter defaults and identity validation',()=>{const s=createSave('  阿焰  ','female'); assert.equal(s.name,'阿焰'); assert.equal(s.gender,'female'); assert.throws(()=>createSave('','male'));assert.equal(stats(s).hp,100)});
test('victory grants bounded drops and cannot be claimed twice',()=>{const s=createSave('猎人','male'); rewardHunt(s,0,'hunt1',()=>0);assert.equal(s.items.hide,2);assert.equal(s.items.tail,1);assert.equal(s.money,120);assert.equal(s.unlocked,1);rewardHunt(s,0,'hunt1',()=>0);assert.equal(s.money,120)});
test('common drops reach four and rare drops may be absent',()=>{const s=createSave('猎人','male');rewardHunt(s,0,'hunt2',()=>.99);assert.equal(s.items.hide,4);assert.equal(s.items.tail||0,0)});
test('insufficient resources do not partially mutate save',()=>{const s=createSave('猎人','male');const before=JSON.stringify(s);assert.equal(upgrade(s,'weapon').ok,false);assert.equal(JSON.stringify(s),before)});
test('upgrade deducts exact cost and changes damage',()=>{const s=createSave('猎人','male');s.money=100;s.items.hide=3;const before=stats(s).attack;assert.equal(upgrade(s,'weapon').ok,true);assert.equal(s.money,20);assert.equal(s.items.hide,1);assert.ok(stats(s).attack>before)});
test('save round trip and corruption rejected',()=>{const s=createSave('猎人','male');assert.deepEqual(parseSave(JSON.stringify(s)),s);assert.throws(()=>parseSave('{bad'));s.money=-1;assert.throws(()=>parseSave(JSON.stringify(s)));s.money=0;s.weapon='invalid';assert.throws(()=>parseSave(JSON.stringify(s)))});
