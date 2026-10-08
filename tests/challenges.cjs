const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
let passed = 0;
function app() {
  const elements = new Map();
  const canvas = new Proxy({}, {get: (obj, key) => obj[key] ?? (() => {})});
  function element(id = '') {
    const listeners = {};
    const el = {id, value: '', checked: false, textContent: '', className: '', options: [], width: 900, height: 430,
      classList: {add() {}, remove() {}},
      append(...items) {this.options.push(...items); if (!this.value && items[0]?.value) this.value = items[0].value;},
      replaceWith() {}, replaceChildren() {}, focus() {}, getContext: () => canvas,
      closest: () => ({previousElementSibling: {}, nextElementSibling: {}}),
      querySelector: selector => get(selector),
      addEventListener(event, fn) {(listeners[event] ??= []).push(fn);},
      dispatchEvent(event) {for (const fn of listeners[event.type] || []) fn(event);},
    };
    return el;
  }
  function get(id) {if (!elements.has(id)) elements.set(id, element(id)); return elements.get(id);}
  get('challengeType').value = 'free'; get('keySig').value = '0'; get('tempo').value = '108';
  const context = vm.createContext({document: {getElementById: get, querySelector: get, createElement: () => element()},
    console, Event: class {constructor(type) {this.type = type;}}, window: {}, cancelAnimationFrame() {}, requestAnimationFrame() {return 1;}, performance: {now: () => 0}});
  vm.runInContext(script, context);
  vm.runInContext(`let errorCount=0,noteCount=0;errorSound=()=>{errorCount++};tone=()=>{noteCount++};glide=async()=>true;
    els.start.value=JSON.stringify({letter:0,alt:0,octave:4,midi:60});els.code.value='';challengeOn.checked=true;prepare();`, context);
  return {run: code => vm.runInContext(code, context), get, input(value) {get('code').value=value;get('code').dispatchEvent({type:'input'});}};
}
async function test(label, check) {await check(app());passed++;console.log('OK '+label);}
(async () => {
 await test('preserves valid prefix and identifies offending interval', a => {
  a.input('a2ma a2me ');
  assert.equal(a.run('melody.length'),2);assert.match(a.get('status').textContent,/posição 2/);
  assert.equal(a.run('errorCount'),1);
  a.input('a2ma a2me a2ma ');assert.equal(a.run('errorCount'),1);
  a.get('code').dispatchEvent({type:'change'});assert.equal(a.run('errorCount'),1);
 });
 await test('correction clears error and a later recurrence sounds again', a => {
  a.input('a2me ');a.input('a2ma ');assert.equal(a.run('lastErrorKey'),null);
  assert.equal(a.run('melody.length'),2);a.input('a2me ');assert.equal(a.run('errorCount'),2);
 });
 await test('complete commands validate before a space; space does not duplicate audio', a => {
  a.input('a2ma');assert.equal(a.run('melody.length'),2);assert.equal(a.run('noteCount'),1);
  a.input('a2ma ');assert.equal(a.run('noteCount'),1);
  a.input('a2ma a2me');assert.equal(a.run('errorCount'),1);a.input('a2ma a2me ');assert.equal(a.run('errorCount'),1);
 });
 await test('incomplete commands wait; finalizing an incomplete command reports an error', a => {
  for(const value of ['a','a2','a2m'])a.input(value);
  assert.equal(a.run('errorCount'),0);assert.equal(a.run('melody.length'),1);
  a.input('a2m ');assert.equal(a.run('errorCount'),1);assert.match(a.get('status').textContent,/inválido/);
 });
 await test('four and eight missions require exact counts including start', a => {
  for(const [type,goal] of [['four',4],['eight',8]]) {
   a.run(`challengeType.value='${type}';els.code.value=Array(${goal-1}).fill('a1j').join(' ');prepare()`);
   assert.match(a.get('challengeFeedback').textContent,/concluído/);
   a.run("els.code.value+=' a1j';prepare()");assert.match(a.get('challengeFeedback').textContent,/exatamente/);
   assert.match(a.get('challengeFeedback').className,/error/);
  }
 });
 await test('return mission checks exact count, spelling and octave', a => {
  a.run("challengeType.value='return';els.code.value=Array(7).fill('a1j').join(' ');prepare()");
  assert.match(a.get('challengeFeedback').textContent,/concluído/);
  a.run("els.code.value+=' a2ma';prepare()");assert.match(a.get('challengeFeedback').textContent,/exatamente/);
  a.run("els.code.value=Array(6).fill('a1j').concat('a2ma','d2ma').join(' ');prepare()");assert.match(a.get('challengeFeedback').textContent,/exatamente/);
  a.run("els.code.value=Array(6).fill('a1j').concat('a8j').join(' ');prepare()");assert.match(a.get('challengeFeedback').textContent,/mesma grafia e oitava/);
 });
 await test('pending command cannot show mission completed', a => {
  a.run("challengeType.value='four'");a.input('a1j a1j a1j a2');
  assert.doesNotMatch(a.get('challengeFeedback').textContent,/concluído/);
 });
 await test('invalid initial note renders no accepted note', a => {
  a.run("els.start.value=JSON.stringify({letter:0,alt:1,octave:4,midi:61});prepare()");
  assert.equal(a.run('melody.length'),0);assert.equal(a.get('notes').innerHTML,'');assert.match(a.get('status').textContent,/nota inicial/);
 });
 await test('strict diatonic spelling is applied to all fifteen signatures', a => {
  for(let key=0;key<15;key++)for(let letter=0;letter<7;letter++) {
   a.run(`keySig.value='${key}'`);
   const alt=a.run(`alterations[${key}][${letter}]`);
   assert.equal(a.run(`allowedNote({letter:${letter},alt:${alt}})`),true);
   assert.equal(a.run(`allowedNote({letter:${letter},alt:${alt+1}})`),false);
  }
 });
 await test('disabling challenge removes diatonic error and hides challenge-only feedback', a => {
  a.input('a2me ');a.get('challengeOn').checked=false;a.get('challengeOn').dispatchEvent({type:'change'});
  assert.equal(a.run('melody.length'),2);assert.equal(a.get('challengeFeedback').textContent,'');
  a.input('xyz ');assert.match(a.get('status').textContent,/inválido/);assert.equal(a.get('challengeFeedback').textContent,'');
 });
 await test('quality, numeric limits and range errors identify their positions', a => {
  a.run('challengeOn.checked=false');
  for(const code of ['a2j','a23ma','a0j','d22aum']) {
   a.get('code').value='a1j '+code;assert.equal(a.run('prepare()'),false);assert.equal(a.run('melody.length'),2);
  }
 });
 await test('play and step both block invalid full input and notify only once', async a => {
  a.get('code').value='a2me';await a.run('step()');assert.equal(a.run('noteCount'),0);assert.equal(a.run('errorCount'),1);
  await a.run('play()');assert.equal(a.run('noteCount'),0);assert.equal(a.run('errorCount'),1);
 });
 await test('step cannot play a stale preview while an invalid token is in the editor', async a => {
  a.input('a2ma ');a.get('code').value='a2ma a2m';const before=a.run('noteCount');
  await a.run('step()');assert.equal(a.run('noteCount'),before);assert.match(a.get('status').textContent,/posição 2/);
 });
 await test('step still advances across valid notes', async a => {
  a.get('code').value='a2ma a2ma';
  await a.run('step()');assert.equal(a.run('cursor'),1);await a.run('step()');assert.equal(a.run('cursor'),2);
 });
 console.log(`${passed} tests passed.`);
})().catch(error => {console.error(error);process.exitCode=1;});
