'use strict';
const $=id=>document.getElementById(id), STORAGE='stae302g-practice-v1';
let bank=[],state={mode:'q1',ids:[],orders:{},responses:{},revealed:[],checked:false,hasChecked:false},pending=null,sessions={q1:null,q2:null};
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
// A bare \prime is a full-size baseline symbol; derivatives need superscripts.
function derivativePrimes(tex){return tex.replace(/(\\[A-Za-z]+|[A-Za-z])((?:\\prime)+)/g,(_,base,primes)=>base+'^{'+primes+'}');}
function maths(node,text){const pieces=String(text).split(/(\$[^$]+\$)/g);for(const p of pieces){if(p.startsWith('$')&&p.endsWith('$')){const span=el('span');try{katex.render(derivativePrimes(p.slice(1,-1)),span,{throwOnError:true,strict:'ignore'});}catch(e){span.textContent=p; }node.append(span);}else node.append(document.createTextNode(p));}return node;}
function save(){try{sessions[state.mode]=state;localStorage.setItem(STORAGE,JSON.stringify({version:2,activeMode:state.mode,sessions}));}catch(e){$('action-note').textContent='Storage unavailable; answers remain in this tab.';}}
function current(){return state.ids.map(id=>bank.find(q=>q.id===id));}
function updateProgress(){const qs=current(),answered=qs.filter(q=>q.kind==='q1'?!!state.responses[q.id]:q.answers.every((_,i)=>String((state.responses[q.id]||[])[i]||'').trim())).length;$('completed').textContent=`${answered} / ${qs.length} answered`;$('progress-bar').style.width=`${answered/qs.length*100}%`;}
function changed(){state.checked=false;save();$('result').hidden=true;$('notice').textContent='';document.querySelectorAll('.verdict').forEach(n=>n.remove());document.querySelectorAll('.correct-choice,.wrong-choice,.feedback-correct').forEach(n=>n.classList.remove('correct-choice','wrong-choice','feedback-correct'));document.querySelectorAll('input[aria-invalid]').forEach(n=>n.removeAttribute('aria-invalid'));document.querySelectorAll('.field-message').forEach(n=>n.remove());updateProgress();}
function createSession(mode,previous=[]){const qs=Practice.sample(bank,mode,previous);return {mode,ids:qs.map(q=>q.id),orders:Object.fromEntries(qs.filter(q=>q.options).map(q=>[q.id,q.options])),responses:{},revealed:[],checked:false,hasChecked:false};}
function start(mode){state=createSession(mode,sessions[mode]?.ids||[]);save();render();}
function switchMode(mode){if(!sessions[mode]||mode===state.mode)return;save();state=sessions[mode];render();save();}
function requestStart(mode){if(!bank.length)return;if(Object.values(state.responses).some(v=>Array.isArray(v)?v.some(x=>x.trim()):!!v)) {pending=mode;$('reset-dialog').showModal();}else start(mode);}
function revealPanel(q){if(!state.hasChecked||!state.ids.includes(q.id))return;if(!state.revealed.includes(q.id)){state.revealed.push(q.id);save();}if(state.checked)showScore();}
function mountAnswers(q,article){
 if(article.querySelector('.answer-panel'))return;
  const details=el('details','answer-panel'),summary=el('summary',null,'Answer & explanation');details.append(summary);details.open=state.revealed.includes(q.id);details.addEventListener('toggle',()=>{if(details.open)revealPanel(q);});
  if(q.kind==='q1')details.append(maths(el('div','reference-answer'),q.correct));else{
   q.answers.forEach((a,i)=>details.append(maths(el('div','reference-answer'),(q.labels[i]?q.labels[i]+': ':'')+'$'+a.latex+'$')));
  }
  details.append(maths(el('p'),q.explanation));article.append(details);
}
function render(){
 const mode=state.mode;for(const m of ['q1','q2']){$(m).classList.toggle('active',mode===m);$(m).setAttribute('aria-pressed',String(mode===m));}
 $('session-title').textContent=`${mode.toUpperCase()} PRACTICE SET · 20 POINTS`;
 $('instructions').textContent=mode==='q1'?'Choose one answer for each question. No deductions for incorrect answers.':'Give a final answer for each problem. Equivalent expressions are accepted.';
 $('input-help').hidden=mode!=='q2';$('notice').textContent='';$('questions').replaceChildren();$('result').hidden=true;
 current().forEach((q,index)=>{
  const article=el('article','question');article.id='question-'+q.id;
  const top=el('div','question-top');top.append(el('span','question-number',String.fromCharCode(65+index)+'.'),el('span','topic',q.subject==='complex'?'Complex analysis':'ODEs'),el('span','points',`${mode==='q1'?2:4} pts`));article.append(top,maths(el('p','prompt'),q.prompt));
  if(mode==='q1'){
   const choices=el('div','options');choices.setAttribute('role','radiogroup');choices.setAttribute('aria-label','Question '+String.fromCharCode(65+index));
   for(const choice of state.orders[q.id]){const label=el('label','choice'),input=el('input');input.type='radio';input.name=q.id;input.value=choice;input.checked=state.responses[q.id]===choice;input.addEventListener('change',()=>{state.responses[q.id]=choice;changed();});label.append(input,maths(el('span'),choice));choices.append(label);}article.append(choices);
  }else{
   const fields=el('div','answer-fields'+(q.answers.length===1?' single':''));
   q.answers.forEach((a,i)=>{const field=el('div','field'),label=el('label',null,q.labels[i]||(q.unordered?`Value ${i+1} (any order)`:'Your answer')),input=el('input');input.id=q.id+'-'+i;label.htmlFor=input.id;input.type='text';input.spellcheck=false;input.autocomplete='off';input.autocapitalize='off';input.setAttribute('aria-describedby',q.id+'-notation');input.value=(state.responses[q.id]||[])[i]||'';input.placeholder=a.kind==='classification'?'e.g. removable singularity':q.variables.length?'Expression in '+q.variables.join(', '):'Exact value, e.g. 1/3';input.addEventListener('input',()=>{state.responses[q.id]||=Array(q.answers.length).fill('');state.responses[q.id][i]=input.value;changed();});field.append(label,input);fields.append(field);});article.append(fields);
   const note=el('p','variable-note',q.answers.some(a=>a.kind==='classification')?'Use the usual names; give the order of any pole.':q.unordered?'Enter all values, in any order.':q.variables.length?'Use '+q.variables.join(', ')+(q.variables.includes('z')?'; conj(z) means the complex conjugate of z.':'. Exact expressions are preferred.'):'Enter an exact value.');note.id=q.id+'-notation';article.append(note);
  }
  if(state.hasChecked)mountAnswers(q,article);$('questions').append(article);
 });
 $('check').disabled=false;$('reveal').hidden=!state.hasChecked;$('reveal').disabled=!state.hasChecked;updateProgress();if(state.checked)check(false);
}
function check(scroll=true){
 state.hasChecked=true;$('reveal').hidden=false;$('reveal').disabled=false;
 $('notice').textContent='';document.querySelectorAll('.verdict,.field-message').forEach(n=>n.remove());document.querySelectorAll('.correct-choice,.wrong-choice,.feedback-correct').forEach(n=>n.classList.remove('correct-choice','wrong-choice','feedback-correct'));
 current().forEach(q=>{
  const result=Practice.grade(q,state.responses[q.id]||(q.kind==='q1'?'':[]),math),article=$('question-'+q.id);
  mountAnswers(q,article);
  const notation=result.fields.some(f=>f.error&&f.error!=='No answer entered.');
  article.insertBefore(el('p','verdict '+(result.correct?'good':'bad'),result.correct?'✓ Correct':notation?'! Check notation':'× Not yet correct'),article.querySelector('.answer-panel'));
  if(q.kind==='q1')article.querySelectorAll('input').forEach(input=>{if(input.value===q.correct)input.parentElement.classList.add('correct-choice');else if(input.checked)input.parentElement.classList.add('wrong-choice');});
  else article.querySelectorAll('.field').forEach((field,i)=>{field.classList.toggle('feedback-correct',result.fields[i].correct);field.querySelector('input').setAttribute('aria-invalid',String(!result.fields[i].correct));if(!result.fields[i].correct)field.append(el('p','field-message',result.fields[i].error||'Try again, or view the answer below.'));});
 });
 state.checked=true;save();showScore();if(scroll)$('result').scrollIntoView({behavior:'smooth',block:'center'});
}
function showScore(){let count=0;current().forEach(q=>{if(Practice.grade(q,state.responses[q.id]||(q.kind==='q1'?'':[]),math).correct)count++;});const pts=state.mode==='q1'?2:4;const result=$('result');result.replaceChildren();result.append(el('span','score',`${count*pts} / 20`));const copy=el('div','score-copy');copy.append(el('strong',null,`${count} of ${state.ids.length} questions correct`),el('p',null,state.revealed.length?'Practice score · answers have been viewed. Edit your answers and check again.':'Review the feedback below. You can edit an answer and check again.'));result.append(copy);result.hidden=false;}
$('q1').onclick=()=>switchMode('q1');$('q2').onclick=()=>switchMode('q2');$('new').onclick=()=>requestStart(state.mode);$('check').onclick=()=>check();
$('reveal').onclick=()=>{if(!state.hasChecked)return;document.querySelectorAll('.answer-panel').forEach(d=>{d.open=true;});state.revealed=[...state.ids];save();if(state.checked)showScore();};
$('reset-dialog').addEventListener('close',()=>{if($('reset-dialog').returnValue==='replace'&&pending)start(pending);pending=null;});
fetch('bank.json').then(r=>{if(!r.ok)throw Error('Question bank could not be loaded.');return r.json();}).then(data=>{
 bank=data;const counts={q1:bank.filter(q=>q.kind==='q1').length,q2:bank.filter(q=>q.kind==='q2').length};$('bank-info').textContent=`${bank.length} questions: ${counts.q1} multiple choice and ${counts.q2} answer-only.`;
 let old;try{old=JSON.parse(localStorage.getItem(STORAGE));}catch(e){}
 const stored=old?.version===2&&old.sessions?old.sessions:{};
 let revisedOptions=false;
 for(const mode of ['q1','q2']){
  const saved=stored[mode];
  const valid=saved&&saved.mode===mode&&Array.isArray(saved.ids)&&saved.ids.length===(mode==='q1'?10:5)&&new Set(saved.ids).size===saved.ids.length&&saved.ids.every(id=>bank.some(q=>q.id===id&&q.kind===mode))&&saved.orders&&saved.responses&&Array.isArray(saved.revealed);
  if(!valid){sessions[mode]=createSession(mode);continue;}
  saved.hasChecked=saved.hasChecked===true||saved.checked===true;
  if(!saved.hasChecked)saved.revealed=[];
  for(const id of saved.ids){
   const q=bank.find(q=>q.id===id);if(q.kind!=='q1')continue;
   if(saved.responses[id]&&!q.options.includes(saved.responses[id])){delete saved.responses[id];saved.checked=false;revisedOptions=true;}
   const order=saved.orders[id];if(!Array.isArray(order)||order.length!==q.options.length||new Set(order).size!==q.options.length||order.some(v=>!q.options.includes(v)))saved.orders[id]=Practice.shuffle(q.options);
  }
  sessions[mode]=saved;
 }
 const active=old?.version===2?old.activeMode:'q1';
 state=sessions[['q1','q2'].includes(active)?active:'q1'];
 render();save();
 if(revisedOptions)$('notice').textContent='Some answer options have been updated. Please answer those items and check again.';
}).catch(e=>{$('questions').textContent='The practice set could not be loaded. Please reload the page.';$('notice').textContent=e.message;});
