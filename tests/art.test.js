import test from 'node:test';import assert from 'node:assert/strict';import {renderScene,renderBattle} from '../dist/src/art.js';import {Battle} from '../dist/src/engine.js';import {createSave} from '../dist/src/model.js';
// A drawing sink exercises complete render paths without a browser dependency.
const canvas=()=>({width:960,height:440,getContext:()=>new Proxy({}, {get:()=>()=>{},set:()=>true})});
test('all camp and battle scenes render without unresolved data references',()=>{for(let area=0;area<3;area++){assert.doesNotThrow(()=>renderScene(canvas(),area,1));assert.doesNotThrow(()=>renderBattle(canvas(),new Battle(createSave('猎人','female'),area)));}});
