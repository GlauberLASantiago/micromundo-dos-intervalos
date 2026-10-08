const assert=require('node:assert/strict');const {app}=require('./challenges.cjs');const a=app(false);
assert.equal(a.run('songs.filter(song=>song.math).length'),0);
const contours=JSON.parse(a.run('JSON.stringify(songs.filter(song=>song.contour))'));assert.equal(contours.length,8);
assert.equal(a.run('rhythms.length'),37);
for(const song of contours){
 a.run(`loadSong(${JSON.stringify(song.id)})`);
 const notes=JSON.parse(a.run('JSON.stringify(melody)'));
 assert.deepEqual(notes.map(({letter,alt,octave,midi})=>({letter,alt,octave,midi})),song.contour.expectedNotes);
 assert.ok(notes.every((note,i)=>i===0||note.midi!==notes[i-1].midi));
 assert.ok(!song.tokens.includes('1j'));assert.ok(song.contour.weights.some(weight=>weight>0.5));
 assert.equal(song.contour.weights.reduce((sum,w)=>sum+w,0),song.contour.sampleCount/2);
 assert.equal(a.get('contourInfo').hidden,false);assert.match(a.get('contourInfo').innerHTML,/<svg/);
 assert.equal(a.get('song').value,song.id);
 for(let index=0;index<36;index++){
  const code=a.get('code').value,start=a.get('start').value;
  a.get('rhythm').value=String(index);a.get('rhythm').dispatchEvent({type:'change'});
  assert.equal(a.get('code').value,code);assert.equal(a.get('start').value,start);
  assert.equal(a.run('lastErrorKey'),null);
  const durations=JSON.parse(a.run('JSON.stringify(melody.map(n=>n.dur))'));
  const pattern=JSON.parse(a.run(`JSON.stringify(spacingDurations(${notes.length}))`));
  assert.deepEqual(durations,pattern.map((duration,i)=>duration*song.contour.weights[i]));
 }
 if(song.contour.mode==='diatonic')assert.ok(notes.every(note=>note.alt===0));else assert.ok(notes.some(note=>note.alt!==0));
}
a.run("loadSong('marcha')");assert.equal(a.get('contourInfo').hidden,true);
console.log('OK eight silhouettes, merged repeated heights, proportional held notes and all 36 rhythm/spacing options.');
