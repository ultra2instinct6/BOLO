const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'delhi-streamlines-v1.6.html'), 'utf8');
const original = html.split('<script>')[1].split('</script>')[0];
const script = original.replace(/\}\)\(\);\s*$/, 'globalThis.__dsTest={p,state,touch,zone,bowlSurface,resetTerrain,dropAtBowl,zoneAt,enterZone,act,add,bankLine,update,saveProgress,savePayload,applySave,restorePosition,readPad,minimap,drawAtlas,drawRider,districts,vehicles,worldRoads};})();');
assert.notEqual(script,original,'instrument test-only access to game state');
const nodes = new Map(), listeners = {}, frames = [];
function element(id) {
  if (!nodes.has(id)) nodes.set(id, {
    id, textContent:'', innerHTML:'', hidden:false, dataset:{},
    children:[], style:{}, classList:{toggle(){},remove(){},add(){}},
    addEventListener(type,fn){(this.events ||= {})[type] = fn},
    replaceChildren(){this.children=[]}, appendChild(el){this.children.push(el)},
    setPointerCapture(){}, setAttribute(){}, getBoundingClientRect(){return {left:0,top:0,width:126,height:126}}
  });
  return nodes.get(id);
}
const ctx = new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get(o,k){return k in o?o[k]:()=>{}}, set(o,k,v){o[k]=v;return true}});
element('world').getContext=()=>ctx;element('atlas').width=620;element('atlas').height=410;element('atlas').getContext=()=>ctx;
const storage=new Map();let audioOscillators=0;
class FakeParam {setValueAtTime(){} exponentialRampToValueAtTime(){} setTargetAtTime(){}}
class FakeAudioContext {
  constructor(){this.state='running';this.currentTime=0;this.destination={}}
  createOscillator(){audioOscillators++;return {frequency:new FakeParam(),connect(){},start(){},stop(){}}}
  createGain(){return {gain:new FakeParam(),connect(){}}}
  resume(){}
}
const touchButtons=Array.from(html.matchAll(/<button data-(act|hold)="([^"]+)"/g),([_,type,action],i)=>{
  const b=element('touch-'+i);b.dataset[type]=action;return b;
});
const document={getElementById:element,createElement:()=>element('button-'+Math.random()),
  querySelectorAll:selector=>touchButtons.filter(b=>selector==='[data-hold]'?'hold' in b.dataset:'act' in b.dataset)};
let pad;
const env={document,navigator:{getGamepads:()=>pad?[pad]:[]},innerWidth:1280,innerHeight:720,devicePixelRatio:1,
  matchMedia:()=>({matches:false}),AudioContext:FakeAudioContext,
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  requestAnimationFrame:fn=>frames.push(fn),addEventListener:(type,fn)=>listeners[type]=fn,
  Math,Number,Set,Array,Map,console};
