const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'delhi-streamlines-v1.4.html'), 'utf8');
const original = html.split('<script>')[1].split('</script>')[0];
const script = original.replace(/\}\)\(\);\s*$/, 'globalThis.__dsTest={p,state,touch,zone,zoneAt,enterZone,act,add,bankLine,update,saveProgress,savePayload,applySave,restorePosition,readPad,minimap,drawAtlas,districts,vehicles};})();');
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
vm.runInNewContext(script,env,{filename:'delhi-streamlines-v1.4.html'});
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
vm.runInNewContext(script,reload,{filename:'delhi-streamlines-v1.4.html'});
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
vm.runInNewContext(script,migration,{filename:'delhi-streamlines-v1.4.html'});
assert.equal(migration.__dsTest.state.zone,1);
assert.equal(migration.__dsTest.p.x,3650,'v1 district spawn translates into world space');
assert.equal(legacyStorage.has('bolo-streamlines-save-v2'),true,'legacy save migrated');
assert.equal(JSON.parse(legacyStorage.get('bolo-streamlines-save-v2')).checkpoint.x,3620,'v1 checkpoint translated without being overwritten');
const mobileNodesCtx={...env,innerWidth:390,innerHeight:844,devicePixelRatio:3,matchMedia:q=>({matches:q.includes('pointer:coarse')}),localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},addEventListener(){}};
vm.runInNewContext(script,mobileNodesCtx,{filename:'delhi-streamlines-v1.4.html'});
assert.equal(mobileNodesCtx.__dsTest.state.detail,false,'mobile auto detail is light');
assert.equal(element('world').width,585,'mobile DPR is bounded');
console.log('PASS: controls and tricks, four continuous neighborhoods and airborne transfers, old-save migration, position/settings persistence, trials, ghosts, minimap, blur and sound');
