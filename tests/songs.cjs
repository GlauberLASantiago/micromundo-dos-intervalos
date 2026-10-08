const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {app}=require('./challenges.cjs');
function score(file){
 const xml=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
 const divisions=Number(xml.match(/<divisions>(\d+)<\/divisions>/)[1]);
 const events=[...xml.matchAll(/<note\b[^>]*>([\s\S]*?)<\/note>/g)].map(([,note])=>{
  const dur=Number(note.match(/<duration>(\d+)<\/duration>/)[1])/divisions;
  if(/<rest\b/.test(note))return {rest:true,dur};
  const step=note.match(/<step>([A-G])<\/step>/)[1];
  const octave=Number(note.match(/<octave>(\d+)<\/octave>/)[1]);
  const alt=Number(note.match(/<alter>(-?\d+)<\/alter>/)?.[1]||0);
  const letter='CDEFGAB'.indexOf(step);
  return {letter,alt,octave,midi:12*(octave+1)+[0,2,4,5,7,9,11][letter]+alt,dur};
 });
 let time=0;const notes=[];
 for(const event of events){if(!event.rest)notes.push({...event,start:time});time+=event.dur;}
 return {notes,total:time};
}
function transposeCravo(score){
 return {...score,notes:score.notes.map(note=>{
  const absolute=note.octave*7+note.letter-1,letter=((absolute%7)+7)%7,octave=Math.floor(absolute/7),midi=note.midi-2;
  return {...note,letter,octave,midi,alt:midi-(12*(octave+1)+[0,2,4,5,7,9,11][letter])};
 })};
}
(async()=>{
 const a=app(false);
 assert.equal(a.get('song').value,'marcha');assert.equal(a.run('melody.length'),24);
 assert.match(a.get('demoContext').textContent,/Marcha Soldado/);
 a.run('let waits=[];waitRemaining=async(ms)=>{waits.push(ms);return true};tone=()=>{noteCount++}');
 for(const [id,file,count] of [['marcha','marcha-soldado.musicxml',24],['cravo','o-cravo-brigou-com-a-rosa.musicxml',32]]){
  a.get('song').value=id;a.get('song').dispatchEvent({type:'change',target:a.get('song')});
  const expected=id==='cravo'?transposeCravo(score(file)):score(file);
  const actual=JSON.parse(a.run('JSON.stringify(melody.map(({letter,alt,octave,midi,dur,start})=>({letter,alt,octave,midi,dur,start})))'));
  assert.equal(actual.length,count);assert.deepEqual(actual,expected.notes);
  assert.equal(a.run('challengeOn.checked'),false);
  assert.equal(a.get('song').value,id);
  const title=id==='marcha'?'Marcha Soldado':'O Cravo Brigou com a Rosa';
  assert.ok(a.get('investigation').innerHTML.includes(title));
  assert.doesNotMatch(a.get('demoContext').textContent,/Ode à Alegria/);
  a.run('waits=[]');
  const previous=a.run('noteCount');await a.run('play()');assert.equal(a.run('noteCount')-previous,count);
  const waits=JSON.parse(a.run('JSON.stringify(waits)'));
  const msPerBeat=a.run('60000/tempo()');
  if(id==='cravo')assert.equal(waits[0],2*msPerBeat);
  assert.equal(waits.at(-1),2*msPerBeat);
  const tail=a.run('rhythms[+els.rhythm.value][2].trailingRest');
  const last=actual.at(-1);assert.equal(last.start+last.dur+tail,expected.total);
  a.run('waits=[]');
  if(id==='cravo'){
   assert.equal(a.get('keySig').value,'9');assert.equal(actual[0].midi,65);assert.equal(actual[0].letter,3);
   assert.ok(actual.some(n=>n.letter===6&&n.alt===-1));assert.ok(actual.some(n=>n.letter===2&&n.alt===-1));
   a.get('challengeOn').checked=true;a.get('challengeOn').dispatchEvent({type:'change'});assert.equal(a.run('lastErrorKey'),null);assert.equal(a.run('melody.length'),32);
  }
  console.log('OK '+title+': pitches, durations and pauses match '+(id==='cravo'?'MusicXML transposed down a whole tone.':'MusicXML.'));
 }
 const rhythmApp=app(false);
 rhythmApp.get('rhythm').value='32';rhythmApp.get('rhythm').dispatchEvent({type:'change'});
 assert.equal(rhythmApp.get('song').value,'cravo');
 assert.deepEqual(JSON.parse(rhythmApp.run('JSON.stringify(melody.map(n=>({letter:n.letter,alt:n.alt,octave:n.octave,midi:n.midi,dur:n.dur,start:n.start})))')),transposeCravo(score('o-cravo-brigou-com-a-rosa.musicxml')).notes);
 const cravoCode=rhythmApp.get('code').value;
 rhythmApp.get('rhythm').value='0';rhythmApp.get('rhythm').dispatchEvent({type:'change'});
 assert.equal(rhythmApp.get('code').value,cravoCode);assert.equal(rhythmApp.get('song').value,'cravo');
 rhythmApp.get('rhythm').value='31';rhythmApp.get('rhythm').dispatchEvent({type:'change'});assert.equal(rhythmApp.get('song').value,'marcha');
 rhythmApp.get('rhythm').value='30';rhythmApp.get('rhythm').dispatchEvent({type:'change'});assert.equal(rhythmApp.get('song').value,'ode');
 console.log('OK named rhythm options load their matching melody; generic patterns preserve notes.');
 a.run("loadSong('ode')");assert.equal(a.run('melody.length'),15);
 assert.match(a.get('demoContext').textContent,/Ode à Alegria/);
 a.input('a2ma ');assert.equal(a.get('song').value,'');assert.equal(a.get('demoContext').textContent,'');
 console.log('OK initial selection, song switching and contextual captions.');
})().catch(err=>{console.error(err);process.exitCode=1;});
