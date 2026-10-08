const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const begin=html.indexOf('async function playTone(');
const source=html.slice(begin,html.indexOf('// Sinal acústico',begin));
function param(){return {events:[],setValueAtTime(value,time){this.events.push(['set',value,time]);},linearRampToValueAtTime(value,time){this.events.push(['linear',value,time]);},exponentialRampToValueAtTime(value,time){assert.ok(value>0);this.events.push(['exponential',value,time]);}};}
function context(){
 const oscillators=[],gains=[];
 const node=()=>({connections:[],connect(target){this.connections.push(target);},disconnect(){this.disconnected=true;}});
 return {state:'suspended',currentTime:10,destination:{},oscillators,gains,
  async resume(){this.state='running';this.resumed=true;},
  createOscillator(){const n={...node(),frequency:param(),start(time){this.startTime=time;},stop(time){this.stopTime=time;}};oscillators.push(n);return n;},
  createGain(){const n={...node(),gain:param()};gains.push(n);return n;}};
}
(async()=>{
 const ctx=context();
 const sandbox=vm.createContext({console,window:{AudioContext:function(){return ctx;}}});
 vm.runInContext('let audio=null;const tempo=()=>120;const els={status:{}};'+source,sandbox);
 sandbox.ctx=ctx;
 await vm.runInContext('playTone(440,ctx)',sandbox);
 assert.equal(ctx.resumed,true);assert.equal(ctx.oscillators.length,2);
 const [carrier,modulator]=ctx.oscillators,[modGain,output]=ctx.gains;
 assert.equal(carrier.type,'sine');assert.equal(modulator.type,'sine');
 assert.deepEqual(carrier.frequency.events,[['set',440,10]]);
 assert.deepEqual(modulator.frequency.events,[['set',6160,10]]);
 assert.equal(modulator.connections[0],modGain);assert.equal(modGain.connections[0],carrier.frequency);
 assert.equal(carrier.connections[0],output);assert.equal(output.connections[0],ctx.destination);
 assert.deepEqual(modGain.gain.events[1],['linear',1074,10.01]);
 assert.deepEqual(modGain.gain.events[2],['exponential',0.0001,11.01]);
 assert.equal(output.gain.events[1][1],0.53);assert.equal(output.gain.events[2][1],0.265);
 assert.equal(carrier.startTime,modulator.startTime);assert.equal(carrier.stopTime,modulator.stopTime);
 carrier.onended();for(const n of [...ctx.oscillators,...ctx.gains])assert.equal(n.disconnected,true);
 await assert.rejects(vm.runInContext('playTone(0,ctx)',sandbox),/positiva/);
 vm.runInContext('tone(69,2)',sandbox);await Promise.resolve();
 assert.equal(ctx.oscillators.length,4);assert.equal(ctx.oscillators[2].frequency.events[0][1],440);
 assert.equal(ctx.gains[3].gain.events[3][2],11);
 console.log('OK FM operators, routing, envelopes, cleanup and app integration.');
})().catch(err=>{console.error(err);process.exitCode=1;});
