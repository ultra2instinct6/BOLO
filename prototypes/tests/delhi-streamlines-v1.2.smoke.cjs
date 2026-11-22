const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'delhi-streamlines-v1.2.html'), 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];
const nodes = new Map(), listeners = {}, frames = [];
function element(id) {
  if (!nodes.has(id)) nodes.set(id, {
    id, textContent:'', innerHTML:'', hidden:false, dataset:{},
    children:[], style:{}, classList:{toggle(){},remove(){},add(){}},
    addEventListener(type,fn){(this.events ||= {})[type] = fn},
    replaceChildren(){this.children=[]}, appendChild(el){this.children.push(el)},
    setPointerCapture(){}, getBoundingClientRect(){return {left:0,top:0,width:126,height:126}}
  });
  return nodes.get(id);
}
const ctx = new Proxy({}, {get(o,k){return k in o?o[k]:()=>{}}, set(o,k,v){o[k]=v;return true}});
element('world').getContext=()=>ctx;
const touchButtons=Array.from(html.matchAll(/<button data-(act|hold)="([^"]+)"/g),([_,type,action],i)=>{
  const b=element('touch-'+i);b.dataset[type]=action;return b;
});
const document={getElementById:element,createElement:()=>element('button-'+Math.random()),
  querySelectorAll:selector=>touchButtons.filter(b=>selector==='[data-hold]'?'hold' in b.dataset:'act' in b.dataset)};
let pad;
const env={document,navigator:{getGamepads:()=>pad?[pad]:[]},innerWidth:1280,innerHeight:720,devicePixelRatio:1,
  matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null,setItem(){}},
  requestAnimationFrame:fn=>frames.push(fn),addEventListener:(type,fn)=>listeners[type]=fn,
  Math,Number,Set,Array,Map,console};
vm.runInNewContext(script,env,{filename:'delhi-streamlines-v1.2.html'});
function step(n=1){for(let i=0;i<n;i++){const fn=frames.shift(); assert(fn, 'frame callback scheduled'); fn((i+1+step.t++)*16.67)}}step.t=0;
function key(type,key){listeners[type]({key,preventDefault(){}})}
function buttons(){return Array.from({length:17},(_,i)=>({pressed:!!pad.pressed[i]}))}
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
assert.match(element('event').textContent,/Ollie/);
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
console.log('PASS: startup, Instinct, keyboard trick and mission, district switching, standard pad navigation, Cross, Flow flick, touch pop');
