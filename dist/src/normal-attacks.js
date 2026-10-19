// Visual variants only. Damage, contact time, range and movement belong to attackMotion.
const cut=(name,prep,hit,follow,trail='arc')=>({name,prep,hit,follow,trail});
const groups={
 blade:[
  cut('斜劈',{weapon:-1.3,handX:0,handY:-34,lean:-.23,legA:-.35,legB:.4,offX:-18,offY:-25},{weapon:1.8,handX:22,handY:-23,lean:.27,legA:.45,legB:-.4},{weapon:2.5,handX:18,handY:-12,lean:.32,legA:.4,legB:-.3}),
  cut('反手上挑',{weapon:2.6,handX:-2,handY:-12,lean:.25,bob:4,legA:-.6,legB:.5,kneeA:.65},{weapon:.35,handX:20,handY:-35,lean:-.12,bob:-2,legA:.25,legB:-.4},{weapon:-.9,handX:8,handY:-44,lean:-.23,legA:.15,legB:-.2}),
  cut('横斩',{weapon:-2.5,handX:-12,handY:-22,lean:-.32,legA:.25,legB:-.5,head:.17},{weapon:1.55,handX:24,handY:-24,lean:.15,legA:-.35,legB:.45,offX:-22,offY:-30},{weapon:3.1,handX:2,handY:-25,lean:.38,legA:-.2,legB:.3,head:-.2}),
  cut('过肩下劈',{weapon:-.45,handX:-3,handY:-46,lean:-.16,legA:-.45,legB:.5,twoHand:1},{weapon:2.15,handX:20,handY:-22,lean:.4,bob:3,legA:-.6,legB:.6,kneeA:.6,twoHand:1},{weapon:2.9,handX:17,handY:-9,lean:.48,bob:5,legA:-.5,legB:.5,kneeA:.7,twoHand:1})
 ],
 heavy:[
  cut('侧挥',{weapon:-2,handX:-10,handY:-29,lean:-.32,legA:.45,legB:-.5,twoHand:1},{weapon:1.6,handX:20,handY:-24,lean:.32,legA:-.5,legB:.55,twoHand:1},{weapon:2.9,handX:5,handY:-21,lean:.42,legA:-.4,legB:.4,twoHand:1}),
  cut('抡击',{weapon:2.8,handX:-3,handY:-13,lean:.25,bob:5,legA:-.7,legB:.6,kneeA:.7,twoHand:1},{weapon:.65,handX:19,handY:-33,lean:-.08,bob:-1,legA:.4,legB:-.4,twoHand:1},{weapon:-1.1,handX:3,handY:-41,lean:-.3,legA:.25,legB:-.35,twoHand:1}),
  cut('下砸',{weapon:-.5,handX:0,handY:-46,lean:-.18,legA:-.4,legB:.45,twoHand:1},{weapon:2.3,handX:18,handY:-20,lean:.45,bob:5,legA:-.65,legB:.65,kneeA:.8,twoHand:1},{weapon:3,handX:16,handY:-7,lean:.5,bob:7,legA:-.55,legB:.55,kneeA:.9,twoHand:1})
 ],
 pole:[
  cut('平刺',{weapon:1.57,handX:-8,handY:-25,lean:-.18,legA:.3,legB:-.35,twoHand:1},{weapon:1.57,handX:28,handY:-25,lean:.23,legA:-.45,legB:.5,twoHand:1},{weapon:1.57,handX:18,handY:-24,lean:.16,legA:-.3,legB:.3,twoHand:1},'line'),
  cut('低姿突刺',{weapon:1.8,handX:-6,handY:-15,lean:.22,bob:6,legA:-.65,legB:.7,kneeA:1,twoHand:1},{weapon:1.6,handX:29,handY:-17,lean:.4,bob:6,legA:-.8,legB:.85,kneeA:.7,twoHand:1},{weapon:1.75,handX:15,handY:-15,lean:.3,bob:5,legA:-.6,legB:.65,twoHand:1},'line'),
  cut('上挑',{weapon:2.5,handX:1,handY:-12,lean:.27,bob:4,legA:-.5,legB:.45,twoHand:1},{weapon:.7,handX:21,handY:-31,lean:-.07,legA:.3,legB:-.35,twoHand:1},{weapon:-.65,handX:5,handY:-43,lean:-.2,legA:.2,legB:-.25,twoHand:1})
 ],
 ranged:[
  cut('站姿射击',{weapon:0,handX:13,handY:-26,lean:0,legA:.15,legB:-.2,twoHand:1},{weapon:0,handX:15,handY:-26,lean:.06,legA:.2,legB:-.25,twoHand:1},{weapon:-.15,handX:6,handY:-27,lean:-.18,legA:.2,legB:-.3,twoHand:1}),
  cut('低姿射击',{weapon:.08,handX:10,handY:-22,lean:.17,bob:6,legA:-.8,legB:.6,kneeA:1.2,kneeB:.7,twoHand:1},{weapon:0,handX:16,handY:-23,lean:.2,bob:6,legA:-.85,legB:.65,kneeA:1.2,kneeB:.7,twoHand:1},{weapon:-.1,handX:7,handY:-23,lean:.05,bob:5,legA:-.7,legB:.6,kneeA:1,twoHand:1}),
  cut('侧身射击',{weapon:-.12,handX:5,handY:-32,lean:-.22,legA:.55,legB:-.6,head:.2,twoHand:1},{weapon:0,handX:21,handY:-30,lean:.08,legA:.5,legB:-.55,head:-.1,twoHand:1},{weapon:-.25,handX:10,handY:-33,lean:-.32,legA:.4,legB:-.5,head:.15,twoHand:1})
 ]
};
export function normalVariants(w){return groups[w.ranged?'ranged':['lance','gunlance','glaive'].includes(w.id)?'pole':['gs','hammer','horn','axe','cb'].includes(w.id)?'heavy':'blade'];}
export function chooseNormalVariant(w,last,rng=Math.random){const n=normalVariants(w).length,exclude=Number.isInteger(last)&&last>=0&&last<n;const pick=Math.min(n-(exclude?2:1),Math.floor(Math.max(0,rng())*(n-(exclude?1:0))));return exclude&&pick>=last?pick+1:pick;}
