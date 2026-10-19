// Decorative Rise-inspired ecology. Pure drawing: no combat, pickups or random state.
const mod=(x,n)=>(x%n+n)%n;
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const poly=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
function bamboo(c,x,y,t,seed){
 for(let j=0;j<4;j++){const h=38+(seed+j*13)%28,base=x+j*7,sway=Math.sin(t*.65+seed+j*.6)*1.2;c.save();c.translate(base,y);c.rotate(sway*.012);rect(c,0,-h,2,h,'#678f79');for(let k=8;k<h;k+=10){rect(c,-1,-k,4,1,'#9aaf8b');const s=k%20?1:-1;poly(c,[[1,-k],[s*12,-k-7],[s*7,-k-1]],'#7c9b7d');poly(c,[[1,-k-2],[-s*8,-k-8],[-s*5,-k-2]],'#91aa87');}c.restore();}
}
function herb(c,x,y,t,fire,seed){
 const lean=Math.sin(t*.8+seed)*1.3;c.save();c.translate(x,y);c.rotate(lean*.025);
 const leaf=fire?'#947964':'#91b3b6',tip=fire?'#bd9574':'#c1d4cf';
 for(let j=-1;j<=1;j++){poly(c,[[0,0],[j*6-2,-7-Math.abs(j)*2],[j*5+2,-11],[j*3+2,-3]],leaf);rect(c,j*5-1,-10-Math.abs(j),3,2,tip);}rect(c,-1,-7,2,8,leaf);c.restore();
}
function lizard(c,x,y,t){
 const toes=Math.sin(t*7);poly(c,[[x-7,y],[x-14,y-2+Math.sin(t*2)],[x-9,y+2],[x,y+2]],'#8b9980');rect(c,x-6,y-3,10,4,'#9aa58a');rect(c,x+3,y-4,5,4,'#acb299');
 poly(c,[[x-5,y-3],[x-3,y-7],[x+1,y-6],[x+3,y-3]],'#7c8b79');rect(c,x+6,y-3,1,1,'#637d6b');rect(c,x-4,y+1+toes,2,3,'#8a997e');rect(c,x+2,y+1-toes,2,3,'#8a997e');
}
function squid(c,x,y,t,color){
 poly(c,[[x,y-4],[x+4,y],[x+2,y+4],[x-2,y+4],[x-4,y]],color);rect(c,x-1,y-1,2,3,'#c1cfb8');
 for(let j=-1;j<=1;j++)poly(c,[[x+j*2,y+3],[x+j*2+Math.sin(t*3+j)*2,y+8],[x+j*2+1,y+4]],color);
}
function bat(c,x,y,t){const wing=Math.sin(t*5)*3;poly(c,[[x,y],[x-8,y-4-wing],[x-6,y+1],[x-3,y+2],[x,y+1],[x+3,y+2],[x+6,y+1],[x+8,y-4-wing]],'#a1949e');rect(c,x-1,y-2,3,5,'#b09b9b');rect(c,x-2,y-4,1,3,'#b09b9b');rect(c,x+2,y-4,1,3,'#b09b9b');}
export function drawEcology(c,W,floor,area,time,camera=0,reduced=false){
 const t=reduced?0:time,depth=camera*.32;
 c.save();c.globalAlpha=.58;c.filter='blur(0.35px)';
 if(area===1){
  // A distant tidal channel gives the Lampsquid a habitat behind the fighting floor.
  rect(c,0,floor-48,W,24,'#769ba9');rect(c,0,floor-48,W,2,'#adc6cb');
  for(let i=-1;i<W/85+1;i++){const x=i*85-mod(depth,85);rect(c,x+Math.sin(t*.5+i)*3,floor-40+(i%3)*3,24,1,'#aec7c8');}
 }
 rect(c,0,floor-12,W,12,['#668372','#96afb8','#62515a'][area]);
 const tile=190,start=Math.floor(depth/tile)-1,end=Math.ceil((depth+W)/tile)+1;
 for(let i=start;i<=end;i++){
  const x=i*tile-depth,seed=mod(i*37,97);
  if(area===0){bamboo(c,x+18,floor-12,t,seed);bamboo(c,x+113,floor-12,t,seed+6);
   poly(c,[[x+65,floor-18],[x+72,floor-24],[x+100,floor-24],[x+112,floor-18],[x+114,floor-12],[x+63,floor-12]],'#77927e');
   const phase=mod(t+seed*.19,22);if(phase<14){c.save();c.globalAlpha*=Math.min(1,phase/2,(14-phase)/2);const crawl=Math.min(1,phase/5)*14+Math.max(0,phase-10)*2;lizard(c,x+72+crawl,floor-25,t);c.restore();}
  }else if(area===1){
   for(let j=0;j<3;j++)herb(c,x+30+j*14,floor-12,t,false,seed+j);
   const phase=mod(t+seed*.12,26);if(phase<18){c.save();c.globalAlpha*=Math.min(1,phase/3,(18-phase)/3);for(let j=0;j<3;j++)squid(c,x+80+phase*3-j*12,floor-39+Math.sin(t*.8+j)*2,t+j,['#b99d94','#bdba8a','#91b7a0'][j]);c.restore();}
  }else{
   poly(c,[[x+20,floor-15],[x+29,floor-20],[x+64,floor-20],[x+73,floor-15],[x+77,floor-12],[x+18,floor-12]],'#74616a');
   for(let j=0;j<3;j++)herb(c,x+34+j*11,floor-20,t,true,seed+j);
   const phase=mod(t+seed*.16,30);if(phase<13){c.save();c.globalAlpha*=Math.min(1,phase/2,(13-phase)/2);for(let j=0;j<3;j++)bat(c,x+40+phase*7-j*16,floor-106-j*7+Math.sin(t*.7+j)*4,t+j);c.restore();}
  }
 }
 c.restore();
}
