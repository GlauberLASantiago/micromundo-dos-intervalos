const assert=require('node:assert/strict');
const {app}=require('./challenges.cjs');
const a=app(false);
const catalog=JSON.parse(a.run('JSON.stringify(songs.filter(song=>song.math))'));
assert.equal(a.run('mathFunctions.length'),36);assert.equal(catalog.length,72);
assert.equal(a.get('song').value,'marcha');
for(const song of catalog){
 a.run(`loadSong(${JSON.stringify(song.id)})`);
 const notes=JSON.parse(a.run('JSON.stringify(melody.map(({letter,alt,octave,midi})=>({letter,alt,octave,midi})))'));
 assert.deepEqual(notes,song.math.expectedNotes,`interval decoding: ${song.title}`);
 assert.equal(a.run('lastErrorKey'),null);assert.equal(a.get('song').value,song.id);
 assert.equal(a.get('mathInfo').hidden,false);assert.ok(a.get('mathInfo').textContent.includes(song.math.formula));
 assert.ok(notes.every(note=>Number.isFinite(note.midi)&&note.midi>=60&&note.midi<=84));
 assert.ok(song.math.samples.every(sample=>Number.isFinite(sample.y)));
 assert.equal(notes.length,song.math.index===12?16:48);
 assert.ok(Math.max(...notes.map(note=>note.midi))>Math.min(...notes.map(note=>note.midi)));
 if(song.math.mode==='diatonic'){
  assert.ok(notes.every(note=>note.alt===0),song.title);
  a.get('challengeOn').checked=true;a.get('challengeOn').dispatchEvent({type:'change'});
  assert.equal(a.run('lastErrorKey'),null,`diatonic restriction: ${song.title}`);
 }else{
  assert.ok(notes.some(note=>note.alt!==0),`must contain chromatic notes: ${song.title}`);
  a.get('challengeOn').checked=true;a.get('challengeOn').dispatchEvent({type:'change'});
  assert.notEqual(a.run('lastErrorKey'),null,`must fail C major restriction: ${song.title}`);
 }
}
assert.ok(Math.abs(a.run('besselJ0(0)')-1)<1e-12);
assert.ok(Math.abs(a.run('besselJ0(2.404825557695773)'))<1e-10);
assert.ok(Math.abs(a.run('erfApprox(1)')-0.8427007929497149)<1e-8);
assert.ok(Math.abs(a.run('erfApprox(-1)')+0.8427007929497149)<1e-8);
assert.equal(a.run('mathFunctions[14][4](0)'),1);
const fibonacci=catalog.find(song=>song.math.index===12);
assert.deepEqual(fibonacci.math.samples.map(sample=>sample.y),[0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610]);
assert.equal(fibonacci.math.mapping,'ln(1 + Fₙ)');
for(const index of [1,5,6,7,12,13,23,24,30,31,32]){
 const song=catalog.find(song=>song.math.index===index&&song.math.mode==='diatonic');
 assert.ok(song.math.expectedNotes.every((note,i,notes)=>i===0||note.midi>=notes[i-1].midi),`increasing curve ${song.title}`);
}
for(const index of [2,4,11,15,22,26,33]){
 const samples=catalog.find(song=>song.math.index===index).math.samples;
 assert.ok(samples.every((sample,i)=>Math.abs(sample.y-samples.at(-i-1).y)<1e-9),`symmetric curve ${index}`);
}
a.run("loadSong('math-9-chromatic')");const code=a.get('code').value;
a.get('rhythm').value='2';a.get('rhythm').dispatchEvent({type:'change'});
assert.equal(a.get('song').value,'math-9-chromatic');assert.equal(a.get('code').value,code);
a.input('a2ma ');assert.equal(a.get('song').value,'');assert.equal(a.get('mathInfo').hidden,true);
a.run("loadSong('marcha')");assert.equal(a.get('mathInfo').hidden,true);
console.log('OK 36 functions / 72 melodies: intervals, pitches, diatonic/chromatic restrictions, formulas, special functions and selector transitions.');
