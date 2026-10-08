const assert=require('node:assert/strict');
const {app}=require('./challenges.cjs');
const examples={
 majorUp:['a2ma a2ma a2me a2ma a2ma a2ma a2me',[0,2,4,5,7,9,11,12]],
 majorDown:['d2me d2ma d2ma d2ma d2me d2ma d2ma',[0,-1,-3,-5,-7,-8,-10,-12]],
 minorUp:['a2ma a2me a2ma a2ma a2me a2ma a2ma',[0,2,3,5,7,8,10,12]],
 minorDown:['d2ma d2ma d2me d2ma d2ma d2me d2ma',[0,-2,-4,-5,-7,-9,-10,-12]],
 maj7:['a3ma a3me a3ma',[0,4,7,11]],dom7:['a3ma a3me a3me',[0,4,7,10]],
 min7:['a3me a3ma a3me',[0,3,7,10]],halfDim:['a3me a3me a3ma',[0,3,6,10]],
 dim7:['a3me a3me a3me',[0,3,6,9]],minMaj7:['a3me a3ma a3ma',[0,3,7,11]],
 six:['a3ma a3me a2ma',[0,4,7,9]]
};
for(const [id,[code,offsets]] of Object.entries(examples)){
 const a=app();a.run(`challengeOn.checked=false;challengeType.value='${id}';els.code.value='${code}';prepare()`);
 assert.match(a.get('challengeFeedback').textContent,/concluída/);
 assert.deepEqual(JSON.parse(a.run('JSON.stringify(melody.map(n=>n.midi-60))')),offsets);
 a.run("els.start.value=JSON.stringify({letter:3,alt:1,octave:4,midi:66});prepare()");
 assert.match(a.get('challengeFeedback').textContent,/concluída/);
 a.run("els.code.value+=' 1j';prepare()");assert.match(a.get('challengeFeedback').className,/error/);
 a.run("els.code.value='1j';prepare()");assert.match(a.get('challengeFeedback').className,/error/);
 a.get('newChallenge').dispatchEvent({type:'click'});
 assert.equal(a.run('JSON.parse(els.start.value).midi'),66);assert.equal(a.get('challengeOn').checked,false);
 assert.match(a.get('challengeFeedback').textContent,/1\//);
}
const a=app();
a.run("challengeOn.checked=false;challengeType.value='maj7';els.code.value='a4dim a3ma a3ma';prepare()");
assert.match(a.get('challengeFeedback').className,/error/,'enharmonic notes must have correct chord spelling');
a.run("els.canvas.toDataURL=()=> 'data:image/png;base64,chart';challengeType.value='maj7';els.code.value='a3ma a3me a3ma';prepare()");
a.get('reverb').value='35';a.get('challengeType').options=[{textContent:'X7M ou Xmaj7'}];a.get('challengeType').selectedIndex=0;
const report=a.run(`reportHtml('<Aluno & teste>',new Date('2026-10-08T15:30:00Z'))`);
for(const text of ['&lt;Aluno &amp; teste&gt;','08/10/2026','12:30:00','data:image/png;base64,chart','X7M ou Xmaj7','Desenvolvido com o app Micromundo dos intervalos','https://glauberlasantiago.github.io/micromundo-dos-intervalos/','Dó4'])assert.ok(report.includes(text),text);
for(const removed of ['Andamento','Ritmo / espaçamento','Reverberação','Resultado','Estado da sequência','Intervalos digitados','Pausa inicial','Pausa final','Notas e durações','<table'])assert.ok(!report.includes(removed),removed);
assert.ok(!report.includes('<Aluno & teste>'),'report escapes student text');
console.log('OK all eleven missions, transposition, spelling, restart, excess/wrong notes and PDF report contents/timezone.');
