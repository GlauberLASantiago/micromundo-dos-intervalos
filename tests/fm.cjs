const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const begin=html.indexOf('let reverbLevel=25;');
const source=html.slice(begin,html.indexOf('// Sinal acústico',begin));
function param(){return {events:[],setValueAtTime(value,time){this.events.push(['set',value,time]);},setTargetAtTime(value,time,constant){this.events.push(['target',value,time,constant]);},linearRampToValueAtTime(value,time){this.events.push(['linear',value,time]);},exponentialRampToValueAtTime(value,time){assert.ok(value>0);this.events.push(['exponential',value,time]);}};}
function context(){
 const oscillators=[],gains=[],convolvers=[];
 const node=()=>({connections:[],connect(target){this.connections.push(target);},disconnect(){this.disconnected=true;}});
 return {state:'suspended',currentTime:10,destination:{},sampleRate:8000,oscillators,gains,convolvers,
  async resume(){this.state='running';this.resumed=true;},
  createOscillator(){const n={...node(),frequency:param(),start(time){this.startTime=time;},stop(time){this.stopTime=time;}};oscillators.push(n);return n;},
  createConvolver(){const n=node();convolvers.push(n);return n;},
  createBuffer(channels,length,sampleRate){const data=Array.from({length:channels},()=>new Float32Array(length));return {numberOfChannels:channels,length,sampleRate,getChannelData(channel){return data[channel];}};},
  createGain(){const n={...node(),gain:param()};gains.push(n);return n;}};
}
(async()=>{
 const ctx=context();
 const sandbox=vm.createContext({console,document:{getElementById:()=>({})},window:{AudioContext:function(){return ctx;}}});
 vm.runInContext('let audio=null;const tempo=()=>120;const els={status:{}};'+source,sandbox);
 sandbox.ctx=ctx;
 await vm.runInContext('playTone(440,ctx)',sandbox);
 assert.equal(ctx.resumed,true);assert.equal(ctx.oscillators.length,2);
 const [carrier,modulator]=ctx.oscillators,[modGain,output]=ctx.gains;
 assert.equal(carrier.type,'sine');assert.equal(modulator.type,'sine');
 assert.deepEqual(carrier.frequency.events,[['set',440,10]]);
 assert.deepEqual(modulator.frequency.events,[['set',6160,10]]);
 assert.equal(modulator.connections[0],modGain);assert.equal(modGain.connections[0],carrier.frequency);
 assert.equal(carrier.connections[0],output);assert.equal(output.connections[0],ctx.gains[2]);
 const [input,dry,wet]=ctx.gains.slice(2);
 assert.equal(dry.connections[0],ctx.destination);assert.equal(wet.connections[0],ctx.destination);
 assert.equal(input.connections[1],ctx.convolvers[0]);assert.equal(ctx.convolvers[0].connections[0],wet);
 assert.equal(ctx.convolvers[0].buffer.numberOfChannels,2);assert.equal(ctx.convolvers[0].buffer.length,16000);
 vm.runInContext('audio=ctx;setReverbLevel(0)',sandbox);assert.equal(wet.gain.events.at(-1)[1],0);assert.equal(dry.gain.events.at(-1)[1],1);
 vm.runInContext('setReverbLevel(100)',sandbox);assert.equal(wet.gain.events.at(-1)[1],0.5);assert.equal(dry.gain.events.at(-1)[1],0.5);
 assert.deepEqual(modGain.gain.events[1],['linear',1074,10.01]);
 assert.deepEqual(modGain.gain.events[2],['exponential',0.0001,11.01]);
 assert.equal(output.gain.events[1][1],0.53);assert.equal(output.gain.events[2][1],0.265);
 assert.equal(carrier.startTime,modulator.startTime);assert.equal(carrier.stopTime,modulator.stopTime);
 carrier.onended();for(const n of [...ctx.oscillators,...ctx.gains.slice(0,2)])assert.equal(n.disconnected,true);
 await assert.rejects(vm.runInContext('playTone(0,ctx)',sandbox),/positiva/);
 vm.runInContext('tone(69,2)',sandbox);await Promise.resolve();
 assert.equal(ctx.oscillators.length,4);assert.equal(ctx.oscillators[2].frequency.events[0][1],440);
 assert.equal(ctx.gains[6].gain.events[3][2],11);
 assert.equal(ctx.convolvers.length,1);
 console.log('OK reverb routing, adjustable mix and shared effect; FM operators, routing, envelopes, cleanup and app integration.');
})().catch(err=>{console.error(err);process.exitCode=1;});