vm.runInNewContext(script,env,{filename:'delhi-streamlines-v1.6.html'});
const game=env.__dsTest;
function step(n=1){for(let i=0;i<n;i++){const fn=frames.shift(); assert(fn, 'frame callback scheduled'); fn((i+1+step.t++)*16.67)}}step.t=0;
function key(type,key){listeners[type]({key,preventDefault(){}})}
function buttons(){return Array.from({length:17},(_,i)=>({pressed:!!pad.pressed[i],value:pad.values?.[i]||0}))}
assert.equal(element('zones').children.length,4);
assert.equal(element('menu').hidden,false);
element('start').onclick(); step(4);
assert.equal(element('menu').hidden,true);
assert.match(element('place').textContent,/Central Delhi/);
key('keydown','i');key('keyup','i');step(2);
assert.match(element('place').textContent,/INSTINCT ON/);
key('keydown',' ');step(12);key('keyup',' ');step(15);
assert.match(element('event').textContent,/Ollie|banked/);
key('keydown','j');step(3);key('keyup','j');step(110);
assert.equal(element('mission').textContent.startsWith('02'),true,'first challenge cleared');
key('keydown','Tab');step(2);assert.equal(element('menu').hidden,false);
element('zones').children[2].onclick();element('start').onclick();step(4);
assert.match(element('place').textContent,/Old Delhi Bazaar/);
pad={mapping:'standard',pressed:{},axes:[0,0,0,0]};Object.defineProperty(pad,'buttons',{get:buttons});step(2);
pad.pressed[0]=true;step(4);pad.pressed[0]=false;step(5);
assert.match(element('event').textContent,/Ollie|Word Spot/);
pad.pressed[9]=true;step(2);pad.pressed[9]=false;step(2);
assert.equal(element('menu').hidden,false);
pad.pressed[15]=true;step(2);pad.pressed[15]=false;step(2);
pad.pressed[0]=true;step(2);pad.pressed[0]=false;step(2);
assert.match(element('place').textContent,/Community Skate Ground/);
assert.equal(element('menu').hidden,true);
element('pauseBtn').onclick();element('preset').onclick();element('start').onclick();step(2);
pad.axes[3]=.85;step(2);pad.axes[3]=-.88;step(3);pad.axes[3]=0;step(2);
assert.match(element('event').textContent,/Ollie/);
step(90);
const pop=touchButtons.find(b=>b.dataset.hold==='pop');
pop.events.pointerdown({pointerId:2,preventDefault(){}});step(7);
pop.events.pointerup({pointerId:2});step(2);
assert.match(element('event').textContent,/Ollie/);
const neutral={x:0,y:0,push:false,manual:false,brake:false,balance:0,spin:0};
pad=null;
game.enterZone(0);game.state.paused=false;game.state.missions[0]=0;
Object.assign(game.p,{x:467,y:1220,vx:180,vy:0,z:0,railIndex:-1,rampTime:0});
game.update(1/60,neutral);
assert.equal(game.state.taskReady,true,'automatic Janpath bank launch satisfies the first mission');
game.bankLine();assert.equal(game.state.missions[0],1);
game.enterZone(3);game.state.paused=false;
game.add('grind','Rail A',200,'rail-0');game.add('grind','Rail B',200,'rail-1');game.add('grind','Rail A',200,'rail-0');
assert.equal(game.state.combo,490,'distinct features award full points; repeated feature is reduced');
assert.equal(game.state.multiplier,2);
assert.match(element('auraLabel').textContent,/FLOW/);
game.enterZone(0);game.state.paused=false;
Object.assign(game.p,{x:1110,y:1310,vx:230,vy:0,z:0,railIndex:-1});
game.act('grind');assert.equal(game.p.railIndex,0);assert.equal(game.p.y,1300,'snap to actual rail');
let railSteps=0;
while(game.p.railIndex>=0&&railSteps++<100){game.update(1/60,neutral);assert.equal(game.p.y,1300,'stay on rail line')}
assert(railSteps<100,'grind exits at endpoint');assert.equal(game.p.x,1240,'never travel beyond rail end while grinding');
pad={mapping:'standard',pressed:{},values:{7:.65},axes:[0,0,0,0]};Object.defineProperty(pad,'buttons',{get:buttons});
game.state.prevPad=[];assert.equal(game.readPad().push,true,'analog R2 activates push');
pad.values[7]=.4;assert.equal(game.readPad().push,false,'R2 threshold releases');
Object.assign(game.p,{x:900,y:1300,z:0,railIndex:-1,vx:160,vy:0,lastLanding:.1,usedRevert:false});
pad.values[6]=.65;game.state.prevPad=[];game.readPad();
assert.equal(game.p.usedRevert,true,'analog L2 triggers revert');
pad=null;
game.enterZone(1);game.state.paused=false;game.p.x=3625;game.p.y=1800;
game.add('ollie','Word trick',100,'flat-pop');
assert(game.state.words.punjabi.includes('tea'),'Word Spot discovered near storefront');
assert.match(element('codex').textContent,/ਚਾਹ.*tea/);
game.state.preset='Flow';game.state.assist=false;game.state.reduced=true;game.saveProgress();
const saved=JSON.parse(storage.get('bolo-streamlines-save-v2'));
assert.equal(saved.version,2);assert(saved.words.punjabi.includes('tea'));
game.state.words.punjabi=[];game.state.preset='Arcade';game.state.assist=true;game.state.reduced=false;
game.applySave(saved);assert(game.state.words.punjabi.includes('tea'));
assert.equal(game.state.preset,'Flow');assert.equal(game.state.assist,false);assert.equal(game.state.reduced,true);
game.state.mode='trial';game.enterZone(3);game.state.paused=false;game.state.timeLeft=.02;
game.add('ollie','Trial trick',200,'flat-pop');game.update(.03,neutral);
assert.equal(game.state.paused,true,'Line Run ends at 60-second timer');
assert(game.state.bestRuns[3]>0,'trial best recorded');
element('start').onclick();assert.equal(game.state.trialActive,true,'continue restarts a finished trial');
assert.equal(game.state.timeLeft,60);
game.state.mode='free';game.enterZone(3);game.state.paused=false;game.act('spot');
for(let i=0;i<310;i++)game.update(1/60,neutral);
assert.equal(game.state.ghostReady,true,'five-second ghost is recorded');
game.act('ghost');assert.equal(game.state.ghostChallenge,5);
for(let i=0;i<310;i++)game.update(1/60,neutral);
assert.equal(game.state.ghostChallenge,0);assert.match(element('runResult').textContent,/Ghost challenge/);
let segments=0;ctx.lineTo=()=>segments++;
const oldRoads=game.zone().roads;game.zone().roads=[];game.minimap();const baseline=segments;game.zone().roads=[[[0,0],[150,100],[300,200]]];game.minimap();
assert.equal(segments,baseline*2+2,'global minimap renders all other districts plus both segments of a polyline');game.zone().roads=oldRoads;
const stick=element('stick');stick.events.pointerdown({pointerId:77,clientX:100,clientY:50});
assert.equal(game.touch.id,77);listeners.blur();assert.equal(game.touch.id,null);
assert.equal(element('knob').style.transform,'');assert.equal(game.state.paused,true);
assert(audioOscillators>1,'procedural Web Audio creates event sounds');
element('muteBtn').onclick();const beforeMute=audioOscillators;
game.state.paused=false;Object.assign(game.p,{z:0,railIndex:-1,charging:false});
key('keydown',' ');key('keyup',' ');
assert.equal(audioOscillators,beforeMute,'mute suppresses new event sounds');
game.state.mode='free';game.state.trialActive=false;game.enterZone(0);game.state.paused=false;
game.state.combo=0;game.state.multiplier=1;game.state.kinds.clear();const movingTraffic=game.vehicles;
game.add('ollie','Seam pop',200,'connector-pop');
Object.assign(game.p,{x:3293,y:1300,z:18,vz:0,vx:240,vy:0,railIndex:-1});game.update(.08,neutral);
assert.equal(game.state.zone,1,'Central to Punjabi seam changes region without fast travel');
assert(game.p.x>3300&&game.state.combo>=375,'airborne gateway transfer preserves combo and adds points');
assert.equal(game.vehicles,movingTraffic,'traffic continues across zone transition');
Object.assign(game.p,{x:4860,y:2143,z:18,vz:0,vx:0,vy:220});game.update(.08,neutral);
assert.equal(game.state.zone,3,'Punjabi to skate ground connector is continuous');
Object.assign(game.p,{x:3306,y:2980,z:18,vz:0,vx:-220,vy:0});game.update(.08,neutral);
assert.equal(game.state.zone,2,'skate ground to bazaar connector is continuous');
Object.assign(game.p,{x:1400,y:2157,z:18,vz:0,vx:0,vy:-220});game.update(.08,neutral);
assert.equal(game.state.zone,0,'bazaar to Central connector is continuous');
assert.equal(game.state.visited.filter(Boolean).length,4,'city visit progress covers all four neighborhoods');
assert(game.state.combo>700,'combo is uninterrupted around the loop');
game.bankLine();assert(game.state.best>0);
element('lighting').onclick();assert.equal(game.state.lighting,'dusk');
element('quality').onclick();element('quality').onclick();assert.equal(game.state.quality,'low');
step(2); // dusk overlays and low-detail drawing execute inside real animation frames
game.enterZone(3);game.state.paused=false;game.p.x=4600;game.p.y=3240;game.saveProgress();
element('pauseBtn').onclick();element('start').onclick();
assert.equal(game.p.x,4600,'continuing from atlas does not reset to district spawn');
assert.equal(game.p.y,3240);
const worldSave=JSON.parse(storage.get('bolo-streamlines-save-v2'));
assert.equal(worldSave.position.x,4600);assert.equal(worldSave.position.y,3240);
const reload={...env,requestAnimationFrame(){},addEventListener(){}};
vm.runInNewContext(script,reload,{filename:'delhi-streamlines-v1.6.html'});
assert(reload.__dsTest.state.words.punjabi.includes('tea'),'Word Spot survives a fresh game boot');
assert(reload.__dsTest.state.bestRuns[3]>0,'trial best survives a fresh game boot');
assert.equal(reload.__dsTest.state.preset,'Flow');
assert.equal(reload.__dsTest.state.assist,false);
assert.equal(reload.__dsTest.state.reduced,true);
assert.equal(reload.__dsTest.state.audioOn,false);
assert.equal(reload.__dsTest.p.x,4600,'world position resumes after reload');
assert.equal(reload.__dsTest.p.y,3240);
assert.equal(reload.__dsTest.state.zone,3);
assert.equal(reload.__dsTest.state.lighting,'dusk');assert.equal(reload.__dsTest.state.quality,'low');
assert.equal(reload.__dsTest.state.visited.filter(Boolean).length,4);
const legacyData={...saved,version:1,zone:1,position:undefined,checkpoint:{zone:1,x:320,y:1180}};
const legacyStorage=new Map([['bolo-streamlines-save-v1',JSON.stringify(legacyData)]]);
const migration={...env,localStorage:{getItem:k=>legacyStorage.get(k)||null,setItem:(k,v)=>legacyStorage.set(k,v)},requestAnimationFrame(){},addEventListener(){}};
vm.runInNewContext(script,migration,{filename:'delhi-streamlines-v1.6.html'});
assert.equal(migration.__dsTest.state.zone,1);
assert.equal(migration.__dsTest.p.x,3650,'v1 district spawn translates into world space');
assert.equal(legacyStorage.has('bolo-streamlines-save-v2'),true,'legacy save migrated');
assert.equal(JSON.parse(legacyStorage.get('bolo-streamlines-save-v2')).checkpoint.x,3620,'v1 checkpoint translated without being overwritten');
const mobileNodesCtx={...env,innerWidth:390,innerHeight:844,devicePixelRatio:3,matchMedia:q=>({matches:q.includes('pointer:coarse')}),localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},addEventListener(){}};
vm.runInNewContext(script,mobileNodesCtx,{filename:'delhi-streamlines-v1.6.html'});
assert.equal(mobileNodesCtx.__dsTest.state.detail,false,'mobile auto detail is light');
assert.equal(element('world').width,585,'mobile DPR is bounded');
// The bowl is a continuous concave surface, rather than the old automatic jump ring.
game.state.mode='free';game.state.trialActive=false;game.dropAtBowl();
const bowl=game.zone().bowls[0];
assert.equal(game.state.zone,3);assert.equal(game.p.x,bowl.x+bowl.rx+32,'quick drop-in starts outside the bowl lip');
for(let i=0;i<35;i++)game.update(1/60,{...neutral,push:true});
assert(game.p.bowlDepth>0,'holding push from the practice drop-in actually rolls into the bowl');
function placeBowl(x,vx,z=0){Object.assign(game.p,{x,y:bowl.y,vx,vy:0,z,vz:0,dir:vx<0?Math.PI:0,railIndex:-1,rampTime:0});game.resetTerrain()}
game.enterZone(0);game.state.paused=false;Object.assign(game.p,{x:610,y:1270,vx:420,vy:0,dir:0,z:0,railIndex:-1});
game.update(1/60,{...neutral,x:0,y:1});
assert(game.p.dir>0&&game.p.dir<.2&&game.p.lean>0,'board turns and leans into a high-speed steer instead of snapping sideways');
game.enterZone(3);game.state.paused=false;game.state.missions[3]=0;
placeBowl(bowl.x+bowl.rx-9,-220);const entryDepth=game.p.bowlDepth;
game.update(1/60,neutral);
assert.equal(game.p.z,0,'entering toward the center does not automatically launch');
assert(game.p.bowlDepth>entryDepth,'board is below the lip as it rolls downhill');
placeBowl(bowl.x+bowl.rx*.94,0);let peak=0,deepest=0,reachedFarSide=false,carved=false,airborne=false;
for(let i=0;i<145;i++){game.update(1/60,neutral);peak=Math.max(peak,Math.hypot(game.p.vx,game.p.vy));deepest=Math.max(deepest,game.p.bowlDepth);reachedFarSide ||= game.p.x<bowl.x-bowl.rx*.68;carved ||= game.p.bowlCarveAwarded;airborne ||= game.p.z>0}
assert(peak>170&&deepest>bowl.depth*.85,'gravity builds speed down into the bowl floor');
assert(reachedFarSide&&carved,'momentum carries the board up the opposite wall for a scored carve');
assert.equal(airborne,false,'coasting in the bowl stays in contact with the surface');
assert.equal(game.state.taskReady,true,'a real bowl carve qualifies for the park opening challenge');
game.bankLine();assert.equal(game.state.missions[3],1);
placeBowl(bowl.x+bowl.rx*.9,-90);for(let i=0;i<25;i++)game.update(1/60,neutral);
const coastSpeed=Math.hypot(game.p.vx,game.p.vy);
placeBowl(bowl.x+bowl.rx*.9,-90);for(let i=0;i<25;i++)game.update(1/60,{...neutral,push:true});
assert(Math.hypot(game.p.vx,game.p.vy)>coastSpeed+40,'pumping down the wall preserves and builds momentum');
assert(game.p.pumpTimer>0,'pumping has visual feedback');
placeBowl(bowl.x+bowl.rx*.6,140);let slipped=false;
for(let i=0;i<90;i++){game.update(1/60,neutral);slipped ||= game.p.z>0}
assert.equal(slipped,false,'a slow uphill ride rolls back instead of launching');
placeBowl(bowl.x+bowl.rx*.88,390);let popped=false;
for(let i=0;i<12;i++){game.update(1/60,neutral);popped ||= game.p.z>0&&game.p.vz>0}
assert(popped&&game.p.bowlCooldown>0,'sufficient outward speed produces a lip transfer');
placeBowl(bowl.x+bowl.rx+3,-300,35);game.update(1/60,neutral);
assert(game.p.bowlDepth>0&&game.p.z>35,'air height stays relative to the descending floor');
placeBowl(bowl.x+bowl.rx+70,100,50);game.update(1/60,{...neutral,push:true});
assert(game.p.vx<100,'holding push cannot accelerate the board in midair');
placeBowl(bowl.x,0);game.act('spot');game.p.x=bowl.x+bowl.rx+80;game.act('retry');
assert.equal(game.p.x,bowl.x);assert.equal(game.p.bowlDepth,bowl.depth,'checkpoint restores the correct bowl floor height');
game.saveProgress();
const bowlReload={...env,requestAnimationFrame(){},addEventListener(){}};
vm.runInNewContext(script,bowlReload,{filename:'delhi-streamlines-v1.6.html'});
assert.equal(bowlReload.__dsTest.p.bowlDepth,bowl.depth,'reloading inside a bowl restores surface height');
element('bowlDrop').onclick();
assert.equal(bowlReload.__dsTest.p.x,bowl.x+bowl.rx+32,'menu bowl-practice button reaches the drop-in');
let detailedBowlSeen=false;ctx.createRadialGradient=(x)=>{if(Math.abs(x-(bowl.x-bowl.rx*.28))<1)detailedBowlSeen=true;return {addColorStop(){}}};
game.state.detail=true;step(1);assert(detailedBowlSeen,'high-detail bowl contours and shading are rendered');
console.log('PASS: continuous city controls and save; real downhill bowls, far-wall carves, pumping, lip-speed gating, terrain-aware airtime, bowl checkpoint and high-detail rendering');
// Geometry regression: the painted street centre remains rideable through each district and city connector.
function closeToSegment(pt,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((pt[0]-a[0])*dx+(pt[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(pt[0]-a[0]-dx*t,pt[1]-a[1]-dy*t)}
function clearPolyline(road){for(let k=1;k<road.length;k++){const a=road[k-1],b=road[k],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/20);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;for(const d of game.districts){for(const r of [...d.buildings,...d.protected,...d.stalls])assert(!(x>r.x-20&&x<r.x+r.w+20&&y>r.y-20&&y<r.y+r.h+20),`${d.id}: street centre blocked by ${r.n||'stall'} at ${x}, ${y}`)}}}}
for(const d of game.districts)for(const r of d.roads)clearPolyline(r.map(pt=>[pt[0]+d.ox,pt[1]+d.oy]));
for(let i=0;i<game.worldRoads.length;i++){const r=game.worldRoads[i];clearPolyline(r);for(const [pt,d] of [[r[0],game.districts[i===2?1:i===3?2:0]],[r.at(-1),game.districts[i===0?1:i===1?2:3]]]){const distance=Math.min(...d.roads.flatMap(road=>road.slice(1).map((end,j)=>closeToSegment(pt,[road[j][0]+d.ox,road[j][1]+d.oy],[end[0]+d.ox,end[1]+d.oy]))));assert(distance<30,`connector ${i} does not meet ${d.id} street: ${distance.toFixed(1)}`)}}
// A flip must move the deck through an edge-on frame and return to its top side;
// holding or repeating a button during one jump cannot score repeated flips.
game.enterZone(3);game.state.paused=false;game.p.z=90;game.p.vz=0;game.p.vx=game.p.vy=0;
game.act('flip');assert(game.p.flipAge>.4);const trickPoints=game.state.combo;game.act('flip');assert.equal(game.state.combo,trickPoints,'one kickflip per airtime');
const scales=[];ctx.scale=(x,y)=>scales.push([x,y]);game.update(1/60,neutral);for(let i=0;i<7;i++)game.update(1/60,neutral);game.drawRider();assert(scales.some(([,y])=>y<.8),'board renders edge-on during a kickflip');
game.act('grab');assert(game.p.grabAge>0);const grabPoints=game.state.combo;game.act('grab');assert.equal(game.state.combo,grabPoints,'one grab per airtime');
for(let i=0;i<80&&game.p.z>0;i++)game.update(1/60,neutral);assert.equal(game.p.flipUsed,false,'landing resets trick availability');assert(game.p.landingAge>0,'landing compression is animated');
for(const [from,to,x,y,vx,vy] of [[0,1,3284,1305,300,0],[0,2,1400,2134,0,300],[1,3,4893,2134,0,300],[2,3,3284,2990,300,0]]){
  game.enterZone(from);game.state.paused=false;game.p.x=x;game.p.y=y;game.p.vx=vx;game.p.vy=vy;game.p.dir=Math.atan2(vy,vx);game.add('ollie','connector line',100,'cross-district');
  for(let i=0;i<14;i++)game.update(1/60,neutral);
  assert.equal(game.state.zone,to,`rider crosses city link ${from} to ${to} at ground level`);
  assert.equal(game.state.combo,100,'cross-district route preserves the current combo');
}
console.log('PASS: clear road centre lines and four connected routes; animated flip, grab, landing and trick input gating');
