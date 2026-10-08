const assert=require('node:assert/strict');const {app}=require('./challenges.cjs');const a=app(false);
assert.deepEqual(JSON.parse(a.run('JSON.stringify(rhythms.map(pattern=>pattern[0]))')),['Uniforme','Quadrática','Logarítmica','Cossenoidal','Fibonacci (intervalos)','Aleatória (exemplo fixo)']);
a.run("loadSong('math-8-chromatic')");
const code=a.get('code').value,start=a.get('start').value,pitches=JSON.parse(a.run('JSON.stringify(melody.map(n=>n.midi))'));
let sequences=[];
for(let i=0;i<6;i++){
 a.get('rhythm').value=String(i);a.get('rhythm').dispatchEvent({type:'change'});
 assert.equal(a.get('code').value,code);assert.equal(a.get('start').value,start);
 assert.deepEqual(JSON.parse(a.run('JSON.stringify(melody.map(n=>n.midi))')),pitches);
 const notes=JSON.parse(a.run('JSON.stringify(melody)'));
 assert.ok(notes.every(n=>n.dur>0&&Number.isFinite(n.start)));
 for(let j=1;j<notes.length;j++)assert.ok(Math.abs(notes[j].start-notes[j-1].start-notes[j-1].dur)<1e-9);
 sequences.push(notes.map(n=>n.dur));
}
assert.ok(sequences[0].every(duration=>duration===.5));
for(const index of [1,2])assert.ok(sequences[index].every((duration,i,d)=>i===0||duration>d[i-1]));
assert.ok(sequences[1][2]-sequences[1][1]>sequences[1][1]-sequences[1][0]);
assert.ok(sequences[2][2]-sequences[2][1]<sequences[2][1]-sequences[2][0]);
assert.ok(sequences[3].every((duration,i,all)=>Math.abs(duration-all.at(-i-1))<1e-9));
assert.deepEqual(sequences[4].slice(0,8),[.125,.125,.25,.375,.625,1,1.625,2.625]);assert.deepEqual(sequences[4].slice(0,8),sequences[4].slice(8,16));
a.get('rhythm').value='5';a.get('rhythm').dispatchEvent({type:'change'});assert.deepEqual(JSON.parse(a.run('JSON.stringify(melody.map(n=>n.dur))')),sequences[5]);
a.run("loadSong('cravo')");assert.equal(a.get('rhythm').value,'5');assert.equal(a.run('melody[0].start'),2);
a.get('rhythm').value='0';a.get('rhythm').dispatchEvent({type:'change'});assert.equal(a.run('melody[0].start'),2);
console.log('OK six spacing patterns, deterministic randomness, Fibonacci cycles, positive timing and unchanged pitches.');
