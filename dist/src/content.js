const weapon=(id,name,en,icon,attack,speed,range,skills,extra={})=>({id,name,en,icon,attack,speed,range,skills,...extra});
export const WEAPONS=[
weapon('ls','太刀','LONG SWORD','╱',18,.42,92,['气刃斩','居合突进','登龙斩']),
weapon('gs','大剑','GREAT SWORD','▰',36,.94,85,['蓄力斩','强化冲撞','真蓄力斩']),
weapon('sns','单手剑','SWORD & SHIELD','◈',14,.30,65,['回旋斩','盾击','完美连击']),
weapon('db','双剑','DUAL BLADES','⋀',10,.21,61,['鬼人乱舞','螺旋突进','疾风连斩']),
weapon('hammer','大锤','HAMMER','⬒',33,.85,73,['横挥重击','回旋冲锋','陨石重锤']),
weapon('horn','狩猎笛','HUNTING HORN','♬',25,.68,84,['音波震击','疗愈旋律','三音演奏'],{heal:true}),
weapon('lance','长枪','LANCE','↗',20,.52,120,['连续突刺','守势冲锋','流转突刺']),
weapon('gunlance','铳枪','GUNLANCE','⤴',26,.70,103,['炮击','爆风突进','龙击炮']),
weapon('axe','斩斧','SWITCH AXE','⚒',27,.64,92,['属性斩','剑形突进','属性解放']),
weapon('cb','盾斧','CHARGE BLADE','✥',23,.58,86,['盾斧连击','高压斩','超高出力']),
weapon('glaive','操虫棍','INSECT GLAIVE','⸸',16,.36,108,['飞圆斩','虫跃','降龙'],{vault:true}),
weapon('lbg','轻弩','LIGHT BOWGUN','⌁',12,.34,420,['贯通弹','滑步射击','起爆龙弹'],{ranged:true}),
weapon('hbg','重弩','HEAVY BOWGUN','▤',28,.78,480,['散弹','机关射击','狙击龙弹'],{ranged:true}),
weapon('bow','弓','BOW','❯',18,.48,390,['刚射','滑步蓄力','龙之箭'],{ranged:true})];
export const MONSTERS=[
{id:'izuchi',name:'镰鼬龙王',en:'GREAT IZUCHI',quest:'风起废神社',area:'废神社',areaEn:'SHRINE RUINS',stars:1,hp:520,damage:12,speed:66,reward:120,common:'hide',rare:'tail',color:'#d78b46',description:'竹影摇曳，镰尾掠过。先观察它的尾巴，再寻找出刀的时机。',moves:['镰尾横扫','疾风突进','啄击']},
{id:'arzuros',name:'青熊兽',en:'ARZUROS',quest:'雪原的访客',area:'寒冷群岛',areaEn:'FROST ISLANDS',stars:2,hp:850,damage:17,speed:52,reward:200,common:'fur',rare:'shell',color:'#6da5ab',description:'沉重的脚步打破雪原寂静。避开巨爪，趁它收招时反击。',moves:['巨爪横扫','狂奔冲撞','震地重拍']},
{id:'rathian',name:'雌火龙',en:'RATHIAN',quest:'女王的领地',area:'熔岩洞',areaEn:'LAVA CAVERNS',stars:3,hp:1250,damage:23,speed:75,reward:320,common:'scale',rare:'plate',color:'#97a46c',description:'熔火映亮绿色双翼。穿过火球的间隙，迎接女王的挑战。',moves:['三连火球','女王冲撞','翻身尾扫']}
];
export const ITEMS={hide:{name:'镰鼬龙王的皮',icon:'▱'},tail:{name:'镰鼬龙王的尾',icon:'⌁',rare:true},fur:{name:'青熊兽的毛',icon:'≋'},shell:{name:'青熊兽的甲壳',icon:'⬡',rare:true},scale:{name:'雌火龙的鳞',icon:'◇'},plate:{name:'雌火龙的逆鳞',icon:'✧',rare:true}};
export const getWeapon=id=>WEAPONS.find(w=>w.id===id)||WEAPONS[0];
